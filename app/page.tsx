import { BrainHologram } from "@/components/BrainHologram";
import { ParticleField } from "@/components/ParticleField";
import { AISystems } from "@/components/AISystems";

export default function Home() {
  return (
    <main>
      <section className="hero" id="home">
        <ParticleField />
        <header className="nav"><a href="#home" className="brand">MM<span>.</span></a><nav aria-label="Primary navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav><a href="#contact" className="navCta">Contact me</a></header>
        <div className="grid" aria-hidden="true" />
        <div className="heroCopy">
          <p className="eyebrow">Generative AI Developer</p>
          <h1>Mukilan<br/><span>Muthuvalathan.</span></h1>
          <p className="role">GenAI Developer</p>
          <p className="lead">Building AI-powered applications with language models, multimodal intelligence, retrieval systems, and autonomous agents.</p>
          <div className="actions"><a href="#work" className="primary">View projects <span>&#8599;</span></a><a href="#contact">Contact me <span>&#8594;</span></a></div>
          <ul className="tech"><li>LLMs</li><li>Multimodal AI</li><li>RAG</li><li>AI Agents</li></ul>
        </div>
        <BrainHologram />
        <a href="#work" className="scroll">Scroll to explore <span>&#8595;</span></a>
      </section>

      <AISystems />
      <section className="content" id="work"><p className="sectionNo">02 / SELECTED WORK</p><div className="workGrid"><article className="project lime"><p>AI PRODUCT</p><h2>Learnito AI</h2><span>AI study notes and practice questions from source material.</span><a href="https://learnitoai.vercel.app/" target="_blank" rel="noreferrer">Visit project &#8599;</a></article><article className="project violet"><p>LLM SYSTEMS</p><h2>Intelligence, connected.</h2><span>Retrieval, prompting, and agent workflows designed as reliable products.</span></article></div></section>
      <section className="content about" id="about"><p className="sectionNo">03 / ABOUT</p><h2>I build at the intersection of <em>AI, product,</em> and people.</h2><div className="aboutProfile"><div className="portraitFrame"><img src="/mukilan-profile.png" alt="Mukilan Muthuvalathan, GenAI Developer" width="1450" height="1086" /></div><p>I&apos;m Mukilan, a Generative AI developer exploring how intelligent systems can solve real problems and make knowledge easier to access.</p></div></section>
      <section className="contact" id="contact"><p>Have an AI idea or interesting problem?</p><a href="mailto:mukilanmuthuvalathan01@gmail.com">Let&apos;s build something intelligent. &#8599;</a><footer><span>&copy; 2026 Mukilan Muthuvalathan</span><div className="socialLinks"><a href="mailto:mukilanmuthuvalathan01@gmail.com">Email </a><a href="https://github.com/mukilanmuthuvalathan" target="_blank" rel="noreferrer">GitHub </a><a href="https://www.linkedin.com/in/mukilan-muthuvalathan/" target="_blank" rel="noreferrer">LinkedIn </a><a href="https://www.instagram.com/mukilan_46_08/" target="_blank" rel="noreferrer">Instagram </a></div></footer></section>
    </main>
  );
}










