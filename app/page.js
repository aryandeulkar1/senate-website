"use client";

import { useState } from 'react';
import StaggeredMenu from '../components/StaggeredMenu';
import PrismaticBurst from '../components/PrismaticBurst';
import TextType from '../components/TextType';

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Services', ariaLabel: 'View our services', link: '/services' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' },
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'Instagram', link: 'https://www.instagram.com/carmel_senate/?next=%2F' },
  { label: 'Linktree', link: 'https://linktr.ee/CarmelSenate' },
];

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  };

  return (
    <div 
      style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
    >
      
      {/* Background with mouse position passed as prop */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <PrismaticBurst
          animationType="hover"
          colors={['#0000FF', '#FFFF00', '#000000']}
          intensity={2}
          speed={0.5}
          distort={5}
          hoverDampness={0.3}
          mousePosition={mousePos}
        />
      </div>

      {/* Main Content - Centered Text */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
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
          className="senate-heading"
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
            padding: '0 2rem'
          }}
        />
      </div>

      {/* Menu - directly as child, will handle its own positioning */}
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
  );
}