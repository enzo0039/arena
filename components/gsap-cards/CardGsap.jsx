
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
gsap.registerPlugin(ScrambleTextPlugin);
import styles from './gsap-cards.module.scss';
import Image from 'next/image';
import { Button } from '../button';

const CardGsap = ({title, description, descriptionMobile, src, link, color, i, overlay, counter, revealDate}) => {
  const [remaining, setRemaining] = useState('');
  useEffect(() => {
    if (overlay && revealDate) {
      const updateCountdown = () => {
        const now = new Date();
        const target = new Date(revealDate);
        const diff = target - now;
        if (diff <= 0) {
          setRemaining('Dévoilé !');
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          setRemaining(`Dévoilement dans ${days}j ${hours}h ${minutes}m`);
        }
      };
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000 * 60); // update every minute
      return () => clearInterval(interval);
    }
  }, [overlay, revealDate]);
  const titleRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    const cardEl = titleRef.current?.closest('.' + styles.cardContainer);
    let triggered = false;
    if (cardEl) {
      const observer = new window.IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !triggered) {
            triggered = true;
            if (titleRef.current) {
              gsap.to(titleRef.current, {
                duration: 2,
                scrambleText: { text: title, chars: "upperCase", revealDelay: 0.5, speed: 0.5 },
                ease: "power2.out"
              });
            }
            if (descRef.current) {
              gsap.to(descRef.current, {
                duration: 2.5,
                scrambleText: { text: description, chars: "lowerCase", revealDelay: 0.5, speed: 0.5 },
                ease: "power2.out"
              });
            }
            observer.disconnect();
          }
        });
      }, { threshold: 0.3 });
      observer.observe(cardEl);
      return () => observer.disconnect();
    }
  }, [title, description]);

  return (
    <div className={styles.cardContainer}>
  <div className={styles.card} style={{background: i % 2 === 0 ? '#111' : '#222', top: `calc(-5vh + ${i * 25}px)`, color: 'var(--white)', position: 'relative'}}>
        {overlay && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            borderRadius: '32px',
            flexDirection: 'column',
          }}>
            <span style={{
              color: 'var(--white)',
              fontSize: '2rem',
              fontWeight: 'bold',
              background: 'rgba(0,0,0,0.3)',
              padding: '1rem 2rem',
              borderRadius: '8px',
            }}>{remaining}</span>
          </div>
        )}
        <div className={styles.body}>
          <div className={styles.description}>
            <div style={{display: 'inline-block', background: 'var(--pink)', padding: '0.5rem 1.5rem', borderRadius: '2px', marginBottom: '1rem'}}>
              <h2 ref={titleRef} className={styles.title + ' h2'} style={{color: 'var(--white)', margin: 0, width: '100%', overflow: 'hidden', textAlign: 'left'}}>{title}</h2>
            </div>
            <p ref={descRef} className={'p'} style={{width: '100%', overflow: 'hidden', textAlign: 'left'}}>
              {(() => {
                const [isMobile, setIsMobile] = useState(false);
                useEffect(() => {
                  setIsMobile(window.innerWidth <= 900);
                }, []);
                return isMobile && descriptionMobile ? descriptionMobile : description;
              })()}
            </p>
            {!overlay && (
              <Button href={link} arrow style={{marginTop: '2rem'}}>
                See more
              </Button>
            )}
          </div>
          <div className={styles.imageContainer} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
            <div className={styles.inner} style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
              <Image
                fill
                src={`/images/${src}`}
                alt="image"
                style={{objectFit: 'cover', borderRadius: '12px'}} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardGsap;
