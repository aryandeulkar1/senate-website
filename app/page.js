"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import StaggeredMenu from '../components/StaggeredMenu';
import TextType from '../components/TextType';

// Lazy load PrismaticBurst - only load when needed
const PrismaticBurst = dynamic(() => import('../components/PrismaticBurst'), {
  ssr: false,
  loading: () => <div style={{ background: '#000', position: 'absolute', inset: 0 }} />
});

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '#home' },
  { label: 'Events', ariaLabel: 'View our events', link: '#events' },
  { label: 'About', ariaLabel: 'Learn about us', link: '#about' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' },
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'Instagram', link: 'https://www.instagram.com/carmel_senate/?next=%2F' },
  { label: 'Linktree', link: 'https://linktr.ee/CarmelSenate' },
];

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const lastMouseUpdate = useRef(0);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Throttle mouse movement on mobile
  const handleMouseMove = (e) => {
    if (isMobile) return; // Disable mouse tracking on mobile entirely
    
    const now = Date.now();
    if (now - lastMouseUpdate.current < 50) return; // Throttle to 20fps max
    lastMouseUpdate.current = now;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  };

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const maxScroll = window.innerHeight;
          const progress = Math.min(scrolled / maxScroll, 1);
          setScrollProgress(progress);
          setZoomLevel(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize calculations to prevent unnecessary re-renders
  const portalDepth = useMemo(() => zoomLevel * 5, [zoomLevel]);
  const fadeOpacity = useMemo(() => 
    zoomLevel < 0.7 ? 1 : 1 - ((zoomLevel - 0.7) / 0.3), [zoomLevel]
  );
  const contentOpacity = useMemo(() => 
    zoomLevel > 0.7 ? (zoomLevel - 0.7) / 0.3 : 0, [zoomLevel]
  );
  const titleOpacity = useMemo(() => 1 - (zoomLevel * 2), [zoomLevel]);

  // Reduce quality on mobile
  const burstProps = useMemo(() => ({
    animationType: isMobile ? "rotate" : "hover",
    colors: ['#0000FF', '#FFFF00', '#000000'],
    intensity: isMobile ? 1.5 : 2 + zoomLevel * 2,
    speed: isMobile ? 0.3 : 0.5 + zoomLevel * 1.5,
    distort: isMobile ? 3 : 5 + zoomLevel * 15,
    hoverDampness: 0.3,
    mousePosition: isMobile ? { x: 0.5, y: 0.5 } : mousePos,
    rayCount: isMobile ? 0 : 0
  }), [isMobile, zoomLevel, mousePos]);

  return (
    <div 
      ref={containerRef}
      style={{ position: 'relative' }}
      onMouseMove={handleMouseMove}
    >
      {/* Menu - FIRST, highest z-index, always on top */}
      <div style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 9999, 
        pointerEvents: 'none',
        opacity: zoomLevel < 0.3 ? 1 : zoomLevel > 0.7 ? 1 : 0.3,
        transition: 'opacity 0.4s ease'
      }}>
        <div style={{ pointerEvents: 'auto' }}>
          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            menuButtonColor="#fff"
            openMenuButtonColor="#4c13e7ff"
            changeMenuColorOnOpen={true}
            colors={['#B19EEF', '#5227FF']}
            logoUrl="/greyhound-logo.png"
            accentColor="#d8db24ff"
            onMenuOpen={() => console.log('Menu opened')}
            onMenuClose={() => console.log('Menu closed')}
          />
        </div>
      </div>

      {/* Spacer to enable scrolling */}
      <div style={{ height: '200vh' }} />

      {/* Fixed Portal Background - Only render if visible */}
      {fadeOpacity > 0.01 && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 0, 
          pointerEvents: 'none',
          opacity: fadeOpacity,
          willChange: 'transform, opacity',
          transform: `scale(${1 + portalDepth}) translateZ(0)`,
          transformOrigin: 'center center'
        }}>
          <PrismaticBurst {...burstProps} />
        </div>
      )}

      {/* Vignette effect for tunnel feel */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: `radial-gradient(circle at center, transparent ${60 - zoomLevel * 40}%, rgba(0,0,0,${0.3 + zoomLevel * 0.7}) 100%)`,
        transition: 'background 0.3s ease'
      }} />

      {/* Home Title - Fades out as you zoom */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: titleOpacity,
        transform: `scale(${1 + zoomLevel * 0.5})`,
        transition: 'opacity 0.3s ease, transform 0.3s ease'
      }}>
        <TextType
          text={[
            "Welcome to Carmel Senate",
            "Leading with Vision",
            "Serving Our Community"
          ]}
          as="h1"
          typingSpeed={80}
          deletingSpeed={50}
          pauseDuration={2000}
          loop={true}
          showCursor={true}
          cursorCharacter="|"
          textColors={['#FFFF00', '#0000FF', '#FFFFFF']}
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
            padding: '0 2rem'
          }}
        />
      </div>

      {/* Scroll Indicator - Only visible at top */}
      {zoomLevel < 0.1 && (
        <div style={{
          position: 'fixed',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6,
          color: '#fff',
          fontSize: '1rem',
          textAlign: 'center',
          pointerEvents: 'none',
          animation: 'bounce 2s infinite'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>↓</div>
          <div>Scroll to Enter</div>
          <style jsx>{`
            @keyframes bounce {
              0%, 100% { transform: translateX(-50%) translateY(0); }
              50% { transform: translateX(-50%) translateY(-10px); }
            }
          `}</style>
        </div>
      )}

      {/* Main Content - Timeline replaces all content */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        opacity: contentOpacity,
        pointerEvents: contentOpacity > 0.5 ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
        overflow: 'hidden',
        background: '#0a0a0a'
      }}>
        <div style={{
          height: '100vh',
          width: '100%',
          padding: '2rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* TimelineJS Embed - Full height, no outer scroll */}
          <iframe 
            src='https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=https://docs.google.com/spreadsheets/d/e/2PACX-1vSnYcuZqOnSZLGe--jtxM1g6B--8XpZpI0lMUQTU3t-NlZtkESamdtUucNUFJ23jkntmUmBUi5xnXHF/pubhtml&font=Default&lang=en&initial_zoom=2'
            width='100%' 
            height='100%'
            style={{
              border: 'none',
              borderRadius: '10px',
              maxWidth: '1400px'
            }}
            allowFullScreen
            title="Carmel Senate Timeline"
          />
        </div>
      </div>
    </div>
  );
}