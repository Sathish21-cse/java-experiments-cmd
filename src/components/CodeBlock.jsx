const KW = 'abstract|boolean|break|byte|case|catch|char|class|const|double|else|extends|final|finally|for|function|if|import|in|instanceof|int|long|new|null|package|private|public|return|static|String|super|this|throw|throws|try|var|let|void|while|true|false'
const RE = new RegExp('(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/.*|<!--[\\s\\S]*?-->)|("(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\')|\\b(' + KW + ')\\b|\\b(\\d+)\\b', 'g')

function highlight(code) {
  const out = []
  let last = 0, m
  RE.lastIndex = 0
  while ((m = RE.exec(code)) !== null) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const cls = m[1] ? 'tk-c' : m[2] ? 'tk-s' : m[3] ? 'tk-k' : 'tk-n'
    out.push(<span key={m.index} className={cls}>{m[0]}</span>)
    last = m.index + m[0].length
  }
  out.push(code.slice(last))
  return out
}

export default function CodeBlock({ code, lang }) {
  return (
    <pre className="overflow-x-auto border border-neutral-800 p-3 text-[13px] leading-snug">
      <code>{lang === 'text' ? code : highlight(code)}</code>
    </pre>
  )
}
