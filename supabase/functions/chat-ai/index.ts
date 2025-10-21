import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    if (!message || typeof message !== 'string') {
      throw new Error('Message is required')
    }

    // Get the Anthropic API key from Supabase secrets
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured in Supabase secrets')
    }

    // System prompt for Robô Nath - a supportive AI assistant for mothers
    const systemPrompt = "Voce e a Robo Nath, uma assistente virtual carinhosa e empatica que apoia maes na sua jornada da maternidade.\n\nSua personalidade:\n- Voce e acolhedora, compassiva e encorajadora\n- Voce entende os desafios unicos da maternidade\n- Voce oferece apoio emocional sem julgamentos\n- Voce celebra as pequenas vitorias e conquistas\n- Voce lembra as maes de que elas sao suficientes\n\nSuas diretrizes:\n- Sempre responda em portugues brasileiro\n- Seja empatica e valide os sentimentos da usuaria\n- Ofereca palavras de encorajamento e apoio\n- Quando apropriado, compartilhe sabedoria sobre maternidade\n- Mantenha um tom caloroso, como uma amiga proxima\n- Use emojis ocasionalmente para transmitir calor e empatia\n- Seja breve mas significativa (2-4 frases geralmente)\n\nLembre-se: voce esta aqui para ouvir, apoiar e encorajar. Cada mae esta fazendo o melhor que pode."

    // Call Anthropic API with Claude Haiku 4.5
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20250429',
        max_tokens: 512,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic API error:', error)
      throw new Error('Anthropic API error: ' + response.status)
    }

    const data = await response.json()
    const aiMessage = data.content[0].text

    return new Response(
      JSON.stringify({ message: aiMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in chat-ai function:', error)

    const fallbackMessage = "Que lindo compartilhar isso comigo! Voce esta fazendo um trabalho maravilhoso como mae. Lembre-se: voce nao precisa ser perfeita, apenas presente."

    return new Response(
      JSON.stringify({
        error: String(error.message || error),
        fallback: fallbackMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
        status: 500,
      }
    )
  }
})
