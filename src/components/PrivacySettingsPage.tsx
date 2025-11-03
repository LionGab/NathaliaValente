import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Users, UserX, Lock, Download, Trash2, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface PrivacySettings {
  default_post_visibility: 'public' | 'followers_only' | 'private';
  allow_comments: boolean;
  allow_direct_messages: 'everyone' | 'followers_only' | 'none';
  show_online_status: boolean;
  allow_profile_discovery: boolean;
  data_retention_days: number;
}

export const PrivacySettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    default_post_visibility: 'public',
    allow_comments: true,
    allow_direct_messages: 'followers_only',
    show_online_status: true,
    allow_profile_discovery: true,
    data_retention_days: 365,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadPrivacySettings();
  }, [user]);

  const loadPrivacySettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        console.error('Erro ao carregar configurações:', error);
        return;
      }

      if (data) {
        setSettings({
          default_post_visibility: data.default_post_visibility || 'public',
          allow_comments: data.allow_comments ?? true,
          allow_direct_messages: data.allow_direct_messages || 'followers_only',
          show_online_status: data.show_online_status ?? true,
          allow_profile_discovery: data.allow_profile_discovery ?? true,
          data_retention_days: data.data_retention_days || 365,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de privacidade:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('privacy_settings').upsert({
        user_id: user.id,
        ...settings,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Show success message
      console.log('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const exportUserData = async () => {
    if (!user) return;

    try {
      // Export all user data
      const [posts, comments, likes, savedItems, chatMessages] = await Promise.all([
        supabase.from('posts').select('*').eq('user_id', user.id),
        supabase.from('comments').select('*').eq('user_id', user.id),
        supabase.from('post_likes').select('*').eq('user_id', user.id),
        supabase.from('saved_items').select('*').eq('user_id', user.id),
        supabase.from('chat_messages').select('*').eq('user_id', user.id),
      ]);

      const userData = {
        profile: user,
        posts: posts.data,
        comments: comments.data,
        likes: likes.data,
        saved_items: savedItems.data,
        chat_messages: chatMessages.data,
        exported_at: new Date().toISOString(),
      };

      // Download as JSON file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clubnath-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
    }
  };

  const deleteAccount = async () => {
    if (!user) return;

    try {
      // Delete all user data
      await Promise.all([
        supabase.from('posts').delete().eq('user_id', user.id),
        supabase.from('comments').delete().eq('user_id', user.id),
        supabase.from('post_likes').delete().eq('user_id', user.id),
        supabase.from('saved_items').delete().eq('user_id', user.id),
        supabase.from('chat_messages').delete().eq('user_id', user.id),
        supabase.from('privacy_settings').delete().eq('user_id', user.id),
        supabase.from('profiles').delete().eq('id', user.id),
      ]);

      // Sign out user
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações de Privacidade</h1>
        <p className="text-gray-600">Controle como suas informações são compartilhadas</p>
      </div>

      {/* Visibility Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Visibilidade de Conteúdo
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibilidade padrão de novas postagens
            </label>
            <select
              value={settings.default_post_visibility}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  default_post_visibility: e.target.value as
                    | 'public'
                    | 'followers_only'
                    | 'private',
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="public">Público - Qualquer pessoa pode ver</option>
              <option value="followers_only">Apenas seguidoras - Só quem te segue</option>
              <option value="private">Privado - Apenas você</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Permitir comentários</h3>
              <p className="text-sm text-gray-600">Outras pessoas podem comentar suas postagens</p>
            </div>
            <button
              onClick={() =>
                setSettings((prev) => ({ ...prev, allow_comments: !prev.allow_comments }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.allow_comments ? 'bg-pink-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allow_comments ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Social Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Interações Sociais
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quem pode enviar mensagens diretas
            </label>
            <select
              value={settings.allow_direct_messages}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  allow_direct_messages: e.target.value as 'everyone' | 'followers_only' | 'none',
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="everyone">Qualquer pessoa</option>
              <option value="followers_only">Apenas seguidoras</option>
              <option value="none">Ninguém</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Mostrar status online</h3>
              <p className="text-sm text-gray-600">
                Outras pessoas podem ver quando você está ativa
              </p>
            </div>
            <button
              onClick={() =>
                setSettings((prev) => ({ ...prev, show_online_status: !prev.show_online_status }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.show_online_status ? 'bg-pink-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.show_online_status ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Permitir descoberta de perfil</h3>
              <p className="text-sm text-gray-600">
                Seu perfil pode aparecer em sugestões para outras pessoas
              </p>
            </div>
            <button
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  allow_profile_discovery: !prev.allow_profile_discovery,
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.allow_profile_discovery ? 'bg-pink-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allow_profile_discovery ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Gerenciamento de Dados
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retenção de dados (dias)
            </label>
            <select
              value={settings.data_retention_days}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  data_retention_days: parseInt(e.target.value),
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value={30}>30 dias</option>
              <option value={90}>90 dias</option>
              <option value={180}>6 meses</option>
              <option value={365}>1 ano</option>
              <option value={0}>Indefinidamente</option>
            </select>
            <p className="text-sm text-gray-600 mt-1">
              Seus dados serão automaticamente removidos após este período
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={exportUserData}
              className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar Meus Dados
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Deletar Conta
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={savePrivacySettings}
          disabled={isSaving}
          className="py-3 px-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Salvar Configurações
            </>
          )}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Confirmar Exclusão da Conta
            </h3>
            <p className="text-gray-600 mb-6">
              Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={deleteAccount}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Deletar Conta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
