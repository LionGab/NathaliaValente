import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, MapPin, Users, Route, Phone, Plus, Settings, Bell, Heart } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { safetyCommunityService, SafetyAlert, SafetyBuddy, SafetyRoute } from '../services/safety-community.service';
import { useAuth } from '../../../contexts/AuthContext';

export const SafetyPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'alerts' | 'buddies' | 'routes' | 'tracking'>('alerts');
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [buddies, setBuddies] = useState<SafetyBuddy[]>([]);
  const [routes, setRoutes] = useState<SafetyRoute[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadSafetyData();
    }
  }, [user]);

  const loadSafetyData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load community safety data for user's location
      const safetyData = await safetyCommunityService.getCommunitySafetyData(
        -23.5505, // São Paulo coordinates (mock)
        -46.6333,
        5 // 5km radius
      );
      
      setAlerts(safetyData.recent_alerts);
      setBuddies(safetyData.community_buddies);
      setRoutes(safetyData.safe_routes);
    } catch (error) {
      console.error('Error loading safety data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async () => {
    if (!user) return;
    
    try {
      const newAlert = await safetyCommunityService.createSafetyAlert({
        user_id: user.id,
        type: 'suspicious',
        location: {
          latitude: -23.5505,
          longitude: -46.6333,
          address: 'Rua Augusta, São Paulo',
          city: 'São Paulo'
        },
        description: 'Atividade suspeita na região',
        severity: 'medium',
        status: 'active'
      });
      
      if (newAlert) {
        setAlerts(prev => [newAlert, ...prev]);
      }
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const handleStartTracking = async () => {
    if (!user) return;
    
    try {
      const id = await safetyCommunityService.startSafetyTracking(
        user.id,
        { latitude: -23.5505, longitude: -46.6333, address: 'Ponto de partida' },
        { latitude: -23.5515, longitude: -46.6343, address: 'Destino' },
        30 // 30 minutes estimated
      );
      
      if (id) {
        setTrackingId(id);
        setIsTracking(true);
      }
    } catch (error) {
      console.error('Error starting tracking:', error);
    }
  };

  const handleEndTracking = async () => {
    if (!trackingId) return;
    
    try {
      const success = await safetyCommunityService.endSafetyTracking(trackingId, 25);
      if (success) {
        setIsTracking(false);
        setTrackingId(null);
      }
    } catch (error) {
      console.error('Error ending tracking:', error);
    }
  };

  const handleEmergencyAlert = async () => {
    if (!user) return;
    
    try {
      const success = await safetyCommunityService.sendEmergencyAlert(
        user.id,
        { latitude: -23.5505, longitude: -46.6333, address: 'Localização atual' },
        'emergency',
        'Preciso de ajuda urgente!'
      );
      
      if (success) {
        alert('Alerta de emergência enviado! Sua rede de segurança foi notificada.');
      }
    } catch (error) {
      console.error('Error sending emergency alert:', error);
    }
  };

  const renderAlerts = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Alertas da Comunidade
        </h3>
        <Button onClick={handleCreateAlert} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Novo Alerta
        </Button>
      </div>
      
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum alerta recente na sua área</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className={`w-4 h-4 ${
                      alert.severity === 'critical' ? 'text-red-500' :
                      alert.severity === 'high' ? 'text-orange-500' :
                      alert.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'high' ? 'text-orange-600' :
                      alert.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white mb-2">{alert.description}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-3 h-3" />
                    {alert.location.address}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBuddies = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Rede de Segurança
        </h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Buddy
        </Button>
      </div>
      
      {buddies.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum buddy de segurança adicionado</p>
          <p className="text-sm mt-2">Adicione amigos e familiares para sua rede de segurança</p>
        </div>
      ) : (
        <div className="space-y-3">
          {buddies.map((buddy) => (
            <div key={buddy.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Buddy de Segurança
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {buddy.relationship}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  buddy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {buddy.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRoutes = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Rotas Seguras
        </h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nova Rota
        </Button>
      </div>
      
      {routes.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Route className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma rota segura cadastrada</p>
          <p className="text-sm mt-2">Cadastre rotas seguras para seus trajetos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {routes.map((route) => (
            <div key={route.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{route.name}</h4>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  route.is_safe ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {route.is_safe ? 'Segura' : 'Atenção'}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {route.start_location.address}
                </div>
                <div className="flex items-center gap-1">
                  <Route className="w-3 h-3" />
                  {route.estimated_duration} min
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {Math.round(route.safety_score * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTracking = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Rastreamento de Segurança
      </h3>
      
      {!isTracking ? (
        <div className="text-center py-8">
          <Shield className="w-16 h-16 mx-auto mb-4 text-pink-500" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Iniciar Rastreamento
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Compartilhe sua localização com sua rede de segurança durante trajetos
          </p>
          <Button onClick={handleStartTracking} className="bg-pink-500 hover:bg-pink-600">
            <MapPin className="w-4 h-4 mr-2" />
            Iniciar Rastreamento
          </Button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Bell className="w-8 h-8 text-green-600 dark:text-green-400 animate-pulse" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Rastreamento Ativo
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sua rede de segurança está sendo notificada sobre sua localização
          </p>
          <Button onClick={handleEndTracking} variant="outline">
            Finalizar Rastreamento
          </Button>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'alerts', label: 'Alertas', icon: AlertTriangle },
    { id: 'buddies', label: 'Buddies', icon: Users },
    { id: 'routes', label: 'Rotas', icon: Route },
    { id: 'tracking', label: 'Rastreamento', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Segurança Pessoal
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sua rede de segurança e proteção
              </p>
            </div>
            <Button
              onClick={handleEmergencyAlert}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Phone className="w-4 h-4 mr-2" />
              Emergência
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'alerts' && renderAlerts()}
            {activeTab === 'buddies' && renderBuddies()}
            {activeTab === 'routes' && renderRoutes()}
            {activeTab === 'tracking' && renderTracking()}
          </>
        )}
      </div>
    </div>
  );
};
