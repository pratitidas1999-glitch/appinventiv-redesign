import { useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import { ThemeProvider } from './ThemeContext'
import Nav from './components/Nav'
import Hero from './components/Hero'
import AwardsShowcase from './components/AwardsShowcase'
import Sections from './components/Sections'
import './App.css'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <ThemeProvider>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <AwardsShowcase />
        <Sections />
      </main>
    </ThemeProvider>
  )
}
