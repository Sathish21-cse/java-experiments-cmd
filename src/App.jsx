import { useCallback, useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import ExperimentContent from './components/ExperimentContent.jsx'
import { experiments, PROMPT } from './data/experiments.js'

export default function App() {
  const [sel, setSel] = useState(null)
  const [open, setOpen] = useState(false)
  const go = useCallback((i) => { setSel(i); setOpen(false) }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'm' || e.key === 'M') setOpen((o) => !o)
      else if (e.key === 'Escape') setOpen(false)
      else if (e.key === 'ArrowRight' || e.key === 'n') setSel((s) => (s === null ? 0 : Math.min(s + 1, experiments.length - 1)))
      else if (e.key === 'ArrowLeft' || e.key === 'p') setSel((s) => (s === null || s === 0 ? s : s - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-[#d4d4d4] leading-relaxed">
      <button aria-label="Toggle experiment list" onClick={() => setOpen((o) => !o)}
        className="fixed left-2 top-2 z-30 p-1 text-neutral-600 hover:text-neutral-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-neutral-500">
        <Menu size={18} strokeWidth={1.5} />
      </button>
      <Sidebar open={open} sel={sel} onSelect={go} onClose={() => setOpen(false)} />
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-6">
        <p>Microsoft Windows [Version 10.0.22631.4602]</p>
        <p>(c) Microsoft Corporation. All rights reserved.</p>
        <br />
        <p><span className="text-[#c0c0c0]">{PROMPT}</span> java-experiments</p>
        <br />
        <p>Initializing Java Experiment Environment...</p>
        <p>Loading {experiments.length} experiments...</p>
        <p className="text-green-600">[OK] Terminal initialized successfully.</p>
        <br />
        {sel === null ? (
          <>
            <p><span className="text-[#c0c0c0]">{PROMPT}</span> dir experiments</p>
            <br />
            {experiments.map((x, i) => (
              <button key={x.no} onClick={() => go(i)} className="block text-left text-neutral-300 hover:bg-neutral-800">
                {x.no}  {x.title}
              </button>
            ))}
            <br />
            <p className="text-neutral-500">Click an experiment, or press M for the menu, N / P for next / previous.</p>
            <p><span className="text-[#c0c0c0]">{PROMPT}</span><span className="cursor ml-1" /></p>
          </>
        ) : (
          <ExperimentContent exp={experiments[sel]} index={sel} total={experiments.length} onGo={go} />
        )}
      </main>
    </div>
  )
}
