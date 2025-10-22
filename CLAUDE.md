# ClubNath VIP - React Native + Supabase

## 🚨 REGRAS CRÍTICAS

- NUNCA edite arquivos em src/legacy/
- NUNCA faça commit direto na main
- SEMPRE rode testes antes de commitar
- NÃO modifique package.json sem aprovação explícita
- NÃO crie arquivos duplicados (Component2, utilsNew, etc)
- NUNCA remova funcionalidades premium existentes

## 🎯 CONTEXTO DO PROJETO

### Tech Stack
- Framework: React Native 0.74 / Expo SDK 51
- Linguagem: TypeScript 5.3 (strict mode)
- Backend: Supabase (auth, database, realtime, storage)
- State: React Query (TanStack Query) + Context API
- Styling: NativeWind (Tailwind CSS)
- Navegação: React Navigation 6.x
- Forms: React Hook Form + Zod
- Testes: Jest + React Native Testing Library
- PWA: Service Worker, Manifest, Install Prompt

### Estrutura do Projeto
```
src/
├── api/           # React Query hooks por domínio
│   ├── posts/     # usePosts, useCreatePost, etc
│   └── users/     # useUserProfile, etc
├── components/
│   ├── ui/        # Design system (Button, Input, Card)
│   └── shared/    # Componentes de negócio (UserAvatar, PostCard)
├── features/      # Features completas (auth, profile, posts)
│   └── auth/
│       ├── components/  # LoginForm, SignupForm
│       ├── screens/     # LoginScreen, SignupScreen
│       └── hooks/       # useAuth
├── lib/
│   ├── supabase/  # Cliente e helpers Supabase
│   └── hooks/     # Hooks compartilhados
├── navigation/    # Configuração de rotas
├── types/         # TypeScript types globais
└── utils/         # Funções utilitárias
```

## 🔧 PADRÕES DE DESENVOLVIMENTO

### Componentes React Native
```typescript
// ✅ CORRETO
interface ButtonProps {
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onPress, 
  variant = 'primary',
  loading 
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className={cn(
        'px-4 py-3 rounded-lg',
        variant === 'primary' && 'bg-blue-600',
        variant === 'secondary' && 'bg-gray-200'
      )}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white font-semibold">
          Press me
        </Text>
      )}
    </Pressable>
  );
};

// ❌ ERRADO
const Button = (props) => { /* sem tipos */ }
const Button = () => <TouchableOpacity style={{...}} /> // inline styles
```

### Integração com Supabase
```typescript
// ✅ CORRETO - React Query hook
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Post[];
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPost: NewPost) => {
      const { data, error } = await supabase
        .from('posts')
        .insert(newPost)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// ❌ ERRADO
const posts = await supabase.from('posts').select(); // direto no componente
```

### Tratamento de Erros
```typescript
// ✅ CORRETO
try {
  const { data, error } = await supabase
    .from('posts')
    .insert(newPost);
  
  if (error) throw error;
  
  Alert.alert('Sucesso', 'Post criado!');
  navigation.goBack();
} catch (error) {
  console.error('Error creating post:', error);
  Alert.alert(
    'Erro',
    error instanceof Error 
      ? error.message 
      : 'Erro ao criar post'
  );
}

// ❌ ERRADO
const data = await supabase.from('posts').insert(newPost); // sem erro handling
```

## 📋 COMANDOS

### Desenvolvimento
- `npm start` - Inicia Expo dev server
- `npm run ios` - Roda no iOS simulator
- `npm run android` - Roda no Android emulator
- `npm test` - Roda suite de testes
- `npm run test:watch` - Testes em watch mode
- `npm run lint` - ESLint
- `npm run type-check` - TypeScript check

### Git Workflow
- Branch: `feature/TASK-123-descricao` ou `fix/TASK-123-descricao`
- Commit: `[TASK-123] Descrição das mudanças`
- SEMPRE criar PR para review
- Squash commits antes de merge

## 🐛 PROBLEMAS CONHECIDOS

- FlatList com 500+ items tem performance ruim → use paginação
- Keyboard avoiding no iOS é bugado em Modals → use wrapper customizado
- Botão voltar do Android precisa handling manual em navegadores nested

## 🔒 SEGURANÇA

- NUNCA commite arquivos .env
- API keys via environment variables
- React Native Keychain para dados sensíveis
- Valide TODOS os inputs de usuário
- Sanitize dados antes de renderizar

## 📱 BEST PRACTICES MOBILE

- Unidades responsivas (%, não px fixos)
- Teste em múltiplos tamanhos de tela
- Acessibilidade (screen readers, dynamic text)
- Otimize imagens para mobile
- Handle cenários offline graciosamente
- Respeite preferências do sistema (dark mode)

## ⚠️ INSTRUÇÕES ESPECÍFICAS PARA CLAUDE

Quando implementar features:
1. SEMPRE verifique se funcionalidade similar já existe
2. Reutilize componentes e hooks existentes
3. Siga os padrões estabelecidos rigorosamente
4. Inclua tipos TypeScript para tudo
5. Adicione JSDoc comments para funções exportadas
6. Escreva testes junto com implementação
7. Pergunte se algo não está claro nos requisitos
8. Para navegação, SEMPRE teste deep linking
9. Para APIs, use React Query, não fetch/axios direto
10. NUNCA deixe console.log em código de produção
11. ANTES de criar arquivo novo, verifique se similar já existe
12. MANTENHA funcionalidades premium existentes
13. FOQUE em UX mobile-first para influenciadora de 35M seguidores