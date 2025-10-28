import { useState } from 'react';
import { Instagram, Shield, Mail, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
// Sistema de notificações simples (sem Firebase)
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

interface InstagramUser {
  id: string;
  username: string;
  full_name: string;
  profile_picture_url: string;
  followers_count: number;
  following_count: number;
  access_token: string;
}

interface InstagramAuthProps {
  onSuccess: (user: InstagramUser) => void;
}

export const InstagramAuth = ({ onSuccess }: InstagramAuthProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Sistema de notificações simples
  const showSuccess = (message: string) => {
    console.log('✅ Success:', message);
    // Aqui você pode implementar um toast ou modal de sucesso
  };
  
  const showError = (message: string) => {
    console.error('❌ Error:', message);
    // Aqui você pode implementar um toast ou modal de erro
  };
  
  const handleApiError = (error: any, context: string) => {
    console.error(`API Error in ${context}:`, error);
    showError('Ocorreu um erro. Tente novamente.');
  };
  
  const handleValidationError = (errors: Record<string, string>) => {
    console.error('Validation errors:', errors);
    setErrors(errors);
  };
  const { signInDemo } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (authMode === 'signup' && !formData.fullName) {
      newErrors.fullName = 'Nome completo é obrigatório';
    } else if (authMode === 'signup' && formData.fullName.length < 2) {
      newErrors.fullName = 'Nome deve ter pelo menos 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'instagram') => {
    setIsLoading(true);

    try {
      // Todos os provedores sociais usam modo demo por enquanto
      showSuccess(
        'Modo Demo Ativado',
        `Usando modo demonstração para ${provider === 'google' ? 'Google' : provider === 'apple' ? 'Apple' : 'Instagram'}`
      );
      setTimeout(() => handleDemoLogin(), 1000);
    } catch (error) {
      console.error(`Erro no login ${provider}:`, error);
      showError(
        'Erro na autenticação',
        `Não foi possível conectar com ${provider}. Usando modo demo.`
      );
      // Fallback para demo
      setTimeout(() => handleDemoLogin(), 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!validateForm()) {
      const errorMessages = Object.values(errors);
      handleValidationError(errorMessages);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              username: formData.email.split('@')[0],
            },
          },
        });

        if (error) {
          console.error('Erro no cadastro:', error);
          handleApiError(error, 'cadastro');
        } else {
          console.log('✅ Cadastro realizado com sucesso!');
          showSuccess('Cadastro realizado!', 'Bem-vinda à Nossa Maternidade!');

          // Usar dados do usuário criado
          const mockUser = {
            id: data.user?.id || 'demo-user-123',
            username: formData.email.split('@')[0],
            full_name: formData.fullName,
            profile_picture_url:
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            followers_count: 0,
            following_count: 0,
            access_token: 'email-token-' + Date.now(),
          };

          setTimeout(() => onSuccess(mockUser), 1500);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error('Erro no login:', error);
          handleApiError(error, 'login');
        } else {
          console.log('✅ Login realizado com sucesso!');
          showSuccess('Login realizado!', 'Bem-vinda de volta à Nossa Maternidade!');

          // Usar dados do usuário logado
          const mockUser = {
            id: data.user?.id || 'demo-user-123',
            username: data.user?.email?.split('@')[0] || 'user',
            full_name: data.user?.user_metadata?.full_name || 'Usuário',
            profile_picture_url:
              data.user?.user_metadata?.avatar_url ||
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            followers_count: 0,
            following_count: 0,
            access_token: 'email-token-' + Date.now(),
          };

          setTimeout(() => onSuccess(mockUser), 1500);
        }
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      handleApiError(error, 'autenticação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);

    try {
      showSuccess('Modo Demo Ativado', 'Entrando como Nathália Arcuri...');

      // Usar o método signInDemo do AuthContext
      await signInDemo();

      // Criar o mockUser para compatibilidade com onSuccess
      const mockUser = {
        id: 'demo-user-123',
        username: 'nathalia_arcuri',
        full_name: 'Nathália Valente',
        profile_picture_url:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        followers_count: 29000000,
        following_count: 500,
        access_token: 'demo-token-' + Date.now(),
      };

      setTimeout(() => {
        onSuccess(mockUser);
      }, 1000);
    } catch (error) {
      console.error('Erro no login demo:', error);
      showError('Erro no login demo', 'Tente novamente em alguns instantes.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-neutral-900 dark:via-primary-950 dark:to-secondary-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200/20 dark:bg-primary-800/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-800/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1s' }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-200/10 dark:bg-accent-800/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="card-modern dark:card-dark-modern rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-large relative z-10 animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <img
              src="/logos/clubnath-logo-final.jpg"
              alt="Nossa Maternidade"
              className="w-24 h-24 rounded-3xl shadow-large mx-auto animate-float object-cover"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2 tracking-tight">
            Nossa Maternidade
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium">
            Comunidade Exclusiva de Mães
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-1 mb-6">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              authMode === 'login'
                ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-soft'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              authMode === 'signup'
                ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-soft'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl font-medium text-neutral-700 dark:text-neutral-300 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-medium transition-all duration-300 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </button>

          <button
            onClick={() => handleSocialLogin('apple')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white rounded-2xl font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 hover:shadow-medium transition-all duration-300 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Continuar com Apple
          </button>

          <button
            onClick={() => handleSocialLogin('instagram')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-medium hover:shadow-medium transition-all duration-300 disabled:opacity-50"
          >
            <Instagram className="w-5 h-5" />
            Continuar com Instagram
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">
              ou
            </span>
          </div>
        </div>

        {/* Email Form */}
        <div className="space-y-4 mb-6">
          {authMode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) {
                    setErrors({ ...errors, fullName: '' });
                  }
                }}
                className={`w-full px-4 py-3 rounded-2xl border-2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none transition-all duration-200 ${
                  errors.fullName
                    ? 'border-error-500 focus:border-error-500'
                    : 'border-neutral-200 dark:border-neutral-700 focus:border-primary-500'
                }`}
                placeholder="Seu nome completo"
              />
              {errors.fullName && (
                <p className="text-error-600 dark:text-error-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.fullName}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) {
                    setErrors({ ...errors, email: '' });
                  }
                }}
                className={`w-full px-4 py-3 pl-12 rounded-2xl border-2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none transition-all duration-200 ${
                  errors.email
                    ? 'border-error-500 focus:border-error-500'
                    : 'border-neutral-200 dark:border-neutral-700 focus:border-primary-500'
                }`}
                placeholder="seu@email.com"
              />
              <Mail
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  errors.email ? 'text-error-500' : 'text-neutral-400'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-error-600 dark:text-error-400 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) {
                    setErrors({ ...errors, password: '' });
                  }
                }}
                className={`w-full px-4 py-3 pr-12 rounded-2xl border-2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none transition-all duration-200 ${
                  errors.password
                    ? 'border-error-500 focus:border-error-500'
                    : 'border-neutral-200 dark:border-neutral-700 focus:border-primary-500'
                }`}
                placeholder="Sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-all duration-200 ${
                  errors.password
                    ? 'text-error-500'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-error-600 dark:text-error-400 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span>
                {errors.password}
              </p>
            )}
          </div>
        </div>

        {/* Email Auth Button */}
        <button
          onClick={handleEmailAuth}
          disabled={
            isLoading ||
            !formData.email ||
            !formData.password ||
            (authMode === 'signup' && !formData.fullName)
          }
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 px-6 rounded-2xl font-bold shadow-large hover:shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 touch-target disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <LoadingSpinner
              variant="minimal"
              size="sm"
              message={authMode === 'signup' ? 'Criando conta...' : 'Entrando...'}
            />
          ) : (
            <>
              <Mail className="w-5 h-5" />
              <span>{authMode === 'signup' ? 'Criar Conta' : 'Entrar'}</span>
            </>
          )}
        </button>

        {/* Demo Button */}
        <button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full mt-3 py-3 px-6 rounded-2xl font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all duration-300 disabled:opacity-50"
        >
          🚀 Entrar como Demo
        </button>

        {/* Trust Signals */}
        <div className="mt-6 space-y-3 text-center">
          <div className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400">
            <Shield className="w-4 h-4 text-success-500" />
            <p className="text-sm font-medium">Seus dados estão 100% seguros</p>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            ✨ Junte-se a milhares de mães inspiradoras ✨
          </p>
        </div>
      </div>
    </div>
  );
};
