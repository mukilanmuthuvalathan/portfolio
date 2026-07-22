"use client";
import type { MouseEvent } from "react";
const models = [
  { id: "agent", index: "01", title: "Agent Core", text: "Autonomous reasoning and tool orchestration.", type: "orb" },
  { id: "rag", index: "02", title: "RAG Engine", text: "Knowledge retrieval grounded in your data.", type: "cube" },
  { id: "vision", index: "03", title: "Multimodal Lens", text: "Language, vision, and audio in one system.", type: "prism" },
] as const;
export function AIModelLab() {
  function tilt(event: MouseEvent<HTMLElement>) { const card=event.currentTarget; const b=card.getBoundingClientRect(); const x=(event.clientX-b.left)/b.width-.5; const y=(event.clientY-b.top)/b.height-.5; card.style.setProperty("--rx",`${-y*12}deg`); card.style.setProperty("--ry",`${x*14}deg`); card.style.setProperty("--mx",`${(x+.5)*100}%`); card.style.setProperty("--my",`${(y+.5)*100}%`); }
  function reset(event: MouseEvent<HTMLElement>) { event.currentTarget.style.setProperty("--rx","0deg"); event.currentTarget.style.setProperty("--ry","0deg"); }
  return <div className="modelLab">{models.map(model=><article className="modelCard" key={model.id} onMouseMove={tilt} onMouseLeave={reset}><div className="modelScene" aria-hidden="true"><div className={`modelObject ${model.type}`}>{model.type==="orb"&&<><i/><i/><i/><b/><b/><b/></>}{model.type==="cube"&&<><span className="face front"/><span className="face back"/><span className="face right"/><span className="face left"/><span className="face top"/><span className="face bottom"/></>}{model.type==="prism"&&<><span/><span/><span/><i/><i/></>}</div><div className="modelShadow"/></div><div className="modelMeta"><span>{model.index}</span><p>Interactive model</p></div><h3>{model.title}</h3><p>{model.text}</p></article>)}</div>;
}
