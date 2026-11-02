import { experiments } from '../data/experiments.js'

export default function Sidebar({ open, sel, onSelect, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-10 bg-black/50 sm:hidden" onClick={onClose} />}
      <nav aria-label="Experiments"
        className={`fixed left-0 top-0 z-20 h-full w-64 overflow-y-auto border-r border-neutral-800 bg-black pt-10 text-xs transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <p className="px-3 pb-2 text-neutral-500">JAVA EXPERIMENTS</p>
        {experiments.map((x, i) => (
          <button key={x.no} onClick={() => onSelect(i)}
            className={`block w-full px-3 py-1 text-left hover:bg-neutral-900 ${sel === i ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}>
            {x.no}. {x.title}
          </button>
        ))}
      </nav>
    </>
  )
}
