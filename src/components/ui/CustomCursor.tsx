import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth spring animation for cursor
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Trail dots
  const trailCount = 5;
  const trails = useRef(
    Array.from({ length: trailCount }, () => ({
      x: useMotionValue(-100),
      y: useMotionValue(-100),
    }))
  ).current;

  const trailSprings = trails.map((trail, index) => ({
    x: useSpring(trail.x, { damping: 30 + index * 5, stiffness: 300 - index * 30 }),
    y: useSpring(trail.y, { damping: 30 + index * 5, stiffness: 300 - index * 30 }),
  }));

  useEffect(() => {
    // Only show custom cursor on desktop
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Update trail positions with delay
      trails.forEach((trail, index) => {
        setTimeout(() => {
          trail.x.set(e.clientX);
          trail.y.set(e.clientY);
        }, (index + 1) * 30);
      });
      
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Detect hoverable elements
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

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousemove', handleElementHover);
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
  }, [cursorX, cursorY, trails]);

  // Don't render on mobile
  if (typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return null;
  }

  return (
    <>
      {/* Hide default cursor globally */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Trail dots */}
      {trailSprings.map((spring, index) => (
        <motion.div
          key={index}
          className="fixed pointer-events-none z-[9998] rounded-full bg-primary/30"
          style={{
            x: spring.x,
            y: spring.y,
            width: 8 - index * 1.2,
            height: 8 - index * 1.2,
            translateX: '-50%',
            translateY: '-50%',
            opacity: isVisible ? 0.6 - index * 0.1 : 0,
          }}
        />
      ))}

      {/* Main cursor ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full border-2 border-primary"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 50 : isClicking ? 24 : 36,
          height: isHovering ? 50 : isClicking ? 24 : 36,
          opacity: isVisible ? 1 : 0,
          borderColor: isHovering ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.6)',
        }}
        transition={{
          width: { duration: 0.2 },
          height: { duration: 0.2 },
          opacity: { duration: 0.2 },
        }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full bg-primary"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 8 : isClicking ? 12 : 6,
          height: isHovering ? 8 : isClicking ? 12 : 6,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Glow effect on hover */}
      <motion.div
        className="fixed pointer-events-none z-[9997] rounded-full bg-primary/10 blur-xl"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 80 : 0,
          height: isHovering ? 80 : 0,
          opacity: isHovering && isVisible ? 0.5 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
};
