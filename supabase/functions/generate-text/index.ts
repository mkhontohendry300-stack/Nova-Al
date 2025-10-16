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
    const { prompt, type, documentText } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = prompt;

    // Customize prompts based on generation type
    switch (type) {
      case 'essay':
        systemPrompt = 'You are an expert essay writer. Create well-structured, insightful essays with clear arguments and evidence.';
        break;
      case 'story':
        systemPrompt = 'You are a creative storyteller. Write engaging narratives with vivid descriptions and compelling characters.';
        break;
      case 'lesson':
        systemPrompt = 'You are an experienced educator. Create comprehensive lesson plans that are clear, structured, and educational.';
        break;
      case 'research':
        systemPrompt = 'You are a research analyst. Provide thorough, well-researched summaries with proper structure and citations.';
        break;
      case 'marketing':
        systemPrompt = 'You are a marketing expert. Create compelling, persuasive content that engages audiences and drives action.';
        break;
      case 'summarize':
        systemPrompt = 'You are a professional summarizer. Create concise, accurate summaries that capture the key points.';
        userPrompt = `Summarize the following text:\n\n${documentText}\n\nAdditional instructions: ${prompt}`;
        break;
      case 'rewrite':
        systemPrompt = 'You are a skilled editor and rewriter. Improve clarity, style, and impact while preserving the original meaning.';
        userPrompt = `Rewrite the following text:\n\n${documentText}\n\nRewriting instructions: ${prompt}`;
        break;
      default:
        systemPrompt = 'You are a helpful AI assistant skilled in various forms of writing and content creation.';
    }

    console.log('Generating text with type:', type);

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
          { role: 'user', content: userPrompt }
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
      
      throw new Error(`AI generation failed: ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('Text generated successfully');

    return new Response(
      JSON.stringify({ text: generatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-text function:', error);
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
