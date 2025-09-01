import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useMotionValue, MotionValue } from 'framer-motion';
import { Calendar, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PathFollowerProps {
  d: string;
  progress: MotionValue<number>;
  gradientId: string;
  className?: string;
  ballSize?: number;
}

const PathFollower: React.FC<PathFollowerProps> = ({ d, progress, gradientId, className = '', ballSize = 24 }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [pathLength, setPathLength] = useState(1);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  useEffect(() => {
    const unsub = progress.on('change', (t: number) => {
      if (!pathRef.current) return;
      const L = Math.max(0, Math.min(1, t)) * pathLength;
      const pt = pathRef.current.getPointAtLength(L);
      x.set(pt.x - ballSize / 2);
      y.set(pt.y - ballSize / 2);
    });
    if (pathRef.current) {
      const L0 = Math.max(0, Math.min(1, progress.get?.() ?? 0)) * pathLength;
      const pt0 = pathRef.current.getPointAtLength(L0);
      x.set(pt0.x - ballSize / 2);
      y.set(pt0.y - ballSize / 2);
    }
    return () => unsub && unsub();
  }, [pathLength, pathRef]);

  return (
    <div className={`absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[1200px] pointer-events-none ${className}`}>
      <svg width="800" height="1200" viewBox="0 0 800 1200" className="absolute inset-0 opacity-20">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <path ref={pathRef} d={d} stroke={`url(#${gradientId})`} strokeWidth="3" fill="none" strokeDasharray="10,5" className="animate-pulse" />
      </svg>

      <motion.div
        className="absolute rounded-full shadow-lg z-30"
        style={{ width: ballSize, height: ballSize, x, y }}
        animate={{
          scale: [1, 1.15, 1],
          boxShadow: [
            '0 0 10px rgba(59,130,246,0.45)',
            '0 0 18px rgba(139,92,246,0.55)',
            '0 0 10px rgba(59,130,246,0.45)'
          ]
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
      </motion.div>
    </div>
  );
};

interface Edition {
  year: string;
  title: string;
  participants: string;
  sessions: string;
  description: string;
  highlights: string[];
  color: string;
  position: string;
  path: string;
}

const Editions: React.FC = () => {
  const navigate = useNavigate();
  const editions: Edition[] = [
    {
      year: '2022',
      title: 'ACN 1st Edition',
      participants: '500+',
      sessions: '12',
      description: 'The inaugural edition focused on foundational cybersecurity awareness and introduced students to the evolving threat landscape.',
      highlights: ['Industry Expert Talks', 'Hands-on Workshops', 'Networking Sessions', 'Security Challenges'],
      color: 'from-blue-500 to-blue-600',
      position: 'left',
      path: '/editions/2022'
    },
    {
      year: '2023',
      title: 'ACN 2nd Edition',
      participants: '750+',
      sessions: '18',
      description: 'Building on our success, the second edition expanded to include advanced topics and international speakers.',
      highlights: ['Global Speaker Panel', 'Advanced Workshops', 'Hackathon Competition', 'Industry Partnerships'],
      color: 'from-purple-500 to-purple-600',
      position: 'right',
      path: '/editions/2023'
    },
    {
      year: '2024',
      title: 'ACN 3rd Edition',
      participants: '1000+',
      sessions: '24',
      description: 'Our biggest edition yet, featuring cutting-edge AI security topics, quantum cryptography, and next-generation threat detection.',
      highlights: ['AI Security Summit', 'Quantum Cryptography Workshop', 'Bug Bounty Competition', 'Global Security Forum'],
      color: 'from-indigo-500 to-indigo-600',
      position: 'left',
      path: '/editions/2024'
    }
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setInterval(() => {
        setVisibleItems((prev) => {
          if (prev < editions.length) return prev + 1;
          clearInterval(timer);
          return prev;
        });
      }, 600);
      return () => clearInterval(timer);
    }
  }, [isInView, editions.length]);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const timelinePath = 'M 400 0 Q 200 200 400 400 Q 600 600 400 800 Q 200 1000 400 1200';

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold font-roboto bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6"
            animate={isInView ? { scale: [0.9, 1.05, 1] } : {}}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            Our Journey
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">Discover the evolution of our cybersecurity community through the years</p>
        </motion.div>

        <div ref={containerRef} className="relative max-w-6xl mx-auto min-h-[1200px]">
          <PathFollower d={timelinePath} progress={scrollYProgress} gradientId="pathGradient" />

          <div className="space-y-32">
            {editions.map((edition, index) => (
              <motion.div
                key={edition.year}
                className={`relative flex items-center justify-center ${edition.position === 'left' ? 'lg:justify-start' : 'lg:justify-end'}`}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={visibleItems > index ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100 }}
              >
                <motion.div
                  className={`absolute top-1/2 h-0.5 bg-gradient-to-r ${edition.color} ${edition.position === 'left' ? 'right-1/2 mr-6 w-24 lg:w-32' : 'left-1/2 ml-6 w-24 lg:w-32'}`}
                  initial={{ width: 0 }}
                  animate={visibleItems > index ? { width: '6rem' } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                />

                <motion.div
                  className="absolute left-1/2 top-1/2 w-4 h-4 bg-white border-4 border-blue-500 rounded-full shadow-lg z-20 transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0 }}
                  animate={visibleItems > index ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  whileHover={{ scale: 1.5 }}
                />

                <motion.div
                  className={`w-full max-w-md lg:max-w-lg ${edition.position === 'left' ? 'lg:mr-auto lg:pr-8' : 'lg:ml-auto lg:pl-8'}`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div
                    className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group"
                    onClick={() => navigate(editions[index].path)}
                  >
                    <motion.div className={`inline-flex items-center px-6 py-2 rounded-full text-white font-bold font-roboto text-sm mb-4 bg-gradient-to-r ${edition.color} shadow-lg`} whileHover={{ scale: 1.05 }}>
                      {edition.year}
                    </motion.div>

                    <h3 className="text-2xl lg:text-3xl font-bold font-roboto text-slate-800 mb-4 group-hover:text-custom-burgundy transition-colors duration-300">{edition.title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">{edition.description}</p>

                    <div className="flex flex-wrap gap-6 mb-6">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${edition.color}`}>
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-500">Participants</div>
                          <div className="font-bold font-roboto text-slate-800">{edition.participants}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${edition.color}`}>
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-500">Sessions</div>
                          <div className="font-bold font-roboto text-slate-800">{edition.sessions}</div>
                        </div>
                      </div>
                    </div>

                    <motion.button className="flex items-center space-x-2 text-custom-burgundy font-semibold font-roboto group-hover:text-purple-600 transition-colors duration-300" whileHover={{ x: 5 }}>
                      <span>Explore Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>

                    <motion.div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${edition.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Editions;