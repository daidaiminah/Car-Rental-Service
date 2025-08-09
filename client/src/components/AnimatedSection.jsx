import React from 'react';
import { motion } from 'framer-motion';

// Reusable animated section component
const AnimatedSection = ({ 
  children, 
  className = "", 
  delay = 0,
  animation = "fadeIn" // Options: fadeIn, slideUp, scaleIn
}) => {
  // Animation variants
  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1, 
        transition: { 
          duration: 0.8,
          delay
        } 
      }
    },
    slideUp: {
      hidden: { y: 50, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1, 
        transition: { 
          duration: 0.6,
          delay
        } 
      }
    },
    scaleIn: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { 
        scale: 1, 
        opacity: 1, 
        transition: { 
          duration: 0.5,
          delay
        } 
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={animations[animation]}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
