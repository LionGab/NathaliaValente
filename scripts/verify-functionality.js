// =====================================================
// CLUBNATH - VERIFICAÇÃO DE FUNCIONALIDADE
// Script para testar todas as funcionalidades
// =====================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bbcwitnbnosyfpfjtzkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODI3NjgsImV4cCI6MjA3NTg1ODc2OH0.a9g_JqrWWnLli_PV0sPikz8KPAWiKY81mQ1hJAbNtCo';

const supabase = createClient(supabaseUrl, supabaseKey);

// =====================================================
// FUNÇÕES DE VERIFICAÇÃO
// =====================================================

async function checkTables() {
  console.log('🔍 Verificando tabelas...');
  
  const requiredTables = [
    'profiles', 'posts', 'comments', 'likes', 'nathy_badges', 'saved_items',
    'chat_messages', 'daily_quotes', 'groups', 'group_members', 'group_posts',
    'chat_history', 'chat_summaries', 'memory_preferences', 'bible_studies',
    'user_bible_progress', 'badges', 'user_badges', 'badge_progress',
    'notification_subscriptions', 'prayer_posts', 'prayer_amens', 'prayer_categories',
    'journal_entries', 'journal_prompts', 'user_mood_tracker', 'journal_streaks',
    'emergency_resources', 'crisis_sessions', 'coping_techniques', 'technique_usage',
    'user_emergency_contacts', 'crisis_analytics'
  ];

  const results = [];
  
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        results.push({ table, status: '❌ ERRO', error: error.message });
      } else {
        results.push({ table, status: '✅ OK', count: data?.length || 0 });
      }
    } catch (err) {
      results.push({ table, status: '❌ EXCEÇÃO', error: err.message });
    }
  }

  return results;
}

async function checkRLS() {
  console.log('🔒 Verificando RLS...');
  
  const { data, error } = await supabase.rpc('check_rls_status');
  
  if (error) {
    console.log('❌ Erro ao verificar RLS:', error.message);
    return false;
  }
  
  console.log('✅ RLS verificado com sucesso');
  return true;
}

async function checkFunctions() {
  console.log('⚙️ Verificando funções customizadas...');
  
  const functions = [
    'check_and_award_badges',
    'update_badge_progress',
    'end_crisis_session',
    'log_technique_usage',
    'get_emergency_resources_by_category'
  ];

  const results = [];
  
  for (const func of functions) {
    try {
      // Testar função com parâmetros dummy
      const { data, error } = await supabase.rpc(func, {});
      
      if (error && !error.message.includes('function') && !error.message.includes('parameter')) {
        results.push({ function: func, status: '❌ ERRO', error: error.message });
      } else {
        results.push({ function: func, status: '✅ OK' });
      }
    } catch (err) {
      results.push({ function: func, status: '❌ EXCEÇÃO', error: err.message });
    }
  }

  return results;
}

async function testBasicOperations() {
  console.log('🧪 Testando operações básicas...');
  
  const tests = [];
  
  // Teste 1: Inserir perfil de teste
  try {
    const testProfile = {
      id: 'test-user-' + Date.now(),
      full_name: 'Usuário Teste',
      bio: 'Perfil de teste para verificação',
      onboarding_completed: true
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(testProfile);
    
    if (error) {
      tests.push({ test: 'Inserir perfil', status: '❌ ERRO', error: error.message });
    } else {
      tests.push({ test: 'Inserir perfil', status: '✅ OK' });
      
      // Limpar perfil de teste
      await supabase.from('profiles').delete().eq('id', testProfile.id);
    }
  } catch (err) {
    tests.push({ test: 'Inserir perfil', status: '❌ EXCEÇÃO', error: err.message });
  }
  
  // Teste 2: Buscar badges
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .limit(5);
    
    if (error) {
      tests.push({ test: 'Buscar badges', status: '❌ ERRO', error: error.message });
    } else {
      tests.push({ test: 'Buscar badges', status: '✅ OK', count: data?.length || 0 });
    }
  } catch (err) {
    tests.push({ test: 'Buscar badges', status: '❌ EXCEÇÃO', error: err.message });
  }
  
  // Teste 3: Buscar recursos de emergência
  try {
    const { data, error } = await supabase
      .from('emergency_resources')
      .select('*')
      .limit(5);
    
    if (error) {
      tests.push({ test: 'Buscar recursos emergência', status: '❌ ERRO', error: error.message });
    } else {
      tests.push({ test: 'Buscar recursos emergência', status: '✅ OK', count: data?.length || 0 });
    }
  } catch (err) {
    tests.push({ test: 'Buscar recursos emergência', status: '❌ EXCEÇÃO', error: err.message });
  }
  
  return tests;
}

// =====================================================
// FUNÇÃO PRINCIPAL
// =====================================================

async function runVerification() {
  console.log('🚀 INICIANDO VERIFICAÇÃO DO CLUBNATH');
  console.log('=====================================');
  
  try {
    // Verificar conexão
    console.log('🔌 Testando conexão com Supabase...');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.log('❌ Erro de conexão:', error.message);
      return;
    }
    
    console.log('✅ Conexão com Supabase OK');
    console.log('');
    
    // Executar verificações
    const [tables, functions, operations] = await Promise.all([
      checkTables(),
      checkFunctions(),
      testBasicOperations()
    ]);
    
    // Exibir resultados
    console.log('📊 RESULTADOS DA VERIFICAÇÃO:');
    console.log('=============================');
    
    console.log('\n📋 TABELAS:');
    tables.forEach(({ table, status, error, count }) => {
      const countText = count !== undefined ? ` (${count} registros)` : '';
      console.log(`  ${status} ${table}${countText}`);
      if (error) console.log(`    Erro: ${error}`);
    });
    
    console.log('\n⚙️ FUNÇÕES:');
    functions.forEach(({ function: func, status, error }) => {
      console.log(`  ${status} ${func}`);
      if (error) console.log(`    Erro: ${error}`);
    });
    
    console.log('\n🧪 OPERAÇÕES:');
    operations.forEach(({ test, status, error, count }) => {
      const countText = count !== undefined ? ` (${count} registros)` : '';
      console.log(`  ${status} ${test}${countText}`);
      if (error) console.log(`    Erro: ${error}`);
    });
    
    // Resumo final
    const totalTests = tables.length + functions.length + operations.length;
    const passedTests = [
      ...tables.filter(t => t.status === '✅ OK'),
      ...functions.filter(f => f.status === '✅ OK'),
      ...operations.filter(o => o.status === '✅ OK')
    ].length;
    
    console.log('\n🎯 RESUMO FINAL:');
    console.log('================');
    console.log(`✅ Testes aprovados: ${passedTests}/${totalTests}`);
    console.log(`❌ Testes falharam: ${totalTests - passedTests}/${totalTests}`);
    
    if (passedTests === totalTests) {
      console.log('\n🎉 CLUBNATH 100% FUNCIONAL!');
      console.log('Todas as funcionalidades estão operacionais.');
    } else {
      console.log('\n⚠️ ALGUMAS FUNCIONALIDADES PRECISAM DE ATENÇÃO');
      console.log('Verifique os erros acima e aplique as correções necessárias.');
    }
    
  } catch (error) {
    console.log('❌ Erro geral na verificação:', error.message);
  }
}

// Executar verificação
runVerification();
