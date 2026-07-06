import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import ServiceHAccordion from './ServiceHAccordion'
import AiSection from './AiSection'
import CaseBooks from './CaseBooks'
import { AV_CASES } from '../data'
import { asset } from '../asset'

/* Homepage sections — copy is verbatim from appinventiv.com. */

const inView = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
}

/* Stats moved into the hero's cursor showreel (CursorShowreel.jsx).
   Services section is the hover-expanding ServiceAccordion. */

function Cases() {
  /* italicise the last word ("Appinventiv") to echo the hero's italic lede */
  const cut = AV_CASES.title.lastIndexOf(' ')
  const casesLead = AV_CASES.title.slice(0, cut + 1)
  const casesLede = AV_CASES.title.slice(cut + 1)
  return (
    <section id="work" className="section avcases">
      <div className="container">
        <motion.h2 className="avh2 display" {...inView}>
          {casesLead}<em className="avlede">{casesLede}</em>
        </motion.h2>
        <CaseBooks />
      </div>
    </section>
  )
}

/* Growth-roadmap CTA banner — the client video plays at 0.4x behind the copy,
   and a cursor-driven spotlight "reclaims" the growth story: moving the pointer
   across the card lifts the scrim locally to reveal the footage underneath. */
function GrowthRoadmap() {
  const cardRef = useRef(null)
  const vidRef = useRef(null)

  /* play the footage at 0.4x (cinematic slow) */
  useEffect(() => {
    const v = vidRef.current
    if (!v) return
    const slow = () => { v.playbackRate = 0.4 }
    slow()
    v.addEventListener('loadedmetadata', slow)
    return () => v.removeEventListener('loadedmetadata', slow)
  }, [])

  /* spotlight follows the cursor via CSS vars; eases home on leave */
  const move = (e) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
    el.style.setProperty('--lit', '1')
  }
  /* at rest the torch parks on the right (over the chart), never under the copy */
  const leave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.setProperty('--mx', '74%')
    el.style.setProperty('--my', '52%')
    el.style.setProperty('--lit', '0')
  }

  return (
    <section className="growth">
      <div
        className="growth__card"
        ref={cardRef}
        onPointerMove={move}
        onPointerLeave={leave}
      >
        <video
          ref={vidRef}
          className="growth__video"
          src={asset('/videos/growth-roadmap.mp4')}
          autoPlay muted loop playsInline
        />
        <div className="growth__scrim" aria-hidden="true" />
        <div className="container">
          <motion.div className="growth__inner" {...inView}>
            <span className="growth__eyebrow">The Growth Roadmap</span>
            <h2 className="growth__title">
              You've seen how we helped <b>Americana</b>, <b>Sonny's</b>, and <b>Adidas</b> reclaim their market edge.
            </h2>
            <p className="growth__body">
              From <mark className="growth__metric">90% faster reporting</mark> to{' '}
              <mark className="growth__metric">4&times; operational improvements</mark>, our
              engineering goes beyond code to deliver measurable ROI.
            </p>
            <a href="#contact" className="btn btn-primary growth__cta">
              <span>Consult our Experts for Growth Roadmap</span>
              <span className="arrow">&rarr;</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function Sections() {
  return (
    <>
      <ServiceHAccordion />
      <AiSection />
      <Cases />
      <GrowthRoadmap />
    </>
  )
}
