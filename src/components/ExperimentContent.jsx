import { useEffect, useRef, useState } from 'react'
import CodeBlock from './CodeBlock.jsx'
import ExecutionGuide from './ExecutionGuide.jsx'
import { PROMPT } from '../data/experiments.js'

export default function ExperimentContent({ exp, index, total, onGo }) {
  const [loading, setLoading] = useState(true)
  const [pi, setPi] = useState(0)
  const [copy, setCopy] = useState('idle')
  const timer = useRef(null)

  useEffect(() => {
    setLoading(true); setPi(0); setCopy('idle')
    window.scrollTo({ top: 0 })
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [exp.no])

  const prog = exp.programs[pi]
  const num = exp.no
  const slug = 'experiment-' + num

  async function doCopy() {
    clearTimeout(timer.current)
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(prog.code)
      else {
        const ta = document.createElement('textarea')
        ta.value = prog.code; ta.style.position = 'fixed'; ta.style.opacity = '0'
        document.body.appendChild(ta); ta.select()
        const ok = document.execCommand('copy'); document.body.removeChild(ta)
        if (!ok) throw new Error('copy failed')
      }
      setCopy('ok')
    } catch { setCopy('err') }
    timer.current = setTimeout(() => setCopy('idle'), 2500)
  }

  const P = PROMPT.replace('>', '\\Java-Experiments>')
  return (
    <div>
      <p><span className="text-[#c0c0c0]">{P}</span> select {slug}</p>
      <br />
      <p>Loading Experiment {num}...</p>
      {loading ? <p><span className="cursor" /></p> : (
        <div>
          <br />
          <p>[EXPERIMENT {num}]</p>
          <p>Title: {exp.title}</p>
          {exp.programs.length > 1 && (
            <p className="mt-2 text-neutral-500">Programs:{' '}
              {exp.programs.map((p, i) => (
                <button key={p.label} onClick={() => { setPi(i); setCopy('idle') }}
                  className={`mr-3 hover:text-white ${i === pi ? 'text-white underline' : ''}`}>[{p.label}] {p.name}</button>
              ))}
            </p>
          )}
          <br />
          <p>[QUESTION]</p>
          <p className="text-neutral-300">{prog.aim}</p>
          <p className="my-3 text-neutral-700">{'-'.repeat(50)}</p>
          <div className="flex items-center justify-between">
            <p>[SOURCE CODE] <span className="text-neutral-500">{prog.file}</span></p>
            <button onClick={doCopy} className="border border-neutral-700 px-2 text-xs text-neutral-400 hover:border-neutral-400 hover:text-white">
              {copy === 'ok' ? 'COPIED' : 'COPY'}
            </button>
          </div>
          <CodeBlock code={prog.code} lang={prog.lang} />
          {copy === 'ok' && <><p><span className="text-[#c0c0c0]">{PROMPT}</span> copy</p><p className="text-green-600">[SUCCESS] Source code copied to clipboard.</p></>}
          {copy === 'err' && <p className="text-red-500">[ERROR] Clipboard access denied. Select the code and press Ctrl+C.</p>}
          <p className="my-3 text-neutral-700">{'-'.repeat(50)}</p>
          {prog.fixes && <p className="mb-3 text-yellow-600">[FIXED] {prog.fixes}</p>}
          <ExecutionGuide prog={prog} />
          <p className="my-3 text-neutral-700">{'-'.repeat(50)}</p>
          <div className="flex justify-between text-neutral-400">
            <button disabled={index === 0} onClick={() => onGo(index - 1)} className="hover:text-white disabled:opacity-30">&lt; Previous</button>
            <button disabled={index === total - 1} onClick={() => onGo(index + 1)} className="hover:text-white disabled:opacity-30">Next &gt;</button>
          </div>
          <p className="mt-3"><span className="text-[#c0c0c0]">{PROMPT}</span><span className="cursor ml-1" /></p>
        </div>
      )}
    </div>
  )
}
