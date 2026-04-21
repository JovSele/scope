import { useState, useEffect, useRef } from 'react'
import './App.css'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div className={`toast ${show ? 'show' : ''}`}>{message}</div>
  )
}

function InsightBlock({ tag, children }: { tag: string; children: React.ReactNode }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className={`insight-block ${visible ? 'visible' : ''}`}>
      <p className="tag">{tag}</p>
      {children}
    </div>
  )
}

export default function App() {
  const [rate, setRate] = useState(100)
  const [quoted, setQuoted] = useState(20)
  const [actual, setActual] = useState(43)
  const [toast, setToast] = useState({ show: false, message: '' })

  const charged = rate * quoted
  const realRate = actual > 0 ? charged / actual : 0
  const lost = rate * Math.max(0, actual - quoted)
  const extraHrs = Math.max(0, actual - quoted)
  const drop = rate > 0 ? Math.round((1 - realRate / rate) * 100) : 0
  const yearly = lost * 8
  const isHappy = actual <= quoted

  function showToast(message: string) {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: '' }), 2800)
  }

  function copyResult() {
    const text = isHappy
      ? `I just ran the numbers on a recent project.\n\nI quoted ${quoted}h at $${Math.round(rate)}/hr and actually worked ${actual}h.\n\nReal rate: $${Math.round(realRate)}/hr — stayed on scope.\n\nCalculate yours: realrate.fyi`
      : `I just ran the numbers on a recent project.\n\nI quoted ${quoted}h at $${Math.round(rate)}/hr → charged $${Math.round(charged).toLocaleString()}\nI actually worked ${actual}h → real rate: $${Math.round(realRate)}/hr\n\nScope creep cost me $${Math.round(lost).toLocaleString()} — a ${drop}% pay cut I never agreed to.\n\nCalculate yours: realrate.fyi`
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard'))
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <p className="eyebrow">Reality check for freelancers</p>
        <h1>What did that project<br /><em>actually</em> pay you?</h1>
        <p className="hero-sub">
          You quoted $100/hr. You said yes to a few small requests. You never recalculated. This tool does it for you.
        </p>
        <p className="scroll-hint">See how much you undercharged <span>↓</span></p>
      </section>

      <hr className="divider" />

      {/* CALCULATOR */}
      <section className="calc-section">
        <div className="calc-inner">
          <p className="section-label">01</p>
          <h2 className="calc-title">Run your last project</h2>

          <div className="inputs-grid">
            <div className="input-group">
              <label>Your hourly rate</label>
              <div className="input-row">
                <span className="prefix">$</span>
                <input
                  type="number"
                  value={rate}
                  min={1}
                  max={999}
                  onChange={e => setRate(parseFloat(e.target.value) || 0)}
                />
                <span className="prefix suffix">/hr</span>
              </div>
            </div>

            <div className="input-group">
              <label>Hours quoted</label>
              <div className="input-row col">
                <div className="slider-row">
                  <input
                    type="range"
                    min={2}
                    max={200}
                    step={1}
                    value={quoted}
                    onChange={e => setQuoted(parseInt(e.target.value))}
                  />
                  <span className="slider-val">{quoted}h</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>Hours actually worked</label>
              <div className="input-row col">
                <div className="slider-row">
                  <input
                    type="range"
                    min={2}
                    max={200}
                    step={1}
                    value={actual}
                    onChange={e => setActual(parseInt(e.target.value))}
                  />
                  <span className="slider-val">{actual}h</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`result-block ${isHappy ? 'happy' : ''}`}>
            <div className="result-top">
              <div className="result-cell full">
                <div className="cell-label">you thought you made</div>
                <div className="cell-val">${Math.round(rate)}/hr</div>
              </div>
            </div>

            <div className="result-main">
              <div className="main-label">you actually made</div>
              <div className="real-rate-num">${Math.round(realRate)}/hr</div>
              <div className="real-rate-sub">
                {isHappy
                  ? 'you stayed on scope — well done'
                  : `a ${drop}% pay cut you never agreed to`}
              </div>
            </div>

            {!isHappy && (
              <div className="punch-line">
                You didn't notice this happening.<br />
                <em>That's the problem.</em>
              </div>
            )}

            <div className="result-bottom">
              <div className="lost-cell">
                <div className="cell-label">unpaid work</div>
                <div className="lost-num">
                  {isHappy ? '$0' : `$${Math.round(lost).toLocaleString()}`}
                </div>
                <div className="lost-sub">
                  {isHappy ? 'no scope creep here' : `${extraHrs} hrs you'll never get back`}
                </div>
              </div>
              <div className="yearly-cell">
                <div className="cell-label">if this keeps happening</div>
                <div className="yearly-num">
                  {isHappy ? '$0' : `$${Math.round(yearly).toLocaleString()}`}
                </div>
                <div className="lost-sub">it adds up fast</div>
              </div>
            </div>
          </div>

          <button className="share-btn" onClick={copyResult}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 1H11V4M11 1L5 7M5 3H1V11H9V7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Copy result
          </button>
        </div>
      </section>

      <hr className="divider" />

      {/* INSIGHTS */}
      <section className="insight-section">

        <InsightBlock tag="02">
          <h2>You didn't notice it happening.</h2>
          <p>You lost it slowly. One extra section. One more revision. One "quick fix" that wasn't quick. None of them felt like a decision. All of them were.</p>
          <div className="requests-list">
            {[
              '"Can you just tweak the headline?"',
              '"While you\'re at it, can we add a blog section?"',
              '"One more round of revisions, shouldn\'t take long."',
              '"My partner had some feedback…"',
              '"It\'s basically done, right? Just a few small things."',
            ].map((req, i) => (
              <div className="req" key={i}>
                <span className="dot" />
                {req}
              </div>
            ))}
          </div>
        </InsightBlock>

        <InsightBlock tag="03">
          <h2>The problem isn't scope creep.</h2>
          <p>It's that you said yes before you knew what you were agreeing to. The request wasn't the problem. Your instinct to reply immediately was. Every "sure, no problem" without thinking costs you money you never see leaving.</p>
        </InsightBlock>

        <InsightBlock tag="04">
          <h2>Before you say yes again.</h2>
          <p>Not a contract. Not a tool. A habit. The only system that works is the one you'll actually use — when the Slack message arrives and you have 30 seconds to decide.</p>
          <div className="steps">
            {[
              {
                num: '01',
                title: "Don't reply immediately",
                body: "Wait 15 minutes. 90% of \"urgent\" requests can wait. Your first instinct is almost always to say yes.",
              },
              {
                num: '02',
                title: 'Classify the request',
                body: 'Small (under 30 min) → include. Medium (30 min–2 hrs) → flag. Large (2+ hrs) → formal change request with cost.',
              },
              {
                num: '03',
                title: 'Make the tradeoff visible',
                body: '"I can add that — it\'ll add $X and push delivery by Y days. Want me to proceed?" Most clients say no. The ones who say yes will pay.',
              },
            ].map(step => (
              <div className="step" key={step.num}>
                <span className="step-num">{step.num}</span>
                <div className="step-text">
                  <strong>{step.title}</strong>
                  {step.body}
                </div>
              </div>
            ))}
          </div>
        </InsightBlock>

      </section>

      <hr className="divider" />

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Want the exact replies?</h2>
          <p>Copy what to say when a client asks for "just one more thing."</p>
          <div className="cta-options">
            <button className="btn-primary" onClick={() => showToast('Scripts coming soon — check back shortly')}>
              Copy the exact replies to use →
            </button>
            <button className="btn-ghost" onClick={copyResult}>
              Share your result
            </button>
          </div>
          <p className="cta-note">No signup. No email. Just the scripts.</p>
        </div>
      </section>

      <footer>
        Built for freelancers who are tired of finding out too late.
      </footer>

      <Toast message={toast.message} show={toast.show} />
    </>
  )
}