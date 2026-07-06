import { useState } from 'react'
import ServiceAccordion from './ServiceAccordion'
import ServiceSticky from './ServiceSticky'
import ServiceBento from './ServiceBento'
import ServiceTabs from './ServiceTabs'
import ServiceSpotlight from './ServiceSpotlight'

/* Lets us flip the Services section between every interactive layout on one
   page — the compare-live toggle. */
const VARIANTS = [
  { id: 'accordion', label: 'Accordion', C: ServiceAccordion },
  { id: 'sticky', label: 'Scroll Story', C: ServiceSticky },
  { id: 'bento', label: 'Bento', C: ServiceBento },
  { id: 'tabs', label: 'Tabs', C: ServiceTabs },
  { id: 'spotlight', label: 'Spotlight', C: ServiceSpotlight },
]

export default function ServicesShowcase() {
  const [v, setV] = useState('accordion')
  const Active = (VARIANTS.find((x) => x.id === v) || VARIANTS[0]).C

  return (
    <>
      <div className="svcswitch" role="radiogroup" aria-label="Services layout">
        <span className="svcswitch__cap">Services layout</span>
        <div className="svcswitch__seg">
          {VARIANTS.map((x) => (
            <button
              key={x.id}
              role="radio"
              aria-checked={v === x.id}
              className={`svcswitch__btn${v === x.id ? ' is-active' : ''}`}
              onClick={() => setV(x.id)}
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>
      <Active />
    </>
  )
}
