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

  const handleScheduleTest = (testType: string) => {
    // Direcionar para o checkout do OLLIN
    const ollinCheckoutUrl = `https://www.babytest.com.br/checkout?test=${testType}`;
    window.open(ollinCheckoutUrl, '_blank');
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
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedBaby?.id === baby.id
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
            <div className="text-center py-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center">
                    <Heart className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Testes Genéticos OLLIN
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                    Investigue mais de 600 doenças genéticas tratáveis com tecnologia de ponta. 
                    O ideal é fazer o teste do 1º ao 20º dia de vida do bebê.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                <Star className="w-6 h-6 text-green-500" />
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Babytest Plus</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Análise completa com 600+ doenças
                            </p>
                            <Button
                                onClick={() => handleScheduleTest('babytest_plus')}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Fazer Teste Plus
                            </Button>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-500" />
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Babytest Basic</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Análise essencial para triagem
                            </p>
                            <Button
                                onClick={() => handleScheduleTest('babytest_basic')}
                                variant="outline"
                                className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Fazer Teste Basic
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">Melhor momento para fazer o teste:</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                        1º ao 20º dia de vida - <strong>MELHOR MOMENTO</strong> | 
                        Primeiro ano - <strong>BOM</strong> | 
                        Maior que 1 ano - <strong>NÃO RECOMENDADO</strong>
                    </p>
                </div>
            </div>
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
                                        <div className={`w-2 h-2 rounded-full ${rec.priority === 'urgent' ? 'bg-red-500' :
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

                                <div className={`px-2 py-1 rounded-full text-xs ${rec.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Baby className="w-8 h-8" />
              <h1 className="text-3xl font-bold">
                Saúde do Bebê
              </h1>
            </div>
            <p className="text-blue-100 text-lg">
              Acompanhamento de saúde com tecnologia avançada
            </p>
          </div>
        </div>
      </div>

      {/* OLLIN Banner */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      Babytest by OLLIN
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      O melhor para o seu bebê desde os primeiros dias de vida
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        600+ doenças analisadas
                      </span>
                      <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                        <Shield className="w-4 h-4" />
                        Tecnologia confiável
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleScheduleTest('babytest_plus')}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Babytest Plus
                  </Button>
                  <Button
                    onClick={() => handleScheduleTest('babytest_basic')}
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-6 py-3"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Babytest Basic
                  </Button>
                </div>
              </div>
            </div>
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
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
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
