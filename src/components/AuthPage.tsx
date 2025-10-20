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
    <div className="min-h-screen bg-peanut-cream dark:bg-peanut-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="bg-peanut-coral p-4 rounded-3xl shadow-peanut">
              <Heart className="w-12 h-12 text-white fill-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-peanut-gray-800 dark:text-white mb-2 tracking-tight">ClubNath</h1>
          <p className="text-peanut-gray-600 dark:text-peanut-gray-300 flex items-center justify-center gap-2 font-medium">
            <Sparkles className="w-4 h-4" />
            Seu espaço de conexão e fé
          </p>
        </div>

        <div className="bg-white dark:bg-peanut-gray-800 rounded-3xl shadow-peanut-lg p-8 transition-colors duration-300">
          <div className="flex mb-6 bg-peanut-sand dark:bg-peanut-gray-700 rounded-full p-1">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2.5 px-4 rounded-full font-semibold transition-all duration-200 ${
                !isSignUp
                  ? 'bg-peanut-coral text-white shadow-peanut'
                  : 'text-peanut-gray-600 dark:text-peanut-gray-300'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2.5 px-4 rounded-full font-semibold transition-all duration-200 ${
                isSignUp
                  ? 'bg-peanut-coral text-white shadow-peanut'
                  : 'text-peanut-gray-600 dark:text-peanut-gray-300'
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-peanut-gray-700 dark:text-peanut-gray-300 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-peanut-gray-200 dark:border-peanut-gray-600 bg-white dark:bg-peanut-gray-700 text-peanut-gray-900 dark:text-white focus:ring-2 focus:ring-peanut-coral focus:border-transparent transition-all placeholder:text-peanut-gray-400"
                  placeholder="Maria Silva"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-peanut-gray-700 dark:text-peanut-gray-300 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-peanut-gray-200 dark:border-peanut-gray-600 bg-white dark:bg-peanut-gray-700 text-peanut-gray-900 dark:text-white focus:ring-2 focus:ring-peanut-coral focus:border-transparent transition-all placeholder:text-peanut-gray-400"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-peanut-gray-700 dark:text-peanut-gray-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-2xl border border-peanut-gray-200 dark:border-peanut-gray-600 bg-white dark:bg-peanut-gray-700 text-peanut-gray-900 dark:text-white focus:ring-2 focus:ring-peanut-coral focus:border-transparent transition-all placeholder:text-peanut-gray-400"
                placeholder="••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-peanut-coral text-white py-3.5 px-6 rounded-3xl font-semibold hover:bg-peanut-coral-light shadow-peanut hover:shadow-peanut-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Aguarde...' : isSignUp ? 'Criar conta' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-peanut-gray-600 dark:text-peanut-gray-400 mt-6">
            {isSignUp ? 'Já tem uma conta?' : 'Primeira vez aqui?'}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-peanut-coral hover:text-peanut-coral-light font-semibold"
            >
              {isSignUp ? 'Fazer login' : 'Cadastre-se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
