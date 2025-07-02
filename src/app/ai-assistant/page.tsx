'use client';

import { useState } from 'react';

export default function AiAssistantPage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      if (data.result) {
        setResponse(data.result);
      } else {
        setResponse('Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setResponse('Error contacting AI assistant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative">
      <div className="container flex flex-col items-center justify-center min-h-[75vh] pt-10">
        <h1 className="text-white text-center font-bold text-4xl sm:text-5xl mb-10">
          Your AI Medical Assistant
          <p className="text-sm text-lightblue italic">
            Before using the AI Assistant, please fill out your medical information on the Home page or from your Profile.
            <br />
            <span className="text-white">Tip:</span> On the Home page, click the <strong>“Get Started”</strong> button to begin.
          </p>
        </h1>
        <div className="w-full max-w-2xl backdrop-blur-lg bg-white/5 border border-border rounded-2xl p-6 space-y-6 shadow-lg">
          <textarea
            className="w-full bg-transparent text-white border border-primary rounded-xl px-4 py-3 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-lightblue"
            placeholder="Ask something like: Can I take ibuprofen if I have asthma?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Ask Assistant'}
          </button>

          {response && (
            <div className="bg-tablebg border border-border p-4 rounded-xl text-lightpurple whitespace-pre-wrap">
              <strong className="block text-lightsky mb-2">Response:</strong>
              <p>{response}</p>
            </div>
          )}
          
        </div>
        
      </div>
      
    </section>
  );
}
