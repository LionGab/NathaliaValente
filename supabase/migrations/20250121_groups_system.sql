-- =====================================================
-- CLUBNATH GRUPOS TEMÁTICOS - SCHEMA COMPLETO
-- Santuário Digital de Empatia e Pertencimento
-- =====================================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABELA DE GRUPOS TEMÁTICOS
-- =====================================================
CREATE TABLE IF NOT EXISTS groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'Fé', 'Amamentação', 'Pós-Parto', 'Mães Solo', 'Criação', 
        'Bem-estar', 'Educação', 'Relacionamentos', 'Carreira', 'Outros'
    )),
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_private BOOLEAN DEFAULT false,
    max_members INTEGER DEFAULT 50,
    current_members INTEGER DEFAULT 1,
    cover_image_url TEXT,
    rules TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT groups_name_length CHECK (char_length(name) >= 3 AND char_length(name) <= 100),
    CONSTRAINT groups_description_length CHECK (char_length(description) >= 10 AND char_length(description) <= 500),
    CONSTRAINT groups_max_members_check CHECK (max_members >= 5 AND max_members <= 200)
);

-- =====================================================
-- 2. TABELA DE MEMBROS DOS GRUPOS
-- =====================================================
CREATE TABLE IF NOT EXISTS group_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_muted BOOLEAN DEFAULT false,
    is_banned BOOLEAN DEFAULT false,
    
    -- Constraints
    UNIQUE(group_id, user_id)
);

-- =====================================================
-- 3. TABELA DE POSTS DOS GRUPOS
-- =====================================================
CREATE TABLE IF NOT EXISTS group_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_url TEXT,
    media_type VARCHAR(20) CHECK (media_type IN ('image', 'video', 'audio')),
    parent_post_id UUID REFERENCES group_posts(id) ON DELETE CASCADE, -- Para replies
    is_pinned BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true, -- Para moderação
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT group_posts_content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000)
);

-- =====================================================
-- 4. TABELA DE REAÇÕES AOS POSTS
-- =====================================================
CREATE TABLE IF NOT EXISTS group_post_reactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES group_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) DEFAULT 'like' CHECK (reaction_type IN (
        'like', 'love', 'support', 'pray', 'hug', 'celebrate'
    )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(post_id, user_id, reaction_type)
);

-- =====================================================
-- 5. TABELA DE CONVITES PARA GRUPOS
-- =====================================================
CREATE TABLE IF NOT EXISTS group_invites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    invited_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invited_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(group_id, invited_user_id)
);

-- =====================================================
-- 6. TABELA DE NOTIFICAÇÕES DE GRUPOS
-- =====================================================
CREATE TABLE IF NOT EXISTS group_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'new_post', 'new_member', 'group_invite', 'post_mentioned', 
        'post_reaction', 'group_updated', 'moderation_action'
    )),
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Dados adicionais (post_id, user_id, etc.)
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para groups
CREATE INDEX IF NOT EXISTS idx_groups_category ON groups(category);
CREATE INDEX IF NOT EXISTS idx_groups_creator ON groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_groups_private ON groups(is_private);
CREATE INDEX IF NOT EXISTS idx_groups_created_at ON groups(created_at DESC);

-- Índices para group_members
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_role ON group_members(role);

-- Índices para group_posts
CREATE INDEX IF NOT EXISTS idx_group_posts_group_id ON group_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_user_id ON group_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_created_at ON group_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_posts_parent ON group_posts(parent_post_id);

-- Índices para group_post_reactions
CREATE INDEX IF NOT EXISTS idx_group_reactions_post_id ON group_post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_group_reactions_user_id ON group_post_reactions(user_id);

-- Índices para group_invites
CREATE INDEX IF NOT EXISTS idx_group_invites_group_id ON group_invites(group_id);
CREATE INDEX IF NOT EXISTS idx_group_invites_invited_user ON group_invites(invited_user_id);
CREATE INDEX IF NOT EXISTS idx_group_invites_status ON group_invites(status);

-- Índices para group_notifications
CREATE INDEX IF NOT EXISTS idx_group_notifications_user_id ON group_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_group_notifications_group_id ON group_notifications(group_id);
CREATE INDEX IF NOT EXISTS idx_group_notifications_is_read ON group_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_group_notifications_created_at ON group_notifications(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS PARA GROUPS
-- =====================================================

-- Usuários podem ver grupos públicos e grupos dos quais são membros
CREATE POLICY "Users can view public groups and their own groups" ON groups
    FOR SELECT USING (
        NOT is_private OR 
        id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid()
        )
    );

-- Usuários podem criar grupos (máximo 5 por usuário)
CREATE POLICY "Users can create groups" ON groups
    FOR INSERT WITH CHECK (
        auth.uid() = creator_id AND
        (SELECT COUNT(*) FROM groups WHERE creator_id = auth.uid()) < 5
    );

-- Apenas criadores podem atualizar seus grupos
CREATE POLICY "Creators can update their groups" ON groups
    FOR UPDATE USING (auth.uid() = creator_id);

-- Apenas criadores podem deletar seus grupos
CREATE POLICY "Creators can delete their groups" ON groups
    FOR DELETE USING (auth.uid() = creator_id);

-- =====================================================
-- POLÍTICAS RLS PARA GROUP_MEMBERS
-- =====================================================

-- Usuários podem ver membros de grupos dos quais fazem parte
CREATE POLICY "Users can view members of their groups" ON group_members
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid()
        )
    );

-- Usuários podem se juntar a grupos públicos
CREATE POLICY "Users can join public groups" ON group_members
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM groups 
            WHERE id = group_id AND NOT is_private
        )
    );

-- Usuários podem sair de grupos
CREATE POLICY "Users can leave groups" ON group_members
    FOR DELETE USING (auth.uid() = user_id);

-- Admins podem gerenciar membros
CREATE POLICY "Admins can manage members" ON group_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM group_members gm
            WHERE gm.group_id = group_members.group_id 
            AND gm.user_id = auth.uid() 
            AND gm.role IN ('admin', 'moderator')
        )
    );

-- =====================================================
-- POLÍTICAS RLS PARA GROUP_POSTS
-- =====================================================

-- Usuários podem ver posts de grupos dos quais fazem parte
CREATE POLICY "Users can view posts of their groups" ON group_posts
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid()
        )
    );

-- Usuários podem criar posts em grupos dos quais fazem parte
CREATE POLICY "Users can create posts in their groups" ON group_posts
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND NOT is_banned
        )
    );

-- Usuários podem atualizar seus próprios posts
CREATE POLICY "Users can update their own posts" ON group_posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Usuários podem deletar seus próprios posts
CREATE POLICY "Users can delete their own posts" ON group_posts
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS RLS PARA GROUP_POST_REACTIONS
-- =====================================================

-- Usuários podem ver reações de posts de seus grupos
CREATE POLICY "Users can view reactions of their groups" ON group_post_reactions
    FOR SELECT USING (
        post_id IN (
            SELECT gp.id FROM group_posts gp
            JOIN group_members gm ON gp.group_id = gm.group_id
            WHERE gm.user_id = auth.uid()
        )
    );

-- Usuários podem reagir a posts de seus grupos
CREATE POLICY "Users can react to posts of their groups" ON group_post_reactions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        post_id IN (
            SELECT gp.id FROM group_posts gp
            JOIN group_members gm ON gp.group_id = gm.group_id
            WHERE gm.user_id = auth.uid() AND NOT gm.is_banned
        )
    );

-- Usuários podem remover suas próprias reações
CREATE POLICY "Users can remove their own reactions" ON group_post_reactions
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS RLS PARA GROUP_INVITES
-- =====================================================

-- Usuários podem ver seus convites
CREATE POLICY "Users can view their invites" ON group_invites
    FOR SELECT USING (auth.uid() = invited_user_id);

-- Usuários podem aceitar/declinar convites
CREATE POLICY "Users can respond to their invites" ON group_invites
    FOR UPDATE USING (auth.uid() = invited_user_id);

-- =====================================================
-- POLÍTICAS RLS PARA GROUP_NOTIFICATIONS
-- =====================================================

-- Usuários podem ver suas notificações
CREATE POLICY "Users can view their notifications" ON group_notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem marcar suas notificações como lidas
CREATE POLICY "Users can update their notifications" ON group_notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar contador de membros
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE groups 
        SET current_members = current_members + 1 
        WHERE id = NEW.group_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE groups 
        SET current_members = current_members - 1 
        WHERE id = OLD.group_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar contador de membros
CREATE TRIGGER trigger_update_group_member_count
    AFTER INSERT OR DELETE ON group_members
    FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

-- Função para criar notificação de novo membro
CREATE OR REPLACE FUNCTION notify_new_group_member()
RETURNS TRIGGER AS $$
BEGIN
    -- Notificar admins do grupo sobre novo membro
    INSERT INTO group_notifications (user_id, group_id, type, title, message, data)
    SELECT 
        gm.user_id,
        NEW.group_id,
        'new_member',
        'Novo membro no grupo',
        'Uma nova pessoa se juntou ao grupo',
        jsonb_build_object('new_member_id', NEW.user_id, 'group_id', NEW.group_id)
    FROM group_members gm
    WHERE gm.group_id = NEW.group_id 
    AND gm.role IN ('admin', 'moderator')
    AND gm.user_id != NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificar novo membro
CREATE TRIGGER trigger_notify_new_group_member
    AFTER INSERT ON group_members
    FOR EACH ROW EXECUTE FUNCTION notify_new_group_member();

-- Função para criar notificação de novo post
CREATE OR REPLACE FUNCTION notify_new_group_post()
RETURNS TRIGGER AS $$
BEGIN
    -- Notificar todos os membros do grupo sobre novo post
    INSERT INTO group_notifications (user_id, group_id, type, title, message, data)
    SELECT 
        gm.user_id,
        NEW.group_id,
        'new_post',
        'Novo post no grupo',
        'Há uma nova publicação no grupo',
        jsonb_build_object('post_id', NEW.id, 'group_id', NEW.group_id, 'author_id', NEW.user_id)
    FROM group_members gm
    WHERE gm.group_id = NEW.group_id 
    AND gm.user_id != NEW.user_id
    AND NOT gm.is_muted;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificar novo post
CREATE TRIGGER trigger_notify_new_group_post
    AFTER INSERT ON group_posts
    FOR EACH ROW EXECUTE FUNCTION notify_new_group_post();

-- =====================================================
-- DADOS INICIAIS - GRUPOS EXEMPLO
-- =====================================================

-- Inserir grupos de exemplo (após criar usuário de teste)
-- INSERT INTO groups (name, description, category, creator_id, is_private) VALUES
-- ('Mães em Fé', 'Um espaço sagrado para mães que desejam compartilhar sua jornada espiritual e encontrar apoio na fé.', 'Fé', 'user-uuid-here', false),
-- ('Amamentação com Amor', 'Comunidade de apoio para todas as fases da amamentação, sem julgamentos, apenas amor e compreensão.', 'Amamentação', 'user-uuid-here', false),
-- ('Pós-Parto: Renascimento', 'Um lugar seguro para compartilhar os desafios e alegrias do pós-parto, porque toda mãe merece apoio.', 'Pós-Parto', 'user-uuid-here', false);

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================

COMMENT ON TABLE groups IS 'Grupos temáticos do ClubNath - Santuário digital de empatia e pertencimento';
COMMENT ON TABLE group_members IS 'Membros dos grupos com roles e permissões';
COMMENT ON TABLE group_posts IS 'Posts e mensagens dentro dos grupos';
COMMENT ON TABLE group_post_reactions IS 'Reações emocionais aos posts (like, love, support, pray, hug, celebrate)';
COMMENT ON TABLE group_invites IS 'Sistema de convites para grupos privados';
COMMENT ON TABLE group_notifications IS 'Notificações relacionadas aos grupos';

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
