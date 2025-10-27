-- Tabela de rotinas
CREATE TABLE routines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(30) NOT NULL CHECK (length(trim(title)) > 0),
  icon TEXT NOT NULL CHECK (icon IN ('feeding', 'bathing', 'sleeping', 'activities')),
  time TEXT NOT NULL CHECK (time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekdays', 'weekends', 'custom')),
  custom_days INTEGER[] DEFAULT NULL,
  active BOOLEAN DEFAULT true,
  completed_at TIMESTAMPTZ DEFAULT NULL,
  shared_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_routines_user_id ON routines(user_id);
CREATE INDEX idx_routines_time ON routines(time);
CREATE INDEX idx_routines_active ON routines(active) WHERE active = true;

-- RLS (Row Level Security)
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own routines"
  ON routines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routines"
  ON routines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routines"
  ON routines FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routines"
  ON routines FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_routines_updated_at
  BEFORE UPDATE ON routines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Tabela para compartilhamento
CREATE TABLE shared_routines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  routine_ids UUID[] NOT NULL,
  shared_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_shared_routines_created_by ON shared_routines(created_by);
