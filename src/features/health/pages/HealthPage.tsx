import React, { useState, useEffect } from 'react';
import { Heart, Baby, Calendar, AlertCircle, CheckCircle, Clock, Plus, FileText, TrendingUp, Shield } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { babyTestIntegrationService, BabyProfile, BabyTestResult, HealthRecommendation } from '../services/babytest-integration.service';
import { useAuth } from '../../../contexts/AuthContext';

export const HealthPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'babies' | 'tests' | 'recommendations' | 'insights'>('babies');
  const [babies, setBabies] = useState<BabyProfile[]>([]);
  const [testResults, setTestResults] = useState<BabyTestResult[]>([]);
  const [recommendations, setRecommendations] = useState<HealthRecommendation[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<BabyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddBaby, setShowAddBaby] = useState(false);

  useEffect(() => {
    if (user) {
      loadHealthData();
    }
  }, [user]);

  const loadHealthData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load baby profiles, test results, and recommendations
      // In real implementation, would fetch from database
      const mockBabies: BabyProfile[] = [
        {
          id: '1',
          user_id: user.id,
          name: 'Maria',
          birth_date: '2024-01-15',
          gender: 'female',
          weight_at_birth: 3.2,
          height_at_birth: 50.5,
          gestational_age: 39,
          birth_conditions: [],
          family_history: {
            genetic_diseases: [],
            metabolic_disorders: [],
            other_conditions: []
          },
          test_history: [],
          health_tracking: {
            vaccinations: [],
            growth_milestones: [],
            developmental_concerns: []
          },
          created_at: '2024-01-15T00:00:00Z'
        }
      ];
      
      setBabies(mockBabies);
      if (mockBabies.length > 0) {
        setSelectedBaby(mockBabies[0]);
        await loadBabyData(mockBabies[0].id);
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBabyData = async (babyId: string) => {
    try {
      const [insights, recs] = await Promise.all([
        babyTestIntegrationService.getHealthInsights(babyId),
        babyTestIntegrationService.getHealthRecommendations(babyId)
      ]);
      
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading baby data:', error);
    }
  };

  const handleScheduleTest = async (babyId: string, testType: string) => {
    if (!user) return;
    
    try {
      const result = await babyTestIntegrationService.scheduleBabyTest(
        user.id,
        babyId,
        testType as any,
        new Date().toISOString()
      );
      
      if (result.success) {
        alert(`Teste agendado com sucesso! ID: ${result.appointmentId}`);
      } else {
        alert(`Erro ao agendar teste: ${result.message}`);
      }
    } catch (error) {
      console.error('Error scheduling test:', error);
      alert('Erro ao agendar teste');
    }
  };

  const handleAddBaby = async (babyData: any) => {
    if (!user) return;
    
    try {
      const newBaby = await babyTestIntegrationService.createBabyProfile(user.id, babyData);
      if (newBaby) {
        setBabies(prev => [...prev, newBaby]);
        setSelectedBaby(newBaby);
        setShowAddBaby(false);
      }
    } catch (error) {
      console.error('Error adding baby:', error);
    }
  };

  const renderBabies = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Perfis dos Bebês
        </h3>
        <Button onClick={() => setShowAddBaby(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Bebê
        </Button>
      </div>
      
      {babies.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Baby className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum perfil de bebê cadastrado</p>
          <p className="text-sm mt-2">Adicione o perfil do seu bebê para acompanhar sua saúde</p>
        </div>
      ) : (
        <div className="space-y-3">
          {babies.map((baby) => (
            <div
              key={baby.id}
              onClick={() => {
                setSelectedBaby(baby);
                loadBabyData(baby.id);
              }}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedBaby?.id === baby.id
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                    <Baby className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{baby.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {baby.gender === 'male' ? 'Menino' : 'Menina'} • {baby.birth_date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {baby.weight_at_birth} kg
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {baby.height_at_birth} cm
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTests = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Testes Genéticos
        </h3>
        {selectedBaby && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleScheduleTest(selectedBaby.id, 'babytest_plus')}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Babytest Plus
            </Button>
            <Button
              onClick={() => handleScheduleTest(selectedBaby.id, 'babytest_basic')}
              size="sm"
              variant="outline"
            >
              <FileText className="w-4 h-4 mr-2" />
              Babytest Basic
            </Button>
          </div>
        )}
      </div>
      
      {!selectedBaby ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Selecione um bebê para ver os testes</p>
        </div>
      ) : testResults.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum teste realizado para {selectedBaby.name}</p>
          <p className="text-sm mt-2">Agende um teste genético para acompanhar a saúde do bebê</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testResults.map((result) => (
            <div key={result.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {result.test_type.replace('_', ' ').toUpperCase()}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(result.test_date).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  result.status === 'completed' ? 'bg-green-100 text-green-800' :
                  result.status === 'requires_attention' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {result.status === 'completed' ? 'Concluído' :
                   result.status === 'requires_attention' ? 'Atenção' : 'Pendente'}
                </div>
              </div>
              
              {result.results.diseases_detected.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">
                      Condições Detectadas: {result.results.diseases_detected.length}
                    </span>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                    {result.results.diseases_detected.map((disease, index) => (
                      <li key={index}>• {disease}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.results.recommendations.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Recomendações:
                  </h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {result.results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Recomendações de Saúde
      </h3>
      
      {!selectedBaby ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Selecione um bebê para ver as recomendações</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma recomendação disponível para {selectedBaby.name}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      rec.priority === 'urgent' ? 'bg-red-500' :
                      rec.priority === 'high' ? 'bg-orange-500' :
                      rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {rec.title}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {rec.description}
                  </p>
                  
                  {rec.action_items.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Ações Recomendadas:
                      </h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {rec.action_items.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-pink-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs ${
                  rec.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {rec.completed ? 'Concluído' : 'Pendente'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Insights de Saúde
      </h3>
      
      {!selectedBaby ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Selecione um bebê para ver os insights</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Growth Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Crescimento</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Padrão de crescimento dentro da normalidade para a idade.
            </p>
            <div className="mt-2 text-xs text-green-600">
              Confiança: 85%
            </div>
          </div>
          
          {/* Development Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Baby className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Desenvolvimento</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Marcos de desenvolvimento adequados para a idade.
            </p>
            <div className="mt-2 text-xs text-blue-600">
              Confiança: 80%
            </div>
          </div>
          
          {/* Nutrition Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-pink-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Nutrição</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Alimentação adequada para desenvolvimento saudável.
            </p>
            <div className="mt-2 text-xs text-pink-600">
              Confiança: 90%
            </div>
          </div>
          
          {/* Safety Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-purple-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Segurança</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ambiente seguro para exploração e desenvolvimento.
            </p>
            <div className="mt-2 text-xs text-purple-600">
              Confiança: 85%
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'babies', label: 'Bebês', icon: Baby },
    { id: 'tests', label: 'Testes', icon: FileText },
    { id: 'recommendations', label: 'Recomendações', icon: Heart },
    { id: 'insights', label: 'Insights', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Saúde do Bebê
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Acompanhamento de saúde com Babytest OLLIN
              </p>
            </div>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Consulta
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
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'babies' && renderBabies()}
            {activeTab === 'tests' && renderTests()}
            {activeTab === 'recommendations' && renderRecommendations()}
            {activeTab === 'insights' && renderInsights()}
          </>
        )}
      </div>
    </div>
  );
};
