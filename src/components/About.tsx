import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Target, Users, Award } from 'lucide-react';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const features = [
    { icon: Shield, title: 'Cyber Security', desc: 'Advanced security awareness programs' },
    { icon: Target, title: 'Strategic Learning', desc: 'Targeted educational initiatives' },
    { icon: Users, title: 'Community Building', desc: 'Fostering cyber-aware communities' },
    { icon: Award, title: 'Excellence', desc: 'Industry-recognized expertise' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <motion.div
            ref={ref}
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg"
                alt="Cyber Security Conference"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating Stats */}
            <motion.div
              className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold font-roboto text-primary">3rd</div>
                <div className="text-sm text-gray-600">Edition</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-roboto text-primary mb-6">
              About ACN
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Amrita CyberNation is an annual event dedicated to promoting cyber awareness 
              and education among students, professionals, and the broader community. Our 
              mission is to bridge the gap between academic knowledge and industry practices 
              in cybersecurity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold font-roboto text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="px-8 py-3 bg-primary text-white font-semibold font-roboto rounded-full hover:bg-primary/90 transition-colors duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Learn More About Us
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;