import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Sparkles, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          // Mensagem amigável para e-mail já cadastrado ou erro comum
          if (error.message && error.message.toLowerCase().includes('user already registered')) {
            setError('Este e-mail já está cadastrado. Tente fazer login ou recuperar a senha.');
          } else {
            setError(error.message || 'Erro ao criar conta.');
          }
        } else {
          setSuccess(
            'Cadastro realizado! Verifique seu e-mail para confirmar sua conta antes de fazer login.'
          );
          setEmail('');
          setPassword('');
          setFullName('');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message && error.message.toLowerCase().includes('invalid login credentials')) {
            setError('E-mail ou senha incorretos.');
          } else {
            setError(error.message || 'Erro ao entrar.');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      setError('');
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if (error) {
        setError(`Erro ao conectar com ${provider === 'google' ? 'Google' : 'Apple'}.`);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login social.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-claude-cream-50 dark:bg-claude-gray-950 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-claude-orange-500 to-claude-orange-600 p-5 rounded-3xl shadow-claude-lg">
              <Heart className="w-14 h-14 text-white fill-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-claude-gray-900 dark:text-white mb-3 tracking-tight">
            ClubNath
          </h1>
          <p className="text-claude-gray-600 dark:text-claude-gray-400 flex items-center justify-center gap-2 font-medium text-lg">
            <Sparkles className="w-5 h-5 text-claude-orange-500" />
            Seu espaço de conexão e fé
          </p>
        </div>

        <div className="card p-10 animate-scale-in">
          <div className="flex mb-8 bg-claude-gray-100 dark:bg-claude-gray-800 rounded-full p-1.5">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 px-5 rounded-full font-semibold transition-all duration-300 ${
                !isSignUp
                  ? 'bg-gradient-to-r from-claude-orange-500 to-claude-orange-600 text-white shadow-claude'
                  : 'text-claude-gray-600 dark:text-claude-gray-300'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 px-5 rounded-full font-semibold transition-all duration-300 ${
                isSignUp
                  ? 'bg-gradient-to-r from-claude-orange-500 to-claude-orange-600 text-white shadow-claude'
                  : 'text-claude-gray-600 dark:text-claude-gray-300'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Login Social */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
              type="button"
              onClick={() => handleSocialLogin('apple')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-black dark:bg-white border-2 border-black dark:border-white rounded-xl font-medium text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continuar com Apple
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                Ou continue com e-mail
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-claude-gray-700 dark:text-claude-gray-300 mb-2.5">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="input"
                  placeholder="Maria Silva"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-claude-gray-700 dark:text-claude-gray-300 mb-2.5">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-claude-gray-700 dark:text-claude-gray-300 mb-2.5">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input"
                placeholder="••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-5 py-4 rounded-2xl text-sm font-medium border border-red-200 dark:border-red-800/50 animate-scale-in">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-5 py-4 rounded-2xl text-sm font-medium border border-green-200 dark:border-green-800/50 animate-scale-in">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? 'Aguarde...' : isSignUp ? 'Criar conta' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-claude-gray-600 dark:text-claude-gray-400 mt-8">
            {isSignUp ? 'Já tem uma conta?' : 'Primeira vez aqui?'}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-claude-orange-600 dark:text-claude-orange-500 hover:text-claude-orange-700 dark:hover:text-claude-orange-400 font-semibold transition-colors"
            >
              {isSignUp ? 'Fazer login' : 'Cadastre-se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
