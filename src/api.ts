export async function analyzeRequest(request: string, context: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a senior developer translating vague client requests into real implementation impact.`,
        },
        {
          role: "user",
          content: `
Client request: ${request}
Context: ${context}

Output in this exact format:

IMPACT:
- ...

OPTIONS:
- Quick: ...
- Proper: ...

REPLY:
...
          `,
        },
      ],
    }),
  });

  const data = await res.json();
  return data.choices[0].message.content;
}