import { useState } from 'react'
import './App.css'

const scripts = [
  {
    id: 1,
    situation: '"Can you just add one more thing?"',
    tag: 'The classic',
    reply: `Happy to look at that. Let me check how it fits the current scope and get back to you shortly.`,
    why: 'Buys you time. Doesn\'t say yes. Doesn\'t say no. Forces you to actually think before you commit.',
  },
  {
    id: 2,
    situation: '"This shouldn\'t take long, right?"',
    tag: 'The minimizer',
    reply: `Depends on what\'s involved — let me take a quick look and I\'ll send you an estimate before I start.`,
    why: 'Clients say "shouldn\'t take long" when they have no idea how long it takes. This moves the conversation to numbers.',
  },
  {
    id: 3,
    situation: '"While you\'re at it, can you also…"',
    tag: 'The add-on',
    reply: `That\'s a separate piece of work from what we agreed on. I can add it to the project — I\'ll send you a quick note on what it involves and the cost before we proceed.`,
    why: '"While you\'re at it" is how scope doubles. Treat it as a new request every time, even if it feels small.',
  },
  {
    id: 4,
    situation: '"My partner / boss / colleague had some feedback…"',
    tag: 'The late stakeholder',
    reply: `Happy to hear it. Just to keep things on track — if the feedback changes what we agreed to deliver, I\'ll flag it as a scope change with an updated timeline and cost. Does that work?`,
    why: 'New people arriving mid-project is one of the most common sources of scope creep. Set the expectation immediately.',
  },
  {
    id: 5,
    situation: '"Can we do one more round of revisions?"',
    tag: 'The extra round',
    reply: `We\'ve used the revision rounds included in our agreement. I\'m happy to do another round — it\'ll be $[X] and I can get it back to you by [date]. Want me to go ahead?`,
    why: 'Never do extra revision rounds silently. Name the cost every time, even if you\'d consider doing it for free. It trains the client.',
  },
  {
    id: 6,
    situation: '"It\'s basically done, right? Just a few small things."',
    tag: 'The finish line move',
    reply: `Almost there. Let me look at the list — some of these might be covered, others might need a quick change order. I\'ll get back to you today with what\'s what.`,
    why: '"Just a few small things" at the end of a project is where most unpaid hours hide. Don\'t agree until you\'ve seen the list.',
  },
  {
    id: 7,
    situation: 'Client goes silent, then comes back weeks later with changes.',
    tag: 'The delay creep',
    reply: `Good to hear from you. Just a heads up — we\'re outside the original project window now, so I\'ll need to revisit the timeline and scope before we pick up. I\'ll send you a quick summary of where things stand.`,
    why: 'Silence followed by changes is a scope reset in disguise. Treat every re-engagement as a new conversation.',
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button className="copy-script-btn" onClick={handleCopy}>
      {copied ? '✓ Copied' : 'Copy'}
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
          <h1 className="scripts-title">The exact replies.</h1>
          <p className="scripts-sub">
            Seven situations. Seven responses. Copy and send.
            No explaining yourself. No awkward pauses.
          </p>
        </div>

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

              <p className="script-why">{s.why}</p>
            </div>
          ))}
        </div>

        <div className="scripts-footer">
          <p>These scripts won't save you if you don't use them.<br />
          <em>The hard part isn't knowing what to say. It's saying it.</em></p>
          <button className="btn-ghost" onClick={onBack}>
            ← Back to calculator
          </button>
        </div>

      </div>
    </div>
  )
}