/**
 * Nossa Maternidade - Modern Sign Up Screen
 * Tela de cadastro moderna e intuitiva
 */

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Heart, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ModernSignUpScreenProps {
  onSignUp: (data: { name: string; email: string; password: string }) => Promise<void>;
  onSocialSignUp: (provider: 'google' | 'apple' | 'facebook') => Promise<void>;
  onLogin: () => void;
  isLoading?: boolean;
  error?: string;
}

export const ModernSignUpScreen = ({ 
  onSignUp, 
  onSocialSignUp, 
  onLogin, 
  isLoading = false,
  error 
}: ModernSignUpScreenProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFocused, setIsFocused] = useState<string | null>(null);

  // Validação em tempo real
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (formData.name && formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Email inválido';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(errors).length > 0) return;
    if (!formData.name || !formData.email || !formData.password) return;

    await onSignUp({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
  };

  const canSubmit = formData.name && formData.email && formData.password && formData.confirmPassword && Object.keys(errors).length === 0 && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-6 rounded-3xl shadow-2xl">
              <Heart className="w-12 h-12 text-white fill-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Junte-se a nós
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Faça parte da nossa comunidade de mães
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Nome completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className={`w-5 h-5 transition-colors duration-200 ${
                    isFocused === 'name' ? 'text-pink-500' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onFocus={() => setIsFocused('name')}
                  onBlur={() => setIsFocused(null)}
                  placeholder="Seu nome completo"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none ${
                    errors.name
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : isFocused === 'name'
                      ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }`}
                />
                {formData.name && !errors.name && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.name && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 transition-colors duration-200 ${
                    isFocused === 'email' ? 'text-pink-500' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => setIsFocused('email')}
                  onBlur={() => setIsFocused(null)}
                  placeholder="seu@email.com"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none ${
                    errors.email
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : isFocused === 'email'
                      ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }`}
                />
                {formData.email && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 transition-colors duration-200 ${
                    isFocused === 'password' ? 'text-pink-500' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                  placeholder="Crie uma senha"
                  className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none ${
                    errors.password
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : isFocused === 'password'
                      ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Confirmar senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 transition-colors duration-200 ${
                    isFocused === 'confirmPassword' ? 'text-pink-500' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onFocus={() => setIsFocused('confirmPassword')}
                  onBlur={() => setIsFocused(null)}
                  placeholder="Confirme sua senha"
                  className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none ${
                    errors.confirmPassword
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : isFocused === 'confirmPassword'
                      ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={!canSubmit || isLoading}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                canSubmit && !isLoading
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Criando conta...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span>Criar conta</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                ou continue com
              </span>
            </div>
          </div>

          {/* Social Sign Up */}
          <div className="space-y-3">
            <button
              onClick={() => onSocialSignUp('google')}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                Google
              </span>
            </button>

            <button
              onClick={() => onSocialSignUp('apple')}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-black dark:bg-gray-900 text-white rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-black text-xs font-bold">🍎</span>
              </div>
              <span className="font-semibold group-hover:text-gray-200">
                Apple
              </span>
            </button>

            <button
              onClick={() => onSocialSignUp('facebook')}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs font-bold">f</span>
              </div>
              <span className="font-semibold group-hover:text-blue-100">
                Facebook
              </span>
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-400">
              Já tem uma conta?{' '}
              <button
                onClick={onLogin}
                className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-semibold transition-colors duration-200"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
