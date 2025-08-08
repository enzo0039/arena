import { useFrame, useRect } from '@darkroom.engineering/hamo'
import cn from 'clsx'

import { Button } from 'components/button'
import { Card } from 'components/card'
import { Title } from 'components/intro'
import { Link } from 'components/link'
import { ListItem } from 'components/list-item'
import { projects } from 'content/projects'
import { projectsGsap } from 'content/projectsGsap'
import CardGsap from 'components/gsap-cards/CardGsap'
import { useScroll } from 'hooks/use-scroll'
import { Layout } from 'layouts/default'
// import { button, useControls } from 'leva'
import { clamp, mapRange } from 'lib/maths'
import { useStore } from 'lib/store'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useIntersection, useWindowSize } from 'react-use'
import s from './home.module.scss'
import { Modal } from 'components/modal'

// const SFDR = dynamic(() => import('icons/sfdr.svg'), { ssr: false })
const GitHub = dynamic(() => import('icons/github.svg'), { ssr: false })
const Sponsor = dynamic(() => import('icons/sponsor.svg'), { ssr: false })

const Parallax = dynamic(
  () => import('components/parallax').then((mod) => mod.Parallax),
  { ssr: false }
)

const AppearTitle = dynamic(
  () => import('components/appear-title').then((mod) => mod.AppearTitle),
  { ssr: false }
)

const HorizontalSlides = dynamic(
  () =>
    import('components/horizontal-slides').then((mod) => mod.HorizontalSlides),
  { ssr: false }
)

const FeatureCards = dynamic(
  () => import('components/feature-cards').then((mod) => mod.FeatureCards),
  { ssr: false }
)

const WebGL = dynamic(
  () => import('components/webgl').then(({ WebGL }) => WebGL),
  { ssr: false }
)

const MobileHeroWebGL = dynamic(
  () => import('components/webgl/mobile-hero').then(({ MobileHeroWebGL }) => MobileHeroWebGL),
  { ssr: false }
)

const HeroMobileWebGLWrapper = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 800);
    };
    
    // Vérifie initialement
    checkIfMobile();
    
    // Ajoute un écouteur d'événement pour les changements de taille
    window.addEventListener('resize', checkIfMobile);
    
    // Nettoie l'écouteur d'événement
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  if (!isMobile) return null;
  
  return <MobileHeroWebGL render={true} />;
};

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
}

export default function Home() {
  const [hasScrolled, setHasScrolled] = useState()
  const zoomRef = useRef(null)
  const [zoomWrapperRectRef, zoomWrapperRect] = useRect()
  const { height: windowHeight } = useWindowSize()
  const introOut = useStore(({ introOut }) => introOut)

  const [theme, setTheme] = useState('dark')
  const lenis = useStore(({ lenis }) => lenis)

  // useControls(
  //   'lenis',
  //   () => ({
  //     stop: button(() => {
  //       lenis.stop()
  //     }),
  //     start: button(() => {
  //       lenis.start()
  //     }),
  //   }),
  //   [lenis]
  // )

  // useControls(
  //   'scrollTo',
  //   () => ({
  //     immediate: button(() => {
  //       lenis.scrollTo(30000, { immediate: true })
  //     }),
  //     smoothDuration: button(() => {
  //       lenis.scrollTo(30000, { lock: true, duration: 10 })
  //     }),
  //     smooth: button(() => {
  //       lenis.scrollTo(30000)
  //     }),
  //     forceScrollTo: button(() => {
  //       lenis.scrollTo(30000, { force: true })
  //     }),
  //   }),
  //   [lenis]
  // )

  useEffect(() => {
    if (!lenis) return

    function onClassNameChange(lenis) {
  // console.log(lenis.className)
    }

    lenis.on('className change', onClassNameChange)

    return () => {
      lenis.off('className change', onClassNameChange)
    }
  }, [lenis])

  useScroll(({ scroll }) => {
    setHasScrolled(scroll > 10)
    if (!zoomWrapperRect.top) return

    const start = zoomWrapperRect.top + windowHeight * 0.5
    const end = zoomWrapperRect.top + zoomWrapperRect.height - windowHeight

    const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1)
    const center = 0.6
    const progress1 = clamp(0, mapRange(0, center, progress, 0, 1), 1)
    const progress2 = clamp(0, mapRange(center - 0.055, 1, progress, 0, 1), 1)
    setTheme(progress2 === 1 ? 'light' : 'dark')

    zoomRef.current.style.setProperty('--progress1', progress1)
    zoomRef.current.style.setProperty('--progress2', progress2)

    if (progress === 1) {
      zoomRef.current.style.setProperty('background-color', 'currentColor')
    } else {
      zoomRef.current.style.removeProperty('background-color')
    }
  })

  const [whyRectRef, whyRect] = useRect()
  const [cardsRectRef, cardsRect] = useRect()
  const [whiteRectRef, whiteRect] = useRect()
  const [featuresRectRef, featuresRect] = useRect()
  const [inuseRectRef, inuseRect] = useRect()

  const addThreshold = useStore(({ addThreshold }) => addThreshold)

  useEffect(() => {
    addThreshold({ id: 'top', value: 0 })
  }, [])

  useEffect(() => {
    const top = whyRect.top - windowHeight / 2
    addThreshold({ id: 'why-start', value: top })
    addThreshold({
      id: 'why-end',
      value: top + whyRect.height,
    })
  }, [whyRect])

  useEffect(() => {
    const top = cardsRect.top - windowHeight / 2
    addThreshold({ id: 'cards-start', value: top })
    addThreshold({ id: 'cards-end', value: top + cardsRect.height })
    addThreshold({
      id: 'red-end',
      value: top + cardsRect.height + windowHeight,
    })
  }, [cardsRect])

  useEffect(() => {
    const top = whiteRect.top - windowHeight
    addThreshold({ id: 'light-start', value: top })
  }, [whiteRect])

  useEffect(() => {
    const top = featuresRect.top
    addThreshold({ id: 'features', value: top })
  }, [featuresRect])

  useEffect(() => {
    const top = inuseRect.top
    addThreshold({ id: 'in-use', value: top })
  }, [inuseRect])

  useEffect(() => {
    const top = lenis?.limit
    addThreshold({ id: 'end', value: top })
  }, [lenis?.limit])

  useScroll((e) => {
  // console.log(window.scrollY, e.scroll, e.isScrolling, e.velocity, e.isLocked)
  })

  // useFrame(() => {
  //   console.log('frame', window.scrollY, lenis?.scroll, lenis?.isScrolling)
  // }, 1)

  const inUseRef = useRef()

  const [visible, setIsVisible] = useState(false)
  const intersection = useIntersection(inUseRef, {
    threshold: 0.2,
  })
  useEffect(() => {
    if (intersection?.isIntersecting) {
      setIsVisible(true)
    }
  }, [intersection])

  return (
    <Layout
      theme={theme}
      seo={{
        title: 'Lenis – Get smooth or die trying',
        description:
          'A smooth scroll library fresh out of the darkroom.engineering.',
      }}
      className={s.home}
    >
      <div className={s.canvas}>
        <WebGL />
      </div>

      <Modal />

  <section className={s.hero}>
        <div className="layout-grid-inner">
          <Title className={s.title} />
          {/* <SFDR className={cn(s.icon, introOut && s.show)} /> */}
          <span className={cn(s.sub)}>
            <HeroTextIn introOut={introOut}>
              <h2 className={cn('h3', s.subtitle)}>ARENA 17</h2>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <h2 className={cn('p-xs', s.tm)}>
                <span>©</span> {new Date().getFullYear()} FUTUR.EVENTS
              </h2>
            </HeroTextIn>
          </span>
        </div>

        <div className={s.heroMobileCanvas}>
          <HeroMobileWebGLWrapper />
        </div>

        <div className={cn(s.bottom, 'layout-grid')}>
          <div
            className={cn(
              'hide-on-mobile',
              s['scroll-hint'],
              hasScrolled && s.hide,
              introOut && s.show
            )}
          >
            <div className={s.text}>
              <HeroTextIn introOut={introOut}>
                <p>scroll</p>
              </HeroTextIn>
            </div>
          </div>
          
          <h1 className={cn(s.description, 'p-s')}>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">Made for the noise.</p>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">Born for ARENA 17.</p>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">FUTUR</p>
            </HeroTextIn>
          </h1>
          
          
          <div style={{ gridColumn: '-1', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              className={cn(s.cta, s.documentation, introOut && s.in)}
              arrow
              icon={<GitHub />}
              href="https://github.com/darkroomengineering/lenis/blob/main/README.md"
            >
              PRE-SAVE NOW
            </Button>
          </div>
        </div>
      </section>

      <section className={cn(s.gsapCardsSection, 'theme-light')}>
        <div className="layout-grid-inner">
          <h2 className={cn('h2')} style={{gridColumn: '3 / span 8', textAlign: 'center', marginBottom: '2rem'}}>LINE UP</h2>
          <div style={{gridColumn: '3 / span 8', width: '100%'}}>
            {projectsGsap.map((project, i) => (
              <CardGsap key={`gsap_${i}`} {...project} i={i} />
            ))}
          </div>
        </div>
      </section>

      <section className={s.why} data-lenis-scroll-snap-align="start">
        <div className="layout-grid">
          <h2 className={cn(s.sticky, 'h2')}>
            <AppearTitle>Pourquoi ARENA 17 ?</AppearTitle>
          </h2>
          <aside className={s.features} ref={whyRectRef}>
            <div className={s.feature}>
              <p className="p">
                Le 17 janvier 2026, on se retrouve à la GLAZ ARENA pour une nuit 100 % hard techno. Une seule scène, 4 500 personnes, et l’envie de vivre quelque chose de simple et fort : être ensemble, danser, et se souvenir.
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>
                GLAZ ARENA
              </h3>
              <p className="p">
              La GLAZ ARENA, c’est de l’espace, du confort, et une acoustique solide. On y installe notre mainstage et tout ce qu’il faut pour que la musique prenne toute la place.
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>
                Unir le public
              </h3>
              <p className="p">
              Peu importe d’où tu viens, qui tu es ou comment tu danses : ici, tout le monde est le bienvenu. ARENA 17 est un espace ouvert, LGBT+ friendly et respectueux. On veut que chacun puisse profiter de la musique en toute sécurité, entouré d’une foule qui partage les mêmes valeurs de bienveillance et de liberté.
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>
                Vivre la nuit ensemble
              </h3>
              <p className="p">
                On n’est pas là seulement pour écouter de la musique, mais pour partager un moment. Que tu viennes seul ou avec ta bande, tu trouveras toujours quelqu’un pour danser à tes côtés. Ici, on vit la nuit ensemble, du premier kick au dernier.
              </p>
            </div>
          </aside>
        </div>
      </section>
      <section className={s.rethink}>
        <div className={cn('layout-grid', s.pre)}>
          <div className={s.highlight} data-lenis-scroll-snap-align="start">
            <Parallax speed={-0.5}>
              <p className="h2">
                <AppearTitle>L’histoire de FUTUR</AppearTitle>
              </p>
            </Parallax>
          </div>
          <div className={s.comparison}>
            <Parallax speed={0.5}>
            <p className="p">
              <span className="contrast semi-bold">FUTUR</span> est né à Rennes avec une idée simple : créer des soirées qui marquent. 
              Depuis notre première date <span className="contrast semi-bold">FUTUR IS ALIVE</span> en juin 2024, 
              on investit des lieux emblématiques pour les transformer le temps d’une nuit. 
              Chaque événement a son identité, son ambiance et son line-up pensé avec soin. 
              De <span className="contrast semi-bold">ABSTRACT</span> à <span className="contrast semi-bold">ENDLESS </span> 
              en passant par <span className="contrast semi-bold">ETERNITY</span>, 
              on avance toujours avec le même objectif : rassembler autour de la musique électronique 
              et proposer quelque chose de différent.
            </p>
            </Parallax>
          </div>
        </div>
        <div className={s.cards} ref={cardsRectRef}>
          <HorizontalSlides>
            <Card
              className={s.card}
              number="01"
              text="GLAZ ARENA, 4 500 personnes, une acoustique à la hauteur."
            />
            <Card
              className={s.card}
              number="02"
              text="10 artistes, un mélange de grands noms et de découvertes."
            />
            <Card
              className={s.card}
              number="03"
              text="Pas de détour, une nuit 100 % kicks et énergie brute."
            />
            <Card
              className={s.card}
              number="04"
              text="Une safe place, LGBT+ friendly et respectueux."
            />
            <Card
              className={s.card}
              number="05"
              text="Visuels inspirés du cyberpunk, lumière et son pensés ensemble."
            />
          </HorizontalSlides>
        </div>
      </section>
      <section
        ref={(node) => {
          zoomWrapperRectRef(node)
          zoomRef.current = node
        }}
        className={s.solution}
      >
        <div className={s.inner}>
          <div className={s.zoom}>
            <h2 className={cn(s.first, 'h1 vh')}>
              so we dance <br />
              <span className="contrast">hard techno</span>
            </h2>
            <h2 className={cn(s.enter, 'h3 vh')}>
              Enter <br /> ARENA 17
            </h2>
            <h2 className={cn(s.second, 'h1 vh')}>as it should be</h2>
          </div>
        </div>
      </section>
      <section className={cn('theme-light', s.featuring)} ref={whiteRectRef}>
        <div className={s.inner}>
            <div className={cn('layout-block', s.intro)} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
              <div className={s['shotgun-card']}>
                <h2 className={"h2 " + s['shotgun-title']}>Billetterie</h2>
                <iframe src="https://shotgun.live/events/insolenss-x-futur-w-cera-khin?embedded=1&ui=" allow="payment" />
                <script src="https://shotgun.live/widget.js"></script>
              </div>
            </div>
        </div>
        <section ref={featuresRectRef}>
          <FeatureCards />
        </section>
      </section>
      <section
        ref={(node) => {
          inuseRectRef(node)
          inUseRef.current = node
        }}
        className={cn('theme-light', s['in-use'], visible && s.visible)}
      >
        
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      id: 'home',
    }, // will be passed to the page component as props
  }
}
