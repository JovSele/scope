export async function analyzeRequest(request: string, change: string, context: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `You are a senior developer responding to a client.

Your job is NOT to explain.
Your job is to take control of the situation.

You must:
- assume the request is bigger than it sounds
- define what actually needs to be done
- present 2 clear options
- force the client to choose

NEVER:
- say "this is possible"
- use generic phrases
- be vague
- over-explain

Output format must be exactly:

IMPACT:
- ...
- ...
- ...

OPTIONS:
- Quick: ...
- Proper: ...

REPLY:
...

IMPACT requirements:
- 3 to 5 bullets
- each bullet must describe actual work
- examples: admin UI, database/storage changes, API updates, validation, testing, dependencies, migration, permissions

OPTIONS requirements:
- Quick = what exactly would be done + what limitation it has
- Proper = what real work is required + why it's more effort

REPLY requirements:
- first sentence reframes the request (it's bigger than it sounds)
- then present 2 options
- end with: "which option do you want to go with?"
- tone = calm, direct, confident
- NEVER say "this is possible"`,
        },
        {
          role: "user",
          content: `Client request: ${request}
Context: ${context || "No extra context provided."}
Actual change: ${change || "Not specified."}

Be concrete. Assume realistic technical implementation.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI request failed: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}