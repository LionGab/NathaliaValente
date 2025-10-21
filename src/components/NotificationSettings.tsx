/**
 * ClubNath Notification Settings Component
 *
 * Example React component for managing notification preferences
 */

import React, { useEffect, useState } from 'react';
import NotificationService, {
  type NotificationPreferences,
} from '../services/notificationService';

const POST_CATEGORIES = ['Look do dia', 'Desabafo', 'Fé', 'Dica de mãe'];

export const NotificationSettings: React.FC = () => {
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    const prefs = await NotificationService.getPreferences();
    setPreferences(prefs);
    setLoading(false);
  };

  const handleToggle = async (field: keyof NotificationPreferences) => {
    if (!preferences) return;

    const newValue = !preferences[field];
    const success = await NotificationService.updatePreferences({
      [field]: newValue,
    });

    if (success) {
      setPreferences({ ...preferences, [field]: newValue });
      showMessage('success', 'Preferência atualizada com sucesso!');
    } else {
      showMessage('error', 'Erro ao atualizar preferência');
    }
  };

  const handleQuietHoursChange = async (
    start: string | null,
    end: string | null
  ) => {
    const success = await NotificationService.setQuietHours(start, end);

    if (success) {
      setPreferences((prev) =>
        prev
          ? { ...prev, quiet_hours_start: start, quiet_hours_end: end }
          : null
      );
      showMessage('success', 'Horário de silêncio atualizado!');
    } else {
      showMessage('error', 'Erro ao atualizar horário de silêncio');
    }
  };

  const handleCategoryToggle = async (category: string) => {
    if (!preferences) return;

    const currentCategories = preferences.followed_categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    const success = await NotificationService.updateFollowedCategories(
      newCategories
    );

    if (success) {
      setPreferences({ ...preferences, followed_categories: newCategories });
      showMessage('success', 'Categorias atualizadas!');
    } else {
      showMessage('error', 'Erro ao atualizar categorias');
    }
  };

  const handleRequestPermission = async () => {
    const granted = await NotificationService.requestPermission();

    if (granted) {
      showMessage('success', 'Permissão concedida! ✅');
      await NotificationService.updatePreferences({ enable_push: true });
      loadPreferences();
    } else {
      showMessage(
        'error',
        'Permissão negada. Habilite nas configurações do navegador.'
      );
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="notification-settings loading">
        <p>Carregando preferências...</p>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="notification-settings error">
        <p>Erro ao carregar preferências de notificação</p>
      </div>
    );
  }

  const permissionStatus = NotificationService.getPermissionStatus();

  return (
    <div className="notification-settings">
      <h2>Configurações de Notificações</h2>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Browser Permission */}
      {permissionStatus !== 'granted' && (
        <div className="settings-section permission-request">
          <h3>⚠️ Permissão de Notificações</h3>
          <p>
            {permissionStatus === 'denied'
              ? 'Notificações estão bloqueadas. Habilite nas configurações do navegador.'
              : 'Habilite notificações para receber alertas em tempo real.'}
          </p>
          {permissionStatus === 'default' && (
            <button onClick={handleRequestPermission} className="primary-btn">
              Habilitar Notificações
            </button>
          )}
        </div>
      )}

      {/* General Settings */}
      <div className="settings-section">
        <h3>Geral</h3>

        <div className="setting-item">
          <div className="setting-info">
            <label>Notificações Push</label>
            <p>Receba notificações no seu dispositivo</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.enable_push}
              onChange={() => handleToggle('enable_push')}
              disabled={permissionStatus !== 'granted'}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Notificações no App</label>
            <p>Veja notificações dentro do aplicativo</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.enable_in_app}
              onChange={() => handleToggle('enable_in_app')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Notificações por Email</label>
            <p>Receba resumos diários por email</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.enable_email}
              onChange={() => handleToggle('enable_email')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* Notification Categories */}
      <div className="settings-section">
        <h3>Tipos de Notificação</h3>

        <div className="setting-item">
          <div className="setting-info">
            <label>Atividade da Comunidade</label>
            <p>Comentários e curtidas nos seus posts</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.enable_community_activity}
              onChange={() => handleToggle('enable_community_activity')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Novo Conteúdo</label>
            <p>Posts nas categorias que você segue</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.enable_new_content}
              onChange={() => handleToggle('enable_new_content')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Encorajamento Diário</label>
            <p>Mensagens motivacionais e reflexões</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.enable_daily_encouragement}
              onChange={() => handleToggle('enable_daily_encouragement')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Lembretes de Hábitos</label>
            <p>Lembretes para diário e autocuidado</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.enable_habit_reminders}
              onChange={() => handleToggle('enable_habit_reminders')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Respostas do Robô Nath</label>
            <p>Notificações do assistente virtual</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.enable_chat_responses}
              onChange={() => handleToggle('enable_chat_responses')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Selos e Conquistas</label>
            <p>Quando você recebe um selo Nathy</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.enable_badges}
              onChange={() => handleToggle('enable_badges')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* Followed Categories */}
      {preferences.enable_new_content && (
        <div className="settings-section">
          <h3>Categorias Seguidas</h3>
          <p className="section-description">
            Receba notificações de novos posts nestas categorias
          </p>

          <div className="category-checkboxes">
            {POST_CATEGORIES.map((category) => (
              <label key={category} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={(preferences.followed_categories || []).includes(
                    category
                  )}
                  onChange={() => handleCategoryToggle(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Quiet Hours */}
      <div className="settings-section">
        <h3>Horário de Silêncio</h3>
        <p className="section-description">
          Não receba notificações durante esses horários
        </p>

        <div className="time-inputs">
          <div className="time-input-group">
            <label>Início</label>
            <input
              type="time"
              value={preferences.quiet_hours_start || ''}
              onChange={(e) =>
                handleQuietHoursChange(
                  e.target.value || null,
                  preferences.quiet_hours_end
                )
              }
            />
          </div>

          <div className="time-input-group">
            <label>Fim</label>
            <input
              type="time"
              value={preferences.quiet_hours_end || ''}
              onChange={(e) =>
                handleQuietHoursChange(
                  preferences.quiet_hours_start,
                  e.target.value || null
                )
              }
            />
          </div>
        </div>

        {preferences.quiet_hours_start && preferences.quiet_hours_end && (
          <p className="quiet-hours-info">
            Silêncio ativo de {preferences.quiet_hours_start.slice(0, 5)} até{' '}
            {preferences.quiet_hours_end.slice(0, 5)}
          </p>
        )}
      </div>

      {/* Frequency Limits */}
      <div className="settings-section">
        <h3>Limite de Notificações</h3>
        <p className="section-description">
          Máximo de notificações por dia em cada categoria
        </p>

        <div className="frequency-controls">
          <div className="frequency-item">
            <label>Comunidade</label>
            <input
              type="number"
              min="1"
              max="50"
              value={preferences.max_community_per_day}
              onChange={async (e) => {
                const value = parseInt(e.target.value);
                await NotificationService.updatePreferences({
                  max_community_per_day: value,
                });
                setPreferences({
                  ...preferences,
                  max_community_per_day: value,
                });
              }}
            />
          </div>

          <div className="frequency-item">
            <label>Conteúdo</label>
            <input
              type="number"
              min="1"
              max="50"
              value={preferences.max_content_per_day}
              onChange={async (e) => {
                const value = parseInt(e.target.value);
                await NotificationService.updatePreferences({
                  max_content_per_day: value,
                });
                setPreferences({ ...preferences, max_content_per_day: value });
              }}
            />
          </div>

          <div className="frequency-item">
            <label>Lembretes</label>
            <input
              type="number"
              min="1"
              max="10"
              value={preferences.max_reminders_per_day}
              onChange={async (e) => {
                const value = parseInt(e.target.value);
                await NotificationService.updatePreferences({
                  max_reminders_per_day: value,
                });
                setPreferences({
                  ...preferences,
                  max_reminders_per_day: value,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
