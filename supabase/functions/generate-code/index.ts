import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, language, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    
    switch (action) {
      case 'write':
        systemPrompt = `You are an expert ${language || 'programming'} developer. Write clean, efficient, well-documented code following best practices. Always include comments explaining the code logic.`;
        break;
      case 'debug':
        systemPrompt = `You are a debugging expert. Analyze the code carefully, identify bugs, and provide corrected code with explanations of what was wrong and how you fixed it.`;
        break;
      case 'explain':
        systemPrompt = `You are a programming teacher. Explain code clearly and thoroughly, breaking down complex concepts into understandable parts. Use examples and analogies when helpful.`;
        break;
      default:
        systemPrompt = `You are a skilled ${language || 'programming'} developer. Help with code-related tasks professionally.`;
    }

    console.log('Generating code with language:', language, 'action:', action);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI credits exhausted. Please add credits to continue.');
      }
      
      throw new Error(`Code generation failed: ${errorText}`);
    }

    const data = await response.json();
    const generatedCode = data.choices[0].message.content;

    console.log('Code generated successfully');

    return new Response(
      JSON.stringify({ code: generatedCode }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-code function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
