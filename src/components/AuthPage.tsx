import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Sparkles } from 'lucide-react';

export const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Algo deu errado. Tente novamente.');
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
