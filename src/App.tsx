import { useMemo, useState } from "react";

type ParsedResult = {
  impact: string[];
  options: {
    quick: string;
    proper: string;
  };
  reply: string;
};

const DEMO_RESPONSE = `IMPACT:
- touches the current flow and may require UI updates
- may affect backend logic or existing conditions
- adds testing scope before delivery
- can impact timeline if added mid-build

OPTIONS:
- Quick: implement a lighter workaround faster, but with a higher risk of future issues
- Proper: implement it cleanly, test it properly, and adjust scope or timeline accordingly

REPLY:
This change is possible, but it affects the current implementation more than it seems at first glance. We can either handle it as a quick workaround now, or treat it as a scoped change and adjust timeline or cost for a proper implementation.`;

function parseResponse(text: string): ParsedResult {
  const impactMatch = text.match(/IMPACT:\s*([\s\S]*?)\n\nOPTIONS:/i);
  const optionsMatch = text.match(/OPTIONS:\s*([\s\S]*?)\n\nREPLY:/i);
  const replyMatch = text.match(/REPLY:\s*([\s\S]*)/i);

  const impact = impactMatch
    ? impactMatch[1]
        .split("\n")
        .map((line) => line.replace(/^[-•]\s*/, "").trim())
        .filter(Boolean)
    : [];

  const optionLines = optionsMatch
    ? optionsMatch[1]
        .split("\n")
        .map((line) => line.replace(/^[-•]\s*/, "").trim())
        .filter(Boolean)
    : [];

  const quick =
    optionLines.find((line) => /^quick\s*:/i.test(line))?.replace(/^quick\s*:/i, "").trim() ||
    "Offer a faster workaround with known tradeoffs.";

  const proper =
    optionLines.find((line) => /^proper\s*:/i.test(line))?.replace(/^proper\s*:/i, "").trim() ||
    "Treat it as a scoped change with proper implementation and testing.";

  const reply = replyMatch?.[1]?.trim() || "";

  return {
    impact,
    options: { quick, proper },
    reply,
  };
}

async function analyzeRequest(request: string, context: string, workType: string): Promise<string> {
  // Replace this mock with your OpenAI API call later.
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (!request.trim()) {
    throw new Error("Missing client request.");
  }

  return DEMO_RESPONSE.replace(
    "touches the current flow",
    workType === "Automation"
      ? "touches the current automation flow"
      : workType === "Design"
        ? "touches the current design flow"
        : "touches the current flow"
  ).replace(
    "This change is possible",
    context.trim() ? "Given the current project context, this change is possible" : "This change is possible"
  );
}

export default function ScopeTranslatorMVP() {
  const [request, setRequest] = useState("");
  const [context, setContext] = useState("");
  const [workType, setWorkType] = useState("Web development");
  const [rawResult, setRawResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => parseResponse(rawResult), [rawResult]);

  const handleAnalyze = async () => {
    setError("");
    setCopied(false);

    if (!request.trim()) {
      setError("Paste the client request first.");
      return;
    }

    try {
      setLoading(true);
      const result = await analyzeRequest(request, context, workType);
      setRawResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not analyze this request.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReply = async () => {
    if (!parsed.reply) return;
    await navigator.clipboard.writeText(parsed.reply);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <p className="text-lg font-semibold tracking-tight">Scope Translator</p>
            <p className="text-sm text-zinc-400">Turn vague client requests into clear decisions.</p>
          </div>
          <p className="hidden text-sm text-zinc-500 md:block">For freelancers, agencies, and developers</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl shadow-black/20">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Stop replying to client changes on the spot
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                Paste the request, add a bit of context, and get a structured response you can actually use.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">Client request</label>
                <textarea
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder={'“Can we just add a button here?”\n“Can we make this section editable?”\n“This should be a quick change, right?”'}
                  className="min-h-[150px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700"
                />
                <p className="mt-2 text-xs text-zinc-500">Paste the exact message from the client.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">Project context</label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Custom Shopify store, checkout has custom logic, timeline is already tight."
                  className="min-h-[110px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700"
                />
                <p className="mt-2 text-xs text-zinc-500">Optional, but helps make the output more accurate.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">Work type</label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700"
                >
                  <option>Web development</option>
                  <option>Automation</option>
                  <option>Design</option>
                  <option>Internal tools</option>
                  <option>Other</option>
                </select>
                <p className="mt-2 text-xs text-zinc-500">Used to slightly adjust the impact framing.</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? "Analyzing request..." : "Analyze request"}
                </button>
                <p className="mt-2 text-xs text-zinc-500">Get a quick breakdown before you answer.</p>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}
            </div>
          </section>

          <section className="space-y-4">
            {!rawResult && !loading ? (
              <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="text-lg font-semibold">Paste a request to get started</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  You’ll get a practical impact breakdown, response options, and a client-friendly reply.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
                    Practical impact
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
                    Clear options
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
                    Client-ready reply
                  </div>
                </div>
              </div>
            ) : null}

            {loading ? (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-lg font-semibold">Analyzing request...</h2>
                <p className="mt-2 text-sm text-zinc-400">Mapping impact, tradeoffs, and reply.</p>
              </div>
            ) : null}

            {rawResult ? (
              <div className="grid gap-4 xl:grid-cols-3">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
                  <h3 className="text-base font-semibold">Impact</h3>
                  <p className="mt-1 text-sm text-zinc-400">What this request actually means in practice.</p>
                  <ul className="mt-4 space-y-3 text-sm text-zinc-200">
                    {parsed.impact.map((item) => (
                      <li key={item} className="rounded-2xl border border-zinc-800 bg-zinc-950 px-3 py-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
                  <h3 className="text-base font-semibold">Options</h3>
                  <p className="mt-1 text-sm text-zinc-400">Different ways to handle it.</p>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="font-medium text-zinc-100">Quick / cheap</p>
                      <p className="mt-2 text-zinc-300">{parsed.options.quick}</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="font-medium text-zinc-100">Proper implementation</p>
                      <p className="mt-2 text-zinc-300">{parsed.options.proper}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
                  <h3 className="text-base font-semibold">Client reply</h3>
                  <p className="mt-1 text-sm text-zinc-400">A professional reply you can copy, edit, and send.</p>
                  <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-200">
                    {parsed.reply}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={handleCopyReply}
                      className="rounded-2xl border border-zinc-700 px-3 py-2 text-sm text-zinc-100 transition hover:bg-zinc-800"
                    >
                      {copied ? "Copied" : "Copy reply"}
                    </button>
                    <button
                      onClick={() => setRawResult(DEMO_RESPONSE.replace("higher risk of future issues", "higher risk of regressions or patchwork fixes"))}
                      className="rounded-2xl border border-zinc-700 px-3 py-2 text-sm text-zinc-100 transition hover:bg-zinc-800"
                    >
                      Regenerate tone
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-300">Why this helps</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Most client requests sound small in words, but expand once you look at what they actually touch.
                This forces a pause before you say yes.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
