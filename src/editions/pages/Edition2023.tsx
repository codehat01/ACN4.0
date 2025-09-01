import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';
import BoxList from '../components/BoxList';
import Footer from '../../components/Footer';
import { BoxItem } from '../types';
import '../edition.css';

function Edition2023() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Initialize slideshows after loading screen disappears
      setTimeout(() => {
        // This matches the original HTML slideshow initialization timing
      }, 500);
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
      id: 'panel1-slideshow-2023',
      title: 'Cultivating Innovation in Cybersecurity to Fuel Entrepreneurship',
      description: 'Panel members:\n\n1. Dr. Subramanian, the Executive Director of SETS, Chennai\n2. Mr. K. Sibi: A stalwart in Data Analytics, Generative AI, and Cyber Security.\n3. Mr. Natarajan Elangovan: A visionary leader in Cyber Security Strategy, Architecture, and Framework\n4. Ms. Nalini Kannan: Zero Trust Solution expert\n5. Dr. N. Gopalakrishnan: Former DRDO structural engineering committee member',
      images: [
      'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/images%2Fd1.JPG?alt=media&token=a6c9cfc9-17c0-43a3-8613-42a0c92d8e60',
      'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/images%2Fd2.JPG?alt=media&token=eda420f1-39f1-4098-91ed-67a07fcbba0c',
      'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/images%2Fd4.JPG?alt=media&token=caa28805-5c9a-4bb9-a354-8ab3f3c46048',
      'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/images%2Fday5.JPG?alt=media&token=1c18ca54-1f0e-42ba-b6fe-87c1dc052889'
      ]
    },
    {
      id: 'panel2-slideshow-2023',
      title: 'Box 2',
      description: 'Panel2',
      images: [
        'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/images%2Fday1.jpg?alt=media&token=446387e3-6cd2-434f-baa1-571f8528f697',
        'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/images%2Fday2.JPG?alt=media&token=9fbbadb5-88ba-4eb0-acec-7464c651c5c6'
      ]
    }
  ];

  const clubInaugurationData: BoxItem[] = [
    {
      id: 'amigos-slideshow-2023',
      title: 'AMIGOS',
      description: 'Amrita Intelligent Gaming and Opti-verse Sports\n\nWe feel privileged to have had Mr. Raghuraman R as our Chief Guest, who graciously unveiled the club\'s logo to mark the commencement of our journey. This was followed by the badging ceremony, in which the Chief Guest handed out badges to the club\'s office bearers. Following this, our Club\'s President, K. Sabari Kumar, elaborated on the vision and mission of AMIGOS.',
      images: [
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
      ]
    },
    {
      id: 'fact-slideshow-2023',
      title: 'FACT',
      description: 'Forensic Analysis Club Triage\n\nThe club\'s inauguration was graced by Mr. Palanikumar Arumugam, Vice President - Information Security, Equitas Small Finance Bank, who was our esteemed chief guest. He took center stage to unveil the club logo, symbolizing the beginning of an exciting journey into the world of forensics. Following this significant moment was a Badging Ceremony, where Mr. Palanikumar Arumugam presented badges to the club members, officially welcoming them into FACT.',
      images: [
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
      ]
    }
  ];

  const cyberTechFestData: BoxItem[] = [
    {
      id: 'mystery-slideshow-2023',
      title: 'Mystery unveiled',
      description: 'A cryptic and complicated case mimicking real world scenarios is presented to the participants who are required to use their expertise in physical/cyber forensics to solve the case created by the crafty minds of the FACT club.',
      images: [
        'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
      ]
    },
    {
      id: 'acnctf-slideshow-2023',
      title: 'ACN CTF',
      description: 'Amrita Cyber Nation CTF\n\nThis is a national level Capture The Flag (CTF) tournament conducted by the department of cyber security which focuses on various aspects such as Cyber Forensics, Reverse Engineering, Cryptography, Web exploitation, and Binary exploitation providing a fun and fulfilling experience for participants. Sponsored by HACK THE BOX.',
      images: [
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
      ]
    },
    {
      id: 'gamefusion-slideshow-2023',
      title: 'Game Fusion 3.0',
      description: 'Dive into the gaming extravaganza of Game Fusion 3.0 with BGMI, CODM, and Valorant. Showcase your gaming finesse and aim to be the champion in the virtual battlegrounds.',
      images: [
        'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
      ]
    },
    {
      id: 'metaverse-slideshow-2023',
      title: 'Meta-Verse Experience',
      description: 'Swirl into the world of AR-VR technology provided by the Meta-Quest 3 in this event conducted by the AMIGOS club. Test out beta features, gaming, fitness and more.',
      images: [
        'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
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

        <SectionHeader id="club-inauguration" title="Club Inauguration" />
        <div className="custom-container">
          <BoxList data={clubInaugurationData} hasSlideshow={true} />
        </div>

        <SectionHeader id="cyber-tech-fest" title="Cyber Techfest'23" />
        <div className="custom-container">
          <BoxList data={cyberTechFestData} hasSlideshow={true} />
        </div>
      </div>

      <Footer />

      <div id="edition-2022" className="visually-hidden" aria-hidden="true"></div>
      <div id="edition-2023" className="visually-hidden" aria-hidden="true"></div>
      <div id="sponsors" className="visually-hidden" aria-hidden="true"></div>
      <div id="gallery-2022" className="visually-hidden" aria-hidden="true"></div>
      <div id="gallery-2023" className="visually-hidden" aria-hidden="true"></div>
      <div id="team" className="visually-hidden" aria-hidden="true"></div>
    </div>
  );
}

export default Edition2023;