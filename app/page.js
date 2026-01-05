"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import StaggeredMenu from '../components/StaggeredMenu';
import TextType from '../components/TextType';
import ChromaGrid from '../components/ChromaGrid';

const PrismaticBurst = dynamic(() => import('../components/PrismaticBurst'), {
  ssr: false,
  loading: () => <div style={{ background: '#000', position: 'absolute', inset: 0 }} />
});

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '#home' },
  { label: 'Timeline', ariaLabel: 'View our timeline', link: '#timeline' },
  { label: 'Senators', ariaLabel: 'Meet the senators', link: '#senators' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' },
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'Instagram', link: 'https://www.instagram.com/carmel_senate/?next=%2F' },
  { label: 'Linktree', link: 'https://linktr.ee/CarmelSenate' },
];

const senators = [
  {
    image: 'https://i.pravatar.cc/300?img=8',
    title: 'Alex Johnson',
    subtitle: 'Senate President',
    handle: '@alexjohnson',
    borderColor: '#FFFF00',
    gradient: 'linear-gradient(145deg, #FFFF00, #000)',
    committees: ['Executive Board', 'Finance Committee', 'Student Wellness'],
    bio: 'Leading Carmel Senate with a focus on student voice and community engagement. Passionate about creating inclusive policies and memorable school events.',
    projects: ['Homecoming 2024', 'Mental Health Awareness Week', 'Budget Reform']
  },
  {
    image: 'https://i.pravatar.cc/300?img=11',
    title: 'Sam Rodriguez',
    subtitle: 'Vice President',
    handle: '@samrodriguez',
    borderColor: '#0000FF',
    gradient: 'linear-gradient(210deg, #0000FF, #000)',
    committees: ['Executive Board', 'Academic Affairs', 'Technology Committee'],
    bio: 'Dedicated to improving academic resources and technology access for all students. Working on innovative solutions for campus connectivity.',
    projects: ['Study Space Expansion', 'WiFi Improvement Initiative', 'Tutoring Program']
  },
  {
    image: 'https://i.pravatar.cc/300?img=3',
    title: 'Jordan Lee',
    subtitle: 'Treasurer',
    handle: '@jordanlee',
    borderColor: '#10B981',
    gradient: 'linear-gradient(165deg, #10B981, #000)',
    committees: ['Finance Committee', 'Fundraising', 'Budget Planning'],
    bio: 'Managing senate finances with transparency and accountability. Ensuring every dollar supports student initiatives and school improvements.',
    projects: ['Annual Budget Report', 'Fundraiser Coordination', 'Financial Transparency Portal']
  },
  {
    image: 'https://i.pravatar.cc/300?img=16',
    title: 'Morgan Taylor',
    subtitle: 'Secretary',
    handle: '@morgantaylor',
    borderColor: '#F59E0B',
    gradient: 'linear-gradient(195deg, #F59E0B, #000)',
    committees: ['Communications', 'Social Media', 'Documentation'],
    bio: 'Keeping the senate organized and transparent through detailed record-keeping and engaging social media presence.',
    projects: ['Meeting Minutes Archive', 'Instagram Growth Campaign', 'Newsletter Launch']
  },
  {
    image: 'https://i.pravatar.cc/300?img=25',
    title: 'Casey Williams',
    subtitle: 'Events Coordinator',
    handle: '@caseywilliams',
    borderColor: '#8B5CF6',
    gradient: 'linear-gradient(225deg, #8B5CF6, #000)',
    committees: ['Events Planning', 'Spirit Committee', 'Community Outreach'],
    bio: 'Creating unforgettable experiences for the Carmel community. From pep rallies to fundraisers, making every event special.',
    projects: ['Spirit Week Planning', 'Winter Formal', 'Community Service Day']
  },
  {
    image: 'https://i.pravatar.cc/300?img=60',
    title: 'Riley Chen',
    subtitle: 'Class Representative',
    handle: '@rileychen',
    borderColor: '#06B6D4',
    gradient: 'linear-gradient(135deg, #06B6D4, #000)',
    committees: ['Student Affairs', 'Diversity & Inclusion', 'Peer Mediation'],
    bio: 'Representing student voices and advocating for inclusive policies. Building bridges between administration and students.',
    projects: ['Student Survey Initiative', 'Cultural Heritage Month', 'Peer Support Program']
  }
];

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSenator, setExpandedSenator] = useState(null);
  const containerRef = useRef(null);
  const lastMouseUpdate = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    
    const now = Date.now();
    if (now - lastMouseUpdate.current < 50) return;
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

  const portalDepth = useMemo(() => zoomLevel * 5, [zoomLevel]);
  const fadeOpacity = useMemo(() => 
    zoomLevel < 0.7 ? 1 : 1 - ((zoomLevel - 0.7) / 0.3), [zoomLevel]
  );
  const contentOpacity = useMemo(() => 
    zoomLevel > 0.7 ? (zoomLevel - 0.7) / 0.3 : 0, [zoomLevel]
  );
  const titleOpacity = useMemo(() => 1 - (zoomLevel * 2), [zoomLevel]);

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

  const handleSenatorClick = (senator, index) => {
    setExpandedSenator({ ...senator, index });
  };

  const handleNextSenator = () => {
    if (expandedSenator) {
      const nextIndex = (expandedSenator.index + 1) % senators.length;
      setExpandedSenator({ ...senators[nextIndex], index: nextIndex });
    }
  };

  const handlePrevSenator = () => {
    if (expandedSenator) {
      const prevIndex = (expandedSenator.index - 1 + senators.length) % senators.length;
      setExpandedSenator({ ...senators[prevIndex], index: prevIndex });
    }
  };

  const chromaItems = senators.map((senator) => ({
    ...senator,
    url: null
  }));

  return (
    <div 
      ref={containerRef}
      style={{ position: 'relative' }}
      onMouseMove={handleMouseMove}
    >
      <style jsx global>{`
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

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

      <div style={{ height: '300vh' }} />

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

      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: `radial-gradient(circle at center, transparent ${60 - zoomLevel * 40}%, rgba(0,0,0,${0.3 + zoomLevel * 0.7}) 100%)`,
        transition: 'background 0.3s ease'
      }} />

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

      {zoomLevel < 0.5 && (
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
          opacity: 1 - (zoomLevel * 2),
          animation: 'bounce 2s infinite'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>↓</div>
          <div>Scroll to Enter</div>
        </div>
      )}

      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        opacity: contentOpacity,
        pointerEvents: contentOpacity > 0.5 ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
        overflowY: 'auto',
        background: '#0a0a0a'
      }}>
        {/* Timeline Section */}
        <section id="timeline" style={{
          minHeight: '100vh',
          width: '100%',
          padding: '2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '1400px',
            height: '85vh'
          }}>
            <iframe 
              src='https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vSnYcuZqOnSZLGe--jtxM1g6B--8XpZpI0lMUQTU3t-NlZtkESamdtUucNUFJ23jkntmUmBUi5xnXHF&font=Georgia-Helvetica&lang=en&initial_zoom=5&theme=contrast&width=100%25&height=500'
              width='100%' 
              height='100%'
              style={{
                border: 'none',
                borderRadius: '10px'
              }}
              allowFullScreen
              title="Carmel Senate Timeline"
            />
          </div>
        </section>

        <section id="senators" style={{
          minHeight: '100vh',
          width: '100%',
          padding: '4rem 1rem',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)'
        }}>
          <h2 style={{
            fontSize: '3rem',
            color: '#FFFF00',
            textAlign: 'center',
            marginBottom: '3rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontFamily: 'Georgia, serif'
          }}>
            Meet Your Senators
          </h2>
          
          <div onClick={(e) => {
            const card = e.target.closest('.chroma-card');
            if (card) {
              const index = Array.from(card.parentElement.children).indexOf(card);
              if (index >= 0 && index < senators.length) {
                handleSenatorClick(senators[index], index);
              }
            }
          }}>
            <ChromaGrid 
              items={chromaItems}
              radius={300}
              columns={3}
              damping={0.45}
            />
          </div>
        </section>
      </div>

      {expandedSenator && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.3s ease'
        }}
        onClick={() => setExpandedSenator(null)}>
          <div style={{
            background: expandedSenator.gradient,
            borderRadius: '20px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: `2px solid ${expandedSenator.borderColor}`,
            position: 'relative',
            animation: 'slideUp 0.3s ease'
          }}
          onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setExpandedSenator(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              ×
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <img 
                  src={expandedSenator.image} 
                  alt={expandedSenator.title}
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    border: `3px solid ${expandedSenator.borderColor}`,
                    objectFit: 'cover'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h2 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    {expandedSenator.title}
                  </h2>
                  <p style={{ color: expandedSenator.borderColor, fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {expandedSenator.subtitle}
                  </p>
                  <p style={{ color: '#aaa', fontSize: '1rem' }}>
                    {expandedSenator.handle}
                  </p>
                </div>
              </div>

              <div>
                <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>About</h3>
                <p style={{ color: '#ddd', fontSize: '1.1rem', lineHeight: '1.8' }}>
                  {expandedSenator.bio}
                </p>
              </div>

              <div>
                <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>Committees</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {expandedSenator.committees.map((committee, i) => (
                    <span key={i} style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      border: `1px solid ${expandedSenator.borderColor}`
                    }}>
                      {committee}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>Current Projects</h3>
                <ul style={{ color: '#ddd', fontSize: '1rem', lineHeight: '2', paddingLeft: '1.5rem' }}>
                  {expandedSenator.projects.map((project, i) => (
                    <li key={i}>{project}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                <button
                  onClick={handlePrevSenator}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: `2px solid ${expandedSenator.borderColor}`,
                    color: '#fff',
                    padding: '0.75rem 2rem',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = expandedSenator.borderColor;
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}>
                  ← Previous
                </button>
                <button
                  onClick={handleNextSenator}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: `2px solid ${expandedSenator.borderColor}`,
                    color: '#fff',
                    padding: '0.75rem 2rem',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = expandedSenator.borderColor;
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}>
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}