# GitHub Copilot Instructions - ClubNath VIP

This file provides context and guidelines for GitHub Copilot coding agent working on this repository.

## 🎯 Project Overview

**ClubNath VIP** is a Progressive Web App (PWA) for an exclusive community platform for Brazilian influencer Nathália Valente's followers. It's a social platform focused on mothers, featuring posts, groups, direct messages, biblical studies, and a premium store.

### Target Audience
- Primary: Brazilian mothers aged 25-45
- Audience size: 35M+ followers
- Mobile-first experience required
- Premium subscription model

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18.3 with TypeScript 5.5 (strict mode)
- **Build Tool**: Vite 7.1
- **Styling**: TailwindCSS 3.4 with utility-first CSS patterns
- **State Management**: React Query (TanStack Query) + Context API
- **PWA**: Vite PWA Plugin with Service Worker
- **Icons**: Lucide React
- **UI Components**: Custom design system (see DESIGN_SYSTEM.md)
- **CSS Utilities**: clsx + tailwind-merge for class composition

### Backend
- **BaaS**: Supabase (PostgreSQL 15)
- **Authentication**: Supabase Auth with JWT
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Storage**: Supabase Storage for media files
- **Realtime**: Supabase Realtime for live updates

### DevOps & Quality
- **CI/CD**: GitHub Actions
- **Testing**: Vitest (unit) + React Testing Library + Playwright (E2E)
- **Linting**: ESLint 9 + Prettier
- **Error Monitoring**: Sentry
- **Deployment**: Netlify
- **Pre-commit**: Husky + lint-staged

## 📁 Project Structure

```
src/
├── components/          # React components (many top-level components + subdirectories)
│   ├── ui/             # Design system components
│   ├── chat/           # Chat-specific components
│   ├── groups/         # Group-specific components
│   ├── bible-studies/  # Bible study components
│   ├── prayers/        # Prayer components
│   ├── journaling/     # Journaling components
│   ├── badges/         # Badge/achievement components
│   ├── onboarding/     # Onboarding flow components
│   └── sos-emotional/  # Emotional support components
├── design-system/      # Design system tokens and utilities
├── features/           # Feature modules
│   ├── chat/           # Chat feature
│   ├── posts/          # Posts and feed feature
│   ├── profile/        # User profile feature
│   └── shop/           # Shop/store feature
├── lib/                # Libraries and configurations
│   ├── supabase/       # Supabase client and utilities
│   └── sentry.ts       # Error monitoring
├── hooks/              # Custom React hooks
├── contexts/           # React Context providers
├── services/           # Business logic services
├── layouts/            # Layout components
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants
└── data/               # Static data and fixtures

```

## 🚨 CRITICAL RULES

### Never Do
- ❌ **NEVER** edit files in `src/legacy/` directory
- ❌ **NEVER** commit directly to `main` branch
- ❌ **NEVER** modify `package.json` without explicit approval
- ❌ **NEVER** create duplicate files (Component2, utilsNew, etc.)
- ❌ **NEVER** remove existing premium features
- ❌ **NEVER** commit `.env` files or secrets
- ❌ **NEVER** leave `console.log` statements in production code

### Always Do
- ✅ **ALWAYS** run tests before committing
- ✅ **ALWAYS** check if similar functionality exists before creating new files
- ✅ **ALWAYS** reuse existing components and hooks
- ✅ **ALWAYS** follow TypeScript strict mode
- ✅ **ALWAYS** include JSDoc comments for exported functions
- ✅ **ALWAYS** write tests alongside implementation
- ✅ **ALWAYS** validate all user inputs
- ✅ **ALWAYS** sanitize data before rendering (XSS prevention)
- ✅ **ALWAYS** use React Query for API calls, not fetch/axios directly
- ✅ **ALWAYS** create PR for review (never direct commits)

## 🔧 Development Patterns

### Component Structure
```typescript
// ✅ CORRECT - Typed component with proper exports
interface ButtonProps {
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * Primary button component following the design system
 * @param onPress - Handler for button clicks
 * @param variant - Visual style variant
 * @param loading - Shows loading spinner when true
 */
export const Button: React.FC<ButtonProps> = ({ 
  onPress, 
  variant = 'primary',
  loading,
  children 
}) => {
  return (
    <button
      onClick={onPress}
      disabled={loading}
      className={cn(
        'px-4 py-3 rounded-lg font-semibold',
        variant === 'primary' && 'bg-blue-600 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-800'
      )}
    >
      {loading ? <LoadingSpinner /> : children}
    </button>
  );
};

// ❌ WRONG
const Button = (props) => { /* no types */ }
const Button = () => <div style={{...}} /> // inline styles
```

### Supabase Integration with React Query
```typescript
// ✅ CORRECT - React Query hooks for data fetching
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

// ❌ WRONG - Direct calls in components
const posts = await supabase.from('posts').select();
```

### Error Handling
```typescript
// ✅ CORRECT - Proper error handling with user feedback
try {
  const { data, error } = await supabase
    .from('posts')
    .insert(newPost);
  
  if (error) throw error;
  
  toast.success('Post criado com sucesso!');
  navigate('/feed');
} catch (error) {
  console.error('Error creating post:', error);
  toast.error(
    error instanceof Error 
      ? error.message 
      : 'Erro ao criar post. Tente novamente.'
  );
}

// ❌ WRONG - No error handling
const data = await supabase.from('posts').insert(newPost);
```

## 📋 Common Commands

### Development
```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type checking
npm run format           # Format with Prettier
npm run format:check     # Check formatting
```

### Testing
```bash
npm run test             # Unit tests (watch mode)
npm run test:run         # Run all unit tests once
npm run test:coverage    # Coverage report (min 70%)
npm run test:e2e         # E2E tests with Playwright
npm run test:all         # All tests (unit + E2E)
```

### Git Workflow
- Branch naming: `feature/TASK-123-description` or `fix/TASK-123-description`
- Commit format: `[TASK-123] Description of changes` or follow Conventional Commits
- Always create PR for review
- Squash commits before merge

## 🔒 Security Guidelines

### Implemented Security
- ✅ Row Level Security (RLS) on all database tables
- ✅ Environment variables validation
- ✅ Pre-commit hooks for secret detection
- ✅ Input validation on all forms
- ✅ HTML sanitization for XSS prevention
- ✅ Security headers (CSP, X-Frame-Options)
- ✅ Automated dependency audits in CI

### When Working on Security-Sensitive Code
1. Review `SECURITY.md` for guidelines
2. Never expose API keys or secrets
3. Always validate and sanitize user inputs
4. Use prepared statements for database queries
5. Implement proper authentication checks
6. Test with invalid/malicious inputs

## 🧪 Testing Requirements

### Coverage Requirements
- Minimum coverage: 70% (branches, functions, lines, statements)
- All new features must include tests
- Critical paths require E2E tests

### Testing Strategy
1. **Unit Tests**: Hooks, utilities, isolated components
2. **Integration Tests**: Complete feature flows
3. **E2E Tests**: Critical user journeys

### Example Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button onPress={() => {}}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onPress when clicked', () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button onPress={() => {}} loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## 🐛 Known Issues & Workarounds

### Performance Issues
- **Problem**: Large lists (500+ items) have poor performance
- **Solution**: Use virtualization with `react-window` or pagination

### Mobile-Specific Issues
- **Problem**: Keyboard avoiding on iOS is buggy in modals
- **Solution**: Use custom keyboard avoiding wrapper

- **Problem**: Android back button needs manual handling in nested navigators
- **Solution**: Implement custom back handler with navigation listeners

## 📱 Mobile-First Best Practices

### Responsive Design
- Use relative units (%, rem, not fixed px)
- Test on multiple screen sizes (mobile, tablet, desktop)
- Optimize images for mobile bandwidth
- Implement progressive image loading

### Accessibility
- Support screen readers
- Respect system preferences (dark mode, text size)
- Provide proper ARIA labels
- Ensure minimum touch target size (44x44px)

### Offline Support
- Handle network failures gracefully
- Provide offline indicators
- Cache critical resources with Service Worker
- Queue failed requests for retry

## 📚 Additional Documentation

For more detailed information, refer to:
- `CLAUDE.md` - Complete development guidelines
- `SECURITY.md` - Security guidelines and vulnerability reporting
- `DATABASE.md` - Database architecture and RLS policies
- `TESTING.md` - Testing strategy and examples
- `DESIGN_SYSTEM.md` - UI components and design patterns
- `README.md` - Project setup and overview

## 🤖 Working with This Project

### Before Starting a Task
1. Read the issue description thoroughly
2. Check existing code for similar implementations
3. Review relevant documentation files
4. Understand the feature's context in the app
5. Plan minimal changes needed

### During Development
1. Make incremental changes
2. Test frequently (unit + integration)
3. Follow existing patterns consistently
4. Keep commits focused and atomic
5. Write clear commit messages

### Before Submitting PR
1. Run all tests: `npm run test:all`
2. Check types: `npm run typecheck`
3. Lint code: `npm run lint`
4. Format code: `npm run format`
5. Update relevant documentation
6. Write clear PR description

## 🎨 UI/UX Focus

This app serves a community of 35M followers, primarily mothers. Focus on:
- **Simplicity**: Clean, intuitive interfaces
- **Performance**: Fast load times, smooth interactions
- **Accessibility**: Easy to use for all ages and abilities
- **Mobile-First**: Optimized for mobile devices
- **Premium Feel**: High-quality design for subscription model

## 💡 Tips for Success

1. **Reuse over Reinvent**: Check design system and existing components first
2. **Type Safety**: Let TypeScript guide you - fix all type errors
3. **Test Early**: Write tests alongside code, not after
4. **Think Mobile**: Test on mobile viewport, consider touch interactions
5. **Ask Questions**: If requirements are unclear, ask in PR comments
6. **Small PRs**: Keep changes focused and reviewable
7. **Documentation**: Update docs when changing behavior

---

**Remember**: This is a production app serving millions of users. Quality, security, and user experience are paramount. When in doubt, ask for clarification rather than making assumptions.
