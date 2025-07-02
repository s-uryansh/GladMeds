export async function queryOpenAI(prompt: string): Promise<string> {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful medical assistant. Answer cautiously and ethically.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.4,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Unknown OpenAI API error');
    }

    return data.choices?.[0]?.message?.content || 'No response from model';
  } catch (error) {
    console.error('OpenAI query failed:', error);
    return 'AI assistant is currently unavailable. Please try again later.';
  }
}
