import { useEffect, useState } from "react";

// Response variations for each classification
const RESPONSES = {
  small: [
    "I'll include this as part of the current scope.",
    "I can handle this within the current scope.",
    "This fits within what we're already working on, so I'll include it.",
  ],
  medium: [
    "This change affects the current implementation, so I'll include it in the next phase or we can swap it with something else from the current scope.",
    "This touches the existing setup, so we can either move it to the next phase or swap it with something from the current scope.",
    "This impacts what we're building, so I'd suggest including it in the next phase or swapping it with another item in the current scope.",
  ],
  large: [
    `This change impacts the current system more than it seems, so it needs to be treated as a separate scope change.

We can either:
- adjust the timeline, or
- define it as a separate task

How would you like to proceed?`,
    `This request affects the existing setup more deeply than it looks, so it should be treated as a separate scope change.

We can either:
- adjust the timeline, or
- define it as a separate task

How would you like to proceed?`,
    `This goes beyond a small change and affects the current system, so it needs to be treated as a separate scope change.

We can either:
- adjust the timeline, or
- define it as a separate task

How would you like to proceed?`,
  ],
};

export default function ScopeDecisionSystem() {
  const [request, setRequest] = useState("");
  const [change, setChange] = useState("");
  const [context, setContext] = useState("");
  const [classification, setClassification] = useState<"small" | "medium" | "large" | null>(null);
  const [checks, setChecks] = useState({
    logic: false,
    backend: false,
    testing: false,
    ux: false,
  });
  const [copied, setCopied] = useState(false);
  const [variantIndex, setVariantIndex] = useState(0);

  // Auto-override logic based on checked items
  useEffect(() => {
    const checkedCount = Object.values(checks).filter(Boolean).length;
    
    if (checkedCount >= 3) {
      setClassification("large");
    } else if (checkedCount >= 2) {
      setClassification("medium");
    }
  }, [checks]);

  // Pick a random variant when classification changes
  useEffect(() => {
    if (classification) {
      const variants = RESPONSES[classification];
      setVariantIndex(Math.floor(Math.random() * variants.length));
    }
  }, [classification]);

  const getResponse = (): string => {
    if (!classification) return "";
    return RESPONSES[classification][variantIndex];
  };

  const handleRegenerate = () => {
    if (!classification) return;
    const variants = RESPONSES[classification];
    // Pick a different variant
    let newIndex = Math.floor(Math.random() * variants.length);
    // Ensure it's different from current if there are multiple variants
    if (variants.length > 1) {
      while (newIndex === variantIndex) {
        newIndex = Math.floor(Math.random() * variants.length);
      }
    }
    setVariantIndex(newIndex);
  };

  const handleCopyReply = async () => {
    const response = getResponse();
    if (!response) return;
    await navigator.clipboard.writeText(response);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const response = getResponse();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <p className="text-lg font-semibold tracking-tight">Scope Decision System</p>
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
                Paste the request, classify the change, and get a structured response you can actually use.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">Client request</label>
                <textarea
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder={'"Can we just add a button here?"\n"Can we make this section editable?"\n"This should be a quick change, right?"'}
                  className="min-h-[150px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700"
                />
                <p className="mt-2 text-xs text-zinc-500">Paste the exact message from the client.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">Describe the change in your own words</label>
                <textarea
                  value={change}
                  onChange={(e) => setChange(e.target.value)}
                  placeholder="e.g. connect form submissions to HubSpot CRM and map custom fields"
                  className="min-h-[110px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700"
                />
                <p className="mt-2 text-xs text-zinc-500">Optional, but helps make the output more accurate.</p>
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
                <label className="mb-2 block text-sm font-medium text-zinc-200">Classify the change</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setClassification("small")}
                    className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      classification === "small"
                        ? "border-green-600 bg-green-950/50 text-green-200"
                        : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    🟢 Small
                    <span className="mt-1 block text-xs font-normal opacity-70">(under 15 min)</span>
                  </button>
                  <button
                    onClick={() => setClassification("medium")}
                    className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      classification === "medium"
                        ? "border-yellow-600 bg-yellow-950/50 text-yellow-200"
                        : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    🟡 Medium
                    <span className="mt-1 block text-xs font-normal opacity-70">(affects scope)</span>
                  </button>
                  <button
                    onClick={() => setClassification("large")}
                    className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      classification === "large"
                        ? "border-red-600 bg-red-950/50 text-red-200"
                        : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    🔴 Large
                    <span className="mt-1 block text-xs font-normal opacity-70">(affects system)</span>
                  </button>
                </div>
                <p className="mt-2 text-xs text-zinc-400">If you're unsure, start with Medium. The checklist will adjust it.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">Impact checklist</label>
                <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checks.logic}
                      onChange={(e) => setChecks({ ...checks, logic: e.target.checked })}
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-zinc-100 focus:ring-2 focus:ring-zinc-700"
                    />
                    <span className="text-sm text-zinc-200">Touches existing logic</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checks.backend}
                      onChange={(e) => setChecks({ ...checks, backend: e.target.checked })}
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-zinc-100 focus:ring-2 focus:ring-zinc-700"
                    />
                    <span className="text-sm text-zinc-200">Requires backend / automation change</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checks.testing}
                      onChange={(e) => setChecks({ ...checks, testing: e.target.checked })}
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-zinc-100 focus:ring-2 focus:ring-zinc-700"
                    />
                    <span className="text-sm text-zinc-200">Requires testing</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checks.ux}
                      onChange={(e) => setChecks({ ...checks, ux: e.target.checked })}
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-zinc-100 focus:ring-2 focus:ring-zinc-700"
                    />
                    <span className="text-sm text-zinc-200">Changes UX / flow</span>
                  </label>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  Checking 2+ items will auto-adjust classification to medium or large.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            {!classification ? (
              <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="text-lg font-semibold">Classify the change to get started</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Choose a classification and check impact boxes to generate a response.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="text-base font-semibold">Response</h3>
                <p className="mt-1 text-sm text-zinc-400">A professional reply you can copy, edit, and send.</p>
                <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-200 whitespace-pre-line">
                  {response}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleCopyReply}
                    className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm text-zinc-100 transition hover:bg-zinc-800"
                  >
                    {copied ? "Copied!" : "Copy reply"}
                  </button>
                  <button
                    onClick={handleRegenerate}
                    className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm text-zinc-100 transition hover:bg-zinc-800"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-300">How this works</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Stop → Classify → Decide → Respond. No AI needed. Just a simple framework to help you make better scope decisions.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
