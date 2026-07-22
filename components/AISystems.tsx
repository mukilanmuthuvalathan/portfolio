"use client";
import type { MouseEvent } from "react";
const systems=[
 {name:"LLM",kind:"llm",note:"Language intelligence"},{name:"Multimodal AI",kind:"multi",note:"Vision · audio · text"},{name:"RAG",kind:"rag",note:"Grounded knowledge"},{name:"AI Agents",kind:"agent",note:"Reason · act · observe"},{name:"Prompt Lab",kind:"prompt",note:"Structured instructions"},{name:"Fine-Tuning",kind:"finetune",note:"Adapted model behavior"}
];
export function AISystems(){
 function move(e:MouseEvent<HTMLElement>){const el=e.currentTarget,b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;el.style.setProperty("--x",`${x*12}deg`);el.style.setProperty("--y",`${-y*10}deg`)}
 function reset(e:MouseEvent<HTMLElement>){e.currentTarget.style.setProperty("--x","0deg");e.currentTarget.style.setProperty("--y","0deg")}
 return <section className="systems" aria-labelledby="systems-title"><div className="systemsHead"><p>01 / CAPABILITIES</p><h2 id="systems-title">Intelligence,<br/><em>made tangible.</em></h2><span>Hover to explore the systems behind my work.</span></div><div className="systemsGrid">{systems.map((s,i)=><article className="systemCard" key={s.name} onMouseMove={move} onMouseLeave={reset}><div className={`systemObject ${s.kind}`} aria-hidden="true">{s.kind==="llm"&&<><i/><i/><i/><b/></>}{s.kind==="multi"&&<><i/><i/><i/><b/><b/><b/></>}{s.kind==="rag"&&<><i/><i/><i/><i/></>}{s.kind==="agent"&&<><i/><i/><i/><b/></>}{s.kind==="prompt"&&<><i/><span>&gt;_</span></>}{s.kind==="finetune"&&<><i/><i/><i/><b/><b/><b/></>}</div><div className="systemLabel"><span>0{i+1}</span><div><h3>{s.name}</h3><p>{s.note}</p></div></div></article>)}</div></section>
}

