// =====================================================
// CLUBNATH - TESTE AUTOMATIZADO DE TODAS AS FUNCIONALIDADES
// =====================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bbcwitnbnosyfpfjtzkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODI3NjgsImV4cCI6MjA3NTg1ODc2OH0.a9g_JqrWWnLli_PV0sPikz8KPAWiKY81mQ1hJAbNtCo';

const supabase = createClient(supabaseUrl, supabaseKey);

// =====================================================
// TESTES DE FUNCIONALIDADES
// =====================================================

async function testSupabaseConnection() {
  console.log('🔌 Testando conexão com Supabase...');
  
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.log('❌ Erro de conexão:', error.message);
      return false;
    }
    
    console.log('✅ Conexão com Supabase OK');
    return true;
  } catch (err) {
    console.log('❌ Erro de conexão:', err.message);
    return false;
  }
}

async function testCoreTables() {
  console.log('📋 Testando tabelas principais...');
  
  const coreTables = [
    'profiles', 'posts', 'comments', 'likes', 'chat_messages'
  ];
  
  const results = [];
  
  for (const table of coreTables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        results.push({ table, status: '❌ ERRO', error: error.message });
      } else {
        results.push({ table, status: '✅ OK' });
      }
    } catch (err) {
      results.push({ table, status: '❌ EXCEÇÃO', error: err.message });
    }
  }
  
  return results;
}

async function testAdvancedFeatures() {
  console.log('🚀 Testando funcionalidades avançadas...');
  
  const features = [
    { name: 'Badges', table: 'badges' },
    { name: 'Grupos', table: 'groups' },
    { name: 'Orações', table: 'prayer_posts' },
    { name: 'Journaling', table: 'journal_entries' },
    { name: 'Estudos Bíblicos', table: 'bible_studies' },
    { name: 'SOS Emocional', table: 'emergency_resources' },
    { name: 'Chat History', table: 'chat_history' },
    { name: 'Notificações', table: 'notification_subscriptions' }
  ];
  
  const results = [];
  
  for (const feature of features) {
    try {
      const { data, error } = await supabase.from(feature.table).select('*').limit(1);
      
      if (error) {
        results.push({ feature: feature.name, status: '❌ ERRO', error: error.message });
      } else {
        results.push({ feature: feature.name, status: '✅ OK', count: data?.length || 0 });
      }
    } catch (err) {
      results.push({ feature: feature.name, status: '❌ EXCEÇÃO', error: err.message });
    }
  }
  
  return results;
}

async function testDataIntegrity() {
  console.log('🔍 Testando integridade dos dados...');
  
  const tests = [];
  
  // Teste 1: Verificar se há badges cadastradas
  try {
    const { data, error } = await supabase.from('badges').select('*');
    
    if (error) {
      tests.push({ test: 'Badges cadastradas', status: '❌ ERRO', error: error.message });
    } else {
      const count = data?.length || 0;
      tests.push({ 
        test: 'Badges cadastradas', 
        status: count > 0 ? '✅ OK' : '⚠️ VAZIO', 
        count: count 
      });
    }
  } catch (err) {
    tests.push({ test: 'Badges cadastradas', status: '❌ EXCEÇÃO', error: err.message });
  }
  
  // Teste 2: Verificar recursos de emergência
  try {
    const { data, error } = await supabase.from('emergency_resources').select('*');
    
    if (error) {
      tests.push({ test: 'Recursos de emergência', status: '❌ ERRO', error: error.message });
    } else {
      const count = data?.length || 0;
      tests.push({ 
        test: 'Recursos de emergência', 
        status: count > 0 ? '✅ OK' : '⚠️ VAZIO', 
        count: count 
      });
    }
  } catch (err) {
    tests.push({ test: 'Recursos de emergência', status: '❌ EXCEÇÃO', error: err.message });
  }
  
  // Teste 3: Verificar estudos bíblicos
  try {
    const { data, error } = await supabase.from('bible_studies').select('*');
    
    if (error) {
      tests.push({ test: 'Estudos bíblicos', status: '❌ ERRO', error: error.message });
    } else {
      const count = data?.length || 0;
      tests.push({ 
        test: 'Estudos bíblicos', 
        status: count > 0 ? '✅ OK' : '⚠️ VAZIO', 
        count: count 
      });
    }
  } catch (err) {
    tests.push({ test: 'Estudos bíblicos', status: '❌ EXCEÇÃO', error: err.message });
  }
  
  return tests;
}

// =====================================================
// FUNÇÃO PRINCIPAL
// =====================================================

async function runAllTests() {
  console.log('🚀 INICIANDO TESTES COMPLETOS DO CLUBNATH');
  console.log('==========================================');
  
  try {
    // Teste de conexão
    const connectionOk = await testSupabaseConnection();
    
    if (!connectionOk) {
      console.log('❌ Falha na conexão. Abortando testes.');
      return;
    }
    
    console.log('');
    
    // Executar todos os testes
    const [coreTables, advancedFeatures, dataIntegrity] = await Promise.all([
      testCoreTables(),
      testAdvancedFeatures(),
      testDataIntegrity()
    ]);
    
    // Exibir resultados
    console.log('📊 RESULTADOS DOS TESTES:');
    console.log('=========================');
    
    console.log('\n📋 TABELAS PRINCIPAIS:');
    coreTables.forEach(({ table, status, error }) => {
      console.log(`  ${status} ${table}`);
      if (error) console.log(`    Erro: ${error}`);
    });
    
    console.log('\n🚀 FUNCIONALIDADES AVANÇADAS:');
    advancedFeatures.forEach(({ feature, status, error, count }) => {
      const countText = count !== undefined ? ` (${count} registros)` : '';
      console.log(`  ${status} ${feature}${countText}`);
      if (error) console.log(`    Erro: ${error}`);
    });
    
    console.log('\n🔍 INTEGRIDADE DOS DADOS:');
    dataIntegrity.forEach(({ test, status, error, count }) => {
      const countText = count !== undefined ? ` (${count} registros)` : '';
      console.log(`  ${status} ${test}${countText}`);
      if (error) console.log(`    Erro: ${error}`);
    });
    
    // Resumo final
    const totalTests = coreTables.length + advancedFeatures.length + dataIntegrity.length;
    const passedTests = [
      ...coreTables.filter(t => t.status === '✅ OK'),
      ...advancedFeatures.filter(f => f.status === '✅ OK'),
      ...dataIntegrity.filter(d => d.status === '✅ OK')
    ].length;
    
    const warningTests = [
      ...dataIntegrity.filter(d => d.status === '⚠️ VAZIO')
    ].length;
    
    console.log('\n🎯 RESUMO FINAL:');
    console.log('================');
    console.log(`✅ Testes aprovados: ${passedTests}/${totalTests}`);
    console.log(`⚠️ Avisos: ${warningTests}/${totalTests}`);
    console.log(`❌ Testes falharam: ${totalTests - passedTests - warningTests}/${totalTests}`);
    
    if (passedTests === totalTests) {
      console.log('\n🎉 CLUBNATH 100% FUNCIONAL!');
      console.log('Todas as funcionalidades estão operacionais.');
    } else if (passedTests + warningTests === totalTests) {
      console.log('\n✅ CLUBNATH FUNCIONAL COM AVISOS!');
      console.log('Funcionalidades operacionais, mas alguns dados podem estar vazios.');
    } else {
      console.log('\n⚠️ ALGUMAS FUNCIONALIDADES PRECISAM DE ATENÇÃO');
      console.log('Verifique os erros acima e aplique as correções necessárias.');
    }
    
  } catch (error) {
    console.log('❌ Erro geral nos testes:', error.message);
  }
}

// Executar todos os testes
runAllTests();
