import { PROMPT } from '../data/experiments.js'

export default function ExecutionGuide({ prog }) {
  const P = PROMPT.replace('>', '\\Java-Experiments>')
  const Line = ({ children }) => <p><span className="text-[#c0c0c0]">{P}</span> {children}</p>
  return (
    <div>
      <p className="text-neutral-500">[EXECUTION]</p>
      {prog.lang === 'java' && (
        <>
          <p className="text-neutral-400">1. Requires JDK 8 or later (check with: java -version).</p>
          <p className="text-neutral-400">2. Save the program as {prog.file} (file name must match the public class name).</p>
          <p className="text-neutral-400">3. Compile, then run:</p>
          <br />
          <Line>javac {prog.file}</Line>
          <p className="text-green-600">[SUCCESS] Compilation completed.</p>
          <Line>java {prog.cls}</Line>
        </>
      )}
      {prog.lang === 'html' && (
        <>
          <p className="text-neutral-400">1. Save the program as {prog.file}.</p>
          <p className="text-neutral-400">2. Open it in any web browser (no compiler needed).</p>
          <br />
          <Line>start {prog.file}</Line>
        </>
      )}
      {prog.lang === 'text' && <p className="text-neutral-400">Run the commands above in an Administrator Command Prompt.</p>}
      <br />
      <p className="text-neutral-500">[OUTPUT]</p>
      {prog.output ? <pre className="whitespace-pre-wrap">{prog.output}</pre> : <p className="text-neutral-500">No fixed output: {prog.note}</p>}
    </div>
  )
}
