import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useTheme } from '../ThemeContext'
import Counter from './Counter'
import PixelHero from './PixelHero'
import VoxelHero from './VoxelHero'
import HimachalHero from './HimachalHero'
import PastelHero from './PastelHero'
import { HERO_STATS, TRUST_LOGOS, CASE_RESULTS } from '../data'

/* shared stagger for fade-up entrances */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}
const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
}

const SUB =
  'We build secure, scalable digital systems and AI products that move the metrics your business is actually measured on.'

/* ---------------------------------------------------------------- SIGNAL */
function HeroSignal() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <section id="top" className="hero hero--signal" ref={ref}>
      <div className="hero__grid" />
      <div className="hero__glow" />
      <motion.div
        className="container hero__inner"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="hero__lead">
          <motion.span variants={rise} className="kicker">
            Global Product &amp; AI Engineering
          </motion.span>
          <motion.h1 variants={rise} className="hero__title display">
            We engineer <span className="hero__accent">outcomes</span>, not just software.
          </motion.h1>
          <motion.p variants={rise} className="lead hero__sub">
            {SUB}
          </motion.p>
          <motion.div variants={rise} className="hero__ctas">
            <a href="#contact" className="btn btn-primary">
              Consult our strategy team <span className="arrow">→</span>
            </a>
            <a href="#work" className="btn btn-ghost">
              See client results
            </a>
          </motion.div>
        </div>

        <motion.div className="hero__proof" style={{ y: cardsY }} variants={rise}>
          {CASE_RESULTS.map((c, i) => (
            <motion.div
              key={c.client}
              className="rescard"
              animate={{ y: [0, i % 2 ? 8 : -8, 0] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="rescard__top">
                <span className="rescard__client">{c.client}</span>
                <span className="dot" />
              </div>
              <div className="rescard__result figure">{c.result}</div>
              <div className="rescard__detail">{c.detail}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

/* --------------------------------------------------------------- KINETIC */
function HeroKinetic() {
  const words = ['Engineering', 'outcomes', 'at', 'enterprise', 'scale.']
  const accentWord = 'outcomes'
  return (
    <section id="top" className="hero hero--kinetic">
      <div className="hero__aurora" />
      <div className="container hero__inner">
        <motion.span
          className="kicker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          Global Product &amp; AI Engineering
        </motion.span>

        <h1 className="hero__title display" aria-label={words.join(' ')}>
          {words.map((w, i) => (
            <span className="hero__word" key={i}>
              <motion.span
                className={w === accentWord ? 'hero__accent' : ''}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.11, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="lead hero__sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {SUB}
        </motion.p>

        <motion.div
          className="hero__ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8 }}
        >
          <a href="#contact" className="btn btn-primary">
            Start your build <span className="arrow">→</span>
          </a>
          <a href="#work" className="btn btn-ghost">
            See client results
          </a>
        </motion.div>
      </div>

      <div className="hero__marquee" aria-hidden="true">
        <div className="hero__marquee-track">
          {[...TRUST_LOGOS, ...TRUST_LOGOS].map((n, i) => (
            <span key={i} className="hero__marquee-item">
              {n}<span className="hero__marquee-sep">✳</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- BLUEPRINT */
function HeroBlueprint() {
  return (
    <section id="top" className="hero hero--blueprint">
      <div className="hero__rules" />
      <div className="container hero__inner">
        <motion.div
          className="hero__topline"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="hero__index">
          <span>01 / Hero</span>
          <span>Appinventiv — Global Product Engineering</span>
        </div>

        <div className="hero__cols">
          <motion.div
            className="hero__title-col"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.span variants={rise} className="kicker">
              Proof, not promises
            </motion.span>
            <motion.h1 variants={rise} className="hero__title display">
              Engineering
              <br />
              outcomes,
              <br />
              <span className="hero__accent">by design.</span>
            </motion.h1>
            <motion.p variants={rise} className="lead hero__sub">
              {SUB}
            </motion.p>
            <motion.div variants={rise} className="hero__ctas">
              <a href="#contact" className="btn btn-primary">
                Consult our team <span className="arrow">→</span>
              </a>
              <a href="#work" className="btn btn-ghost">
                See client results
              </a>
            </motion.div>
          </motion.div>

          <div className="hero__num-col">
            {CASE_RESULTS.map((c, i) => (
              <motion.div
                key={c.client}
                className="numrow"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="numrow__idx">0{i + 1}</span>
                <span className="numrow__val figure">{c.result}</span>
                <span className="numrow__client">{c.client}</span>
                <span className="numrow__detail">{c.detail}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Hero() {
  const { theme } = useTheme()
  if (theme === 'pastel') return <PastelHero />
  if (theme === 'himachal') return <HimachalHero />
  if (theme === 'pixel') return <PixelHero />
  if (theme === 'voxel') return <VoxelHero />
  if (theme === 'kinetic') return <HeroKinetic />
  if (theme === 'blueprint') return <HeroBlueprint />
  return <HeroSignal />
}

/* --------------------------------------------------- SHARED PROOF STRIP */
export function ProofStrip() {
  return (
    <section className="proofstrip">
      <div className="container">
        <div className="proofstrip__stats">
          {HERO_STATS.map((s) => (
            <div className="proofstrip__stat" key={s.label}>
              <div className="proofstrip__val">
                <Counter value={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} />
              </div>
              <div className="proofstrip__label">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="proofstrip__trust">
          <span className="proofstrip__trust-cap">Trusted by category leaders</span>
          <div className="proofstrip__logos">
            {TRUST_LOGOS.map((n) => (
              <span key={n} className="proofstrip__logo">{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
