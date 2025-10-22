// =====================================================
// CLUBNATH GRUPOS TEMÁTICOS - MODAL DE CRIAÇÃO
// Santuário Digital de Empatia e Pertencimento
// =====================================================

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  X, 
  Users, 
  Lock, 
  Globe, 
  Image, 
  Upload,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { groupsService } from '../../services/groups.service';
import { CreateGroupData, GroupCategory, GROUP_CATEGORIES } from '../../types/groups';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { getCategoryColor, getCategoryIcon } from '../../types/groups';

interface CreateGroupModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  onClose,
  onSuccess
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateGroupData>({
    name: '',
    description: '',
    category: 'Bem-estar',
    is_private: false,
    max_members: 50,
    rules: ''
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  const createGroupMutation = useMutation({
    mutationFn: (data: CreateGroupData) => groupsService.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      onSuccess();
    },
    onError: (error: any) => {
      setErrors({ general: error.message || 'Erro ao criar grupo' });
    }
  });

  const handleInputChange = (field: keyof CreateGroupData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, coverImage: 'Imagem deve ter no máximo 5MB' }));
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, coverImage: 'Apenas imagens são permitidas' }));
        return;
      }

      setCoverImage(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setErrors(prev => ({ ...prev, coverImage: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Nome deve ter no máximo 100 caracteres';
    }

    // Validar descrição
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Descrição deve ter no máximo 500 caracteres';
    }

    // Validar número máximo de membros
    if (formData.max_members && (formData.max_members < 5 || formData.max_members > 200)) {
      newErrors.max_members = 'Número de membros deve estar entre 5 e 200';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // TODO: Upload da imagem de capa se necessário
      // const coverImageUrl = coverImage ? await uploadCoverImage(coverImage) : undefined;
      
      await createGroupMutation.mutateAsync({
        ...formData,
        // cover_image_url: coverImageUrl
      });
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Informações Básicas';
      case 2: return 'Configurações';
      default: return 'Criar Grupo';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Defina o nome, descrição e categoria do seu grupo';
      case 2: return 'Configure as regras e preferências do grupo';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {getStepTitle()}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {getStepDescription()}
            </p>
          </div>
          
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {[1, 2].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 2 && (
                  <div className={`w-8 h-0.5 ${
                    step > stepNumber ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <div className="space-y-6">
              {/* Nome do Grupo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Grupo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Mães em Fé, Amamentação com Amor..."
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    errors.name
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-pink-500 focus:border-pink-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {formData.name.length}/100 caracteres
                </p>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoria *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {GROUP_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleInputChange('category', category)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        formData.category === category
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(category)}</span>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva o propósito e o que as mães podem esperar deste grupo..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                    errors.description
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-pink-500 focus:border-pink-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {formData.description.length}/500 caracteres
                </p>
              </div>

              {/* Imagem de Capa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Imagem de Capa (Opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-pink-400 transition-colors">
                  {coverImagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={coverImagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl mx-auto"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          onClick={() => {
                            setCoverImage(null);
                            setCoverImagePreview('');
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Adicionar imagem de capa
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG até 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="hidden"
                        id="cover-image"
                      />
                      <label
                        htmlFor="cover-image"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        Escolher Imagem
                      </label>
                    </div>
                  )}
                </div>
                {errors.coverImage && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.coverImage}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Visibilidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Visibilidade do Grupo
                </label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="visibility"
                      checked={!formData.is_private}
                      onChange={() => handleInputChange('is_private', false)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Público
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qualquer pessoa pode encontrar e entrar no grupo
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="visibility"
                      checked={formData.is_private}
                      onChange={() => handleInputChange('is_private', true)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Lock className="w-5 h-5 text-orange-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Privado
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Apenas membros convidados podem entrar no grupo
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Número Máximo de Membros */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número Máximo de Membros
                </label>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="5"
                    max="200"
                    value={formData.max_members}
                    onChange={(e) => handleInputChange('max_members', parseInt(e.target.value))}
                    className={`flex-1 px-4 py-3 rounded-xl border transition-all ${
                      errors.max_members
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-pink-500 focus:border-pink-500'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                </div>
                {errors.max_members && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.max_members}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Entre 5 e 200 membros
                </p>
              </div>

              {/* Regras do Grupo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Regras do Grupo (Opcional)
                </label>
                <textarea
                  value={formData.rules}
                  onChange={(e) => handleInputChange('rules', e.target.value)}
                  placeholder="Defina as regras e diretrizes para os membros do grupo..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-pink-500 focus:border-pink-500 transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Regras claras ajudam a manter um ambiente respeitoso e acolhedor
                </p>
              </div>

              {/* Informações Importantes */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Informações Importantes
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Você pode criar até 5 grupos</li>
                      <li>• Como administradora, você pode gerenciar membros e conteúdo</li>
                      <li>• Grupos privados requerem convites para novos membros</li>
                      <li>• Todas as publicações são moderadas automaticamente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Erro Geral */}
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {errors.general}
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
              >
                Voltar
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
            >
              Cancelar
            </Button>
            
            {step === 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!formData.name.trim() || !formData.description.trim()}
              >
                Continuar
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={createGroupMutation.isPending}
                leftIcon={createGroupMutation.isPending ? undefined : <CheckCircle className="w-4 h-4" />}
              >
                {createGroupMutation.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Criar Grupo'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
