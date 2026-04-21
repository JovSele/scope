import { useState } from 'react'
import './App.css'

const scripts = [
  {
    id: 1,
    tag: 'The classic',
    situation: '"Can you just add one more thing?"',
    reply: `Let me check how this fits the current scope and I'll get back to you with the impact.`,
  },
  {
    id: 2,
    tag: 'The minimizer',
    situation: '"This shouldn\'t take long, right?"',
    reply: `Let me take a quick look and I'll send you the time and cost before I start.`,
  },
  {
    id: 3,
    tag: 'The add-on',
    situation: '"While you\'re at it, can you also…"',
    reply: `That's outside the current scope — I'll send a quick estimate and we can decide from there.`,
  },
  {
    id: 4,
    tag: 'The late stakeholder',
    situation: '"My partner / boss had some feedback…"',
    reply: `Happy to review it — if it changes the scope, I'll outline the timeline and cost before we proceed.`,
  },
  {
    id: 5,
    tag: 'The extra round',
    situation: '"Can we do one more round of revisions?"',
    reply: `We've used the included revisions — I can do another round for $X and deliver it by [date]. Want me to proceed?`,
  },
  {
    id: 6,
    tag: 'The finish line move',
    situation: '"It\'s basically done, just a few small things."',
    reply: `Let me review the list — I'll confirm what's included and what needs a change request.`,
  },
  {
    id: 7,
    tag: 'The delay creep',
    situation: 'Ghost → comeback → changes.',
    reply: `We're outside the original project window — I'll need to revisit scope and timeline before we continue.`,
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'result_shared_or_copied', {
          event_category: 'engagement'
        })
      }
    })
  }

  return (
    <button className="copy-script-btn" onClick={handleCopy}>
      {copied ? '✓ Copied. Send it as-is.' : 'Copy'}
    </button>
  )
}

export default function Scripts({ onBack }: { onBack: () => void }) {
  return (
    <div className="scripts-page">
      <div className="scripts-inner">

        <button className="back-btn" onClick={onBack}>
          ← Back to calculator
        </button>

        <div className="scripts-hero">
          <p className="eyebrow">What to say</p>
          <h1 className="scripts-title">Seven situations.<br />Seven responses.</h1>
          <p className="scripts-sub">
            Copy and send. No overthinking.
          </p>
        </div>

        <div className="scripts-reframe">
          You don't need better clients.<br />
          <em>You need better responses.</em>
        </div>

        <p className="scripts-hint">Use these before you reply. Not after.</p>

        <div className="scripts-list">
          {scripts.map((s) => (
            <div className="script-card" key={s.id}>
              <div className="script-header">
                <span className="script-tag">{s.tag}</span>
                <span className="script-num">{String(s.id).padStart(2, '0')}</span>
              </div>

              <p className="script-situation">{s.situation}</p>

              <div className="script-reply-block">
                <div className="script-reply-label">Say this:</div>
                <p className="script-reply">{s.reply}</p>
                <CopyButton text={s.reply} />
              </div>
            </div>
          ))}
        </div>

        <div className="scripts-footer">
          <p>The hard part isn't knowing what to say.<br />
          <em>It's saying it.</em></p>
          <button className="btn-ghost" onClick={onBack}>
            ← Back to calculator
          </button>
        </div>

      </div>
    </div>
  )
}