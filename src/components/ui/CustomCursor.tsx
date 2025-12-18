import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Optimized spring config - faster response
  const springConfig = { damping: 20, stiffness: 500, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only show custom cursor on desktop with pointer device
    const isMobile = window.matchMedia('(pointer: coarse)').matches || 
                     window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Optimized hover detection
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer');
      
      setIsHovering(!!isHoverable);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mousemove', handleElementHover, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousemove', handleElementHover);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  // Don't render on mobile/touch devices
  if (typeof window !== 'undefined') {
    const isMobile = window.matchMedia('(pointer: coarse)').matches || 
                     window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) return null;
  }

  return (
    <>
      {/* Hide default cursor globally */}
      <style>{`
        @media (pointer: fine) and (min-width: 1024px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Main cursor ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full border-2 border-primary will-change-transform"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 48 : isClicking ? 24 : 32,
          height: isHovering ? 48 : isClicking ? 24 : 32,
          opacity: isVisible ? 1 : 0,
          borderColor: isHovering ? 'hsl(var(--accent))' : 'hsl(var(--primary) / 0.7)',
        }}
        transition={{
          width: { duration: 0.15 },
          height: { duration: 0.15 },
          opacity: { duration: 0.1 },
        }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full bg-primary will-change-transform"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 6 : isClicking ? 10 : 4,
          height: isHovering ? 6 : isClicking ? 10 : 4,
          opacity: isVisible ? 1 : 0,
          backgroundColor: isHovering ? 'hsl(var(--accent))' : 'hsl(var(--primary))',
        }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
};
