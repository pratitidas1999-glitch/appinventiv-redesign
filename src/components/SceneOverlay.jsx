import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
}
const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

/* Clean, modern UI chrome floating over the pixel/voxel world.
   The scene is the emotion; this layer stays strictly tech. */
export default function SceneOverlay() {
  return (
    <motion.div
      className="container scenehero__overlay"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.span variants={rise} className="kicker">
        Global Product &amp; AI Engineering
      </motion.span>
      <motion.h1 variants={rise} className="hero__title display">
        Calm is an
        <br />
        <span className="hero__accent">engineering</span> outcome.
      </motion.h1>
      <motion.p variants={rise} className="lead hero__sub">
        We build and run the systems behind the world&apos;s busiest brands —
        AI products and platforms that work so quietly, your mornings look
        like this.
      </motion.p>
      <motion.div variants={rise} className="hero__ctas">
        <a href="#contact" className="btn btn-primary">
          Start your build <span className="arrow">→</span>
        </a>
        <a href="#work" className="btn btn-ghost">
          See client results
        </a>
      </motion.div>
      <div className="scenehero__cue" aria-hidden="true">
        <span>scroll</span>
        <span className="scenehero__cue-arrow">▾</span>
      </div>
    </motion.div>
  )
}
