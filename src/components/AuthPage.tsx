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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-pink-400 to-purple-500 p-4 rounded-full shadow-lg">
              <Heart className="w-12 h-12 text-white fill-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">ClubNath</h1>
          <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Seu espaço de conexão e fé
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-colors duration-300">
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 rounded-full transition-all duration-200 ${
                !isSignUp
                  ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 rounded-full transition-all duration-200 ${
                isSignUp
                  ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                  placeholder="Maria Silva"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                placeholder="••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Aguarde...' : isSignUp ? 'Criar conta' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            {isSignUp ? 'Já tem uma conta?' : 'Primeira vez aqui?'}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-pink-500 hover:text-pink-600 font-medium"
            >
              {isSignUp ? 'Fazer login' : 'Cadastre-se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
