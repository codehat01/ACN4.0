import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';
import BoxList from '../components/BoxList';
import Footer from '../../components/Footer';
import { BoxItem } from '../types';
import '../edition.css';

function Edition2024() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateStickyOffset = () => {
      const navbar = document.getElementById('navbar');
      if (!navbar) return;
      const extra = window.innerWidth <= 768 ? 20 : 40;
      const cs = window.getComputedStyle(navbar);
      const marginTop = parseFloat(cs.marginTop) || 0;
      const offset = Math.max(0, Math.round(navbar.offsetHeight + marginTop + extra));
      document.documentElement.style.setProperty('--sticky-offset', offset + 'px');
    };

    const handleScroll = () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        const shouldShrink = window.scrollY > 50;
        const hasShrink = navbar.classList.contains('shrink');
        if (shouldShrink && !hasShrink) {
          navbar.classList.add('shrink');
        } else if (!shouldShrink && hasShrink) {
          navbar.classList.remove('shrink');
        }
        updateStickyOffset();
      }
    };

    updateStickyOffset();
    window.addEventListener('load', updateStickyOffset);
    window.addEventListener('orientationchange', updateStickyOffset);
    window.addEventListener('resize', updateStickyOffset);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('load', updateStickyOffset);
      window.removeEventListener('orientationchange', updateStickyOffset);
      window.removeEventListener('resize', updateStickyOffset);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const cyberConclaveData: BoxItem[] = [
    {
      id: 'panel1-slideshow-2024',
      title: 'Cultivating Innovation in Cybersecurity to Fuel Entrepreneurship',
      description: 'Panel members:\n\n1. Mr. Rajesh Ganesan, President of ManageEngine(a division of Zoho Corporation)\n2. Dr. T.R. Reshmi (Scientist, SETS Chennai)\n3. Mr. Vinod Senthil T (Founder, DigiALERT)\n4. Mr. Aravind Gnanabaskaran (AGM, Expleo Solutions)',
      images: [
       'https://amritacybernation.com/image/event%202%20conclave/IMG_8449.jpg',
       'https://amritacybernation.com/image/event%202%20conclave/IMG_8443.jpg',
       'https://amritacybernation.com/image/event%202%20conclave/IMG_8446.jpg',
       'https://amritacybernation.com/image/event%202%20conclave/IMG_8447.jpg'
      ]
    },
    {
      id: 'panel2-slideshow-2024',
      title: 'Insights',
      description: 'Amrita Cyber Nation 2024\'s Cyber Conclave, moderated by Rajesh Ganesan, featured a panel discussing AI\'s future in cybersecurity, including certifications, threat hunting, and infrastructure protection. Experts highlighted AI\'s potential and risks, emphasizing proactive defense strategies.',
      images: [
       'https://amritacybernation.com/image/event%202%20conclave/IMG_8432.jpg',
       'https://amritacybernation.com/image/event%202%20conclave/IMG_8439.jpg',
       'https://amritacybernation.com/image/event%202%20conclave/IMG_8462.jpg',
       'https://amritacybernation.com/image/event%202%20conclave/IMG_8548.jpg'
      ]
    }
  ];

  const cyberTechFestData: BoxItem[] = [
    {
      id: 'malquest-slideshow-2024',
      title: 'MalQuest 2024',
      description: 'MalQuest, a cybersecurity event, attracted 30 teams with high engagement levels, focusing on cryptography, reverse engineering, and static malware analysis. The event successfully concluded, introducing foundational concepts.',
      images: [
        'https://amritacybernation.com/image/event%2013/20240918_041517068_iOS.jpg',
        'https://amritacybernation.com/image/event%2013/20240918_052318577_iOS.jpg',
        'https://amritacybernation.com/image/event%2013/20240918_052337191_iOS.jpg'
      ]
    },
    {
      id: 'acnctf-slideshow-2024',
      title: 'ACN CTF',
      description: 'Amrita Cyber Nation CTF\n\nACNCTF\'24, a 24-hour cybersecurity competition, attracted 58 teams from various domains. The event showcased problem-solving skills and technical acumen, with teams demonstrating their technical prowess and fostering a collaborative environment.',
      images: [
       'https://amritacybernation.com/image/event%204/ctf%20(18).jpeg',
       'https://amritacybernation.com/image/event%204/ctf%20(5).jpeg',
       'https://amritacybernation.com/image/event%204/ctf%20(8).jpeg',
       'https://amritacybernation.com/image/event%204/ctf%20(3)%20(1).jpeg'
        ]
    },
    {
      id: 'gamathon-slideshow-2024',
      title: 'Gamathon',
      description: 'Dive into the gaming extravaganza of Gamathon with BGMI, CODM, and FIFA24. Showcase your gaming finesse and aim to be the champion in the virtual battlegrounds.',
      images: [
        'https://amritacybernation.com/image/event%2010/20240918_075619564_iOS.jpg',
        'https://amritacybernation.com/image/event%2010/20240918_075332618_iOS.jpg'
      ]
    },
    {
      id: 'cryptoshield-slideshow-2024',
      title: 'CryptoSheild Hackathon',
      description: 'Amrita Cyber Nation\'s 3rd edition, the Crypto Shield Hackathon, attracted 49 teams from across India, with 15 shortlisted for the final round, focusing on Blockchain, Cybersecurity, and OpenAI.',
      images: [
       '/images/Hackathon.jpg',
       'https://amritacybernation.com/image/event%203/IMG_8586.jpg',
       'https://amritacybernation.com/image/event%203/IMG_8648.jpg',
       'https://amritacybernation.com/image/event%203/IMG_8682.jpg'
      ]
    },
    {
      id: 'forensic-triage-slideshow-2024',
      title: 'Forensic Triage 2024',
      description: 'Digital forensics competition focusing on evidence collection, analysis, and incident response techniques. Participants will demonstrate their skills in forensic investigation and triage procedures.',
      images: [
        'https://amritacybernation.com/image/event%208/IMG_0309.jpg',
        'https://amritacybernation.com/image/event%208/IMG_0317.jpg',
        'https://amritacybernation.com/image/event%208/IMG_0326.jpg'
      ]
    },
    {
      id: 'forensic-files-slideshow-2024',
      title: 'Forensic Files 2024',
      description: 'Advanced digital forensics challenge involving file system analysis, data recovery, and evidence examination. Test your expertise in uncovering digital evidence and solving complex cases.',
      images: [
        'https://amritacybernation.com/image/event%2012/IMG_1300.jpg',
        'https://amritacybernation.com/image/event%2012/IMG_0072.jpg',
        'https://amritacybernation.com/image/event%2012/IMG_0002.jpg',
        'https://amritacybernation.com/image/event%2012/IMG_1311.jpg'
      ]
    },
    {
      id: 'morphx-slideshow-2024',
      title: 'Morphx 2024',
      description: 'Innovative cybersecurity challenge combining multiple domains including network security, cryptography, and system exploitation. Push your limits in this comprehensive security competition.',
      images: [
        'https://amritacybernation.com/image/event%2015/20240918_060214582_iOS.jpg',
        'https://amritacybernation.com/image/event%2015/20240918_060311670_iOS.jpg',
        'https://amritacybernation.com/image/event%2015/20240918_060523920_iOS.jpg'
      ]
    },
    {
      id: 'ideate-slideshow-2024',
      title: 'IdeAte 2024',
      description: 'Creative ideation and innovation challenge where teams present cybersecurity solutions and concepts. Showcase your innovative thinking and problem-solving approach to emerging security challenges.',
      images: [
        'https://amritacybernation.com/image/event%2014/20240918_042933686_iOS.jpg',
        'https://amritacybernation.com/image/event%2014/20240918_043032338_iOS.jpg',
        'https://amritacybernation.com/image/event%2014/20240918_043113811_iOS.jpg',
        'https://amritacybernation.com/image/event%2014/20240918_043756891_iOS.jpg'
      ]
    }
  ];

  return (
    <div className="App">
      <a href="#main-content" className="skip-link">Skip to content</a>
      
      {isLoading && <LoadingScreen />}
      <noscript>
        <style>{`#loading-screen{display:none!important}#main-content{display:block!important}`}</style>
      </noscript>
      
      <div id="main-content" role="main" style={{ display: isLoading ? 'none' : 'block' }}>
        <Navbar />
        <SectionHeader id="cyber-conclave" title="Cyber Conclave" />
        <div className="custom-container">
          <BoxList data={cyberConclaveData} hasSlideshow={true} />
        </div>
        <SectionHeader id="cyber-tech-fest" title="Cyber Techfest'24" />
        <div className="custom-container">
          <BoxList data={cyberTechFestData} hasSlideshow={true} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Edition2024;