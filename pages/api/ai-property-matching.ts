
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openRouterApiKey = process.env.OPENROUTER_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Fetch user profile and preferences
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: preferences } = await supabase
      .from('search_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: favorites } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('user_id', userId);

    const favoriteIds = favorites?.map(f => f.property_id) || [];

    // Fetch available properties
    let query = supabase
      .from('properties')
      .select('*')
      .eq('is_available', true);

    if (favoriteIds.length > 0) {
      query = query.not('id', 'in', `(${favoriteIds.join(',')})`);
    }

    const { data: properties } = await query.limit(20);

    if (!properties || properties.length === 0) {
      return res.json({ matches: [] });
    }

    // Create AI prompt
    const userContext = {
      profile: profile || {},
      preferences: preferences || {},
      hasPreferences: !!preferences
    };

    const prompt = `You are an AI property matching assistant. Based on the user's profile and preferences, analyze the following properties and provide smart matches.

User Context:
${JSON.stringify(userContext, null, 2)}

Available Properties:
${JSON.stringify(properties, null, 2)}

Please analyze each property and provide matches with scores and reasons. Return a JSON object with this exact structure:
{
  "matches": [
    {
      "property": <full property object>,
      "matchScore": <number between 0-100>,
      "reasons": ["reason1", "reason2", "reason3"]
    }
  ]
}

Only include properties with a match score of 60 or higher. Sort by match score (highest first). Limit to top 10 matches.

Consider factors like:
- Price range preferences
- Location preferences  
- Property type preferences
- Amenities preferences
- Bedroom/bathroom requirements
- Furnished preferences
- Pet-friendly preferences
- User's profile information

Provide specific, personalized reasons for each match.`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Property Rental Platform'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from AI');
    }

    // Parse AI response
    let matches;
    try {
      const parsed = JSON.parse(content);
      matches = parsed.matches || [];
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      matches = [];
    }

    return res.json({ matches });

  } catch (error) {
    console.error('AI Property Matching Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
