import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';
import BoxList from '../components/BoxList';
import Footer from '../../components/Footer';
import { BoxItem } from '../types';
import '../edition.css';
function Edition2022() {
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
      id: 'panel1-slideshow-2022',
      title: 'Panel 1',
      description: 'Panel 1: Cyber Threats: An Emerging Global Challenge\n\nPanel Members:\n\n• Mr. Ishwar Prasad Bhat, CEO, Necurity Solutions\n\n• Natarajan Elangovan, Head – Security Engineering at Wipro Limited, Chennai\n\n• T. T. Aditya, Product Owner – Security and Privacy, Continental Corporation Pvt. Ltd., Bengaluru\n\n• S. Venkat Sairam, Chief Manager, Computer Systems Dept. CUB\n\nPanel Chair:\nDr. Prabaharan Poornachandran, Director, Centre for Internet Studies and Artificial Intelligence, Amrita Vishwa Vidyapeetham, Amritapuri, Kerala',
      images: [
        'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/2022%2Fpanel1_mem1.jpg?alt=media&token=20c3419a-ceac-473b-9bf9-0b7208edeeea',
        'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/2022%2Fpanel1_mem2.jpg?alt=media&token=c2c0541a-e67d-4f53-95ce-2a4d5faa712a',
        'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/2022%2Fpanel1_mem3.jpg?alt=media&token=2e890937-21e9-4d4a-a170-b71b6d669516',
        'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/2022%2Fpanel1_mem4.jpg?alt=media&token=ab4c7a54-421a-4125-b33e-9e799570056a'
      ]
    },
    {
      id: 'panel2-slideshow-2022',
      title: 'Panel 2',
      description: 'Panel 2: Technological Solutions and Directions to Secure Cyber Space\n\nPanel Members:\n\n• Mr Yesudian Rajkumar J.K, Founder Amud Solutions, Zero Trust Consultant, Quick Heal Technologies, Chennai\n\n• Dittin Andrews, Joint Director Cyber Security, CDAC, Thiruvanthapuram\n\n• Melvin John, Security Specialist at NEC Corporation India Pvt. Ltd, Bengaluru\n\n• (R) Mr. Devender Singh Rawat, Former Deputy Director, Electronic Warfare Communication Spectrum\n\nPanel Chair:\nDr Shankar Raman, CEO, Pravarthak Ecosystems, IIT Madras Research Park, Chennai',
      images: [
        'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/2022%2Fpanel2_mem1.jpg?alt=media&token=12215c92-d56d-446c-88f8-47415d98b8a2',
        'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/2022%2Fpanel2_mem2.jpg?alt=media&token=7afad5b8-ac58-4ba1-a437-7f4f24d25101',
        'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/2022%2Fpanel2_mem3.jpg?alt=media&token=743a7f38-b752-4e0a-a778-a74a9457d4ff',
        'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/2022%2Fpanel2_mem4.jpg?alt=media&token=b387b90e-88ee-4c8e-917c-3de3d225c013'
      ]
    },
    {
      id: 'panel3-slideshow-2022',
      title: 'Panel 3',
      description: 'Panel 3: Role of Academia in Strengthening Cybersecurity\n\nPanel Members:\n\n• Dr S.A.V.Satyamurty, Distinguished Scientist and Former Director, IGCAR, Presently Director, Research, Vinayaga Missions Research Foundation\n\n• Prof Dr Sethumadhavan, Head, TIFAC Core in Cybersecurity, Amrita Vishwa Vidyapeetham, Coimbatore\n\n• Siraj Rahim DGM – Operation Technology, MRF Limited, Chennai\n\n• Mr Pradeep, Sr Director, FICE/INTEL Bengaluru\n\nPanel Chair:\nMr.Sitaram Chamarty, Principal Consultant at TCS, Hyderabad',
      images: [
        'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/2022%2Fpanel3_mem1.jpg?alt=media&token=95bdc206-a445-44a8-87f1-616121e9c9da',
        'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/2022%2Fpanel3_mem2.jpg?alt=media&token=035bf5c7-de59-49bb-915f-c3c4270c3505',
        'https://firebasestorage.googleapis.com/v0/b/acn-2024-9779f.appspot.com/o/2022%2Fpanel3_mem3.jpg?alt=media&token=4b8b1eec-c7b8-416b-bee9-42eaf4408a03'
      ]
    }
  ];

  const cyberTechFestData: BoxItem[] = [
    {
      title: 'CTF',
      description: 'CTF (Capture The Flag) (6Hrs) is a competition containing challenges in different domains of cybersecurity such as Forensics, Web Exploitation, Reverse Engineering, OSINT, etc…',
      image: 'https://amritacybernation.com/events/2022/img2/Picture1.jpg'
    },
    {
      title: 'Ideathon with cybersecurity',
      description: 'Ideathon with Cybersecurity – The theme will be given on the day of the event.',
      image: 'https://amritacybernation.com/events/2022/img2/Picture2.jpg'
    },
    {
      title: 'Scavenger Hunt',
      description: 'Scavenger Hunt: Quiz-like competition with clues given in the description. And this will be an individually participating competition. Questions will be based on web exploitation',
      image: 'https://amritacybernation.com/events/2022/img2/Picture4.jpg'
    },
    {
      title: 'Cybertrivia',
      description: 'Cybertrivia: An oral quiz competition that requires a team to participate in the event.',
      image: 'https://amritacybernation.com/events/2022/img2/Picture5.jpg'
    },
    {
      title: 'Debug the Code',
      description: 'Debug the Code: An individual event where each participant will be given a code with errors and they should find the errors and correct them.',
      image: 'https://amritacybernation.com/events/2022/img2/Picture3.jpg'
    },
    {
      title: 'Identify a Language',
      description: 'Identify a Language: An individual event where each participant will be given some program and the participant must identify the language.',
      image: 'https://amritacybernation.com/events/2022/img2/Picture6.jpg'
    },
    {
      title: 'Code in an Unknown Language',
      description: 'Code in an Unknown Language: An individual competition where participants need to learn a new language in less amount of time and write the code for the given problem.',
      image: 'https://amritacybernation.com/events/2022/img2/Picture7.jpg'
    }
  ];

  const industryMeetData: BoxItem[] = [
    {
      title: 'Mr. Venkatesh Natarajan',
      description: 'Digital Transformation Evangelist, Former Chief Digital Officer Ashok Leyland Limited, Chennai',
      image: 'https://amritacybernation.com/events/2022/img/c21.png'
    },
    {
      title: 'Dr. Manikantan Srinivasan',
      description: 'Assistant General Manager, NEC (Mobile networks Excellence Centre), Chennai, NEC Corporation India Private Limited',
      image: 'https://amritacybernation.com/events/2022/img/c18.jpg'
    },
    {
      title: 'Mr. Andrew David Bhagyam',
      description: 'Privacy Program Manager, Zoho Corp Chennai',
      image: 'https://amritacybernation.com/events/2022/img/c14.jpg'
    },
    {
      title: 'Mr. Aashish Vivekanand',
      description: 'Cloud Solution Architect, Trusted Services (Singapore)',
      image: 'https://amritacybernation.com/events/2022/img/c20.jpg'
    },
    {
      title: 'Mr Natarajan Swaminathan',
      description: 'Senior Consultant – Cyber Security practice ,Tata Consultancy Services',
      image: 'https://amritacybernation.com/events/2022/img/c17.jpg'
    },
    {
      title: 'Ms. Panchi S',
      description: 'Managing Director, YesPanchi Tech Services Pvt Ltd.',
      image: 'https://amritacybernation.com/events/2022/img/c19.jpg'
    }
  ];

  const cyberAbyaanData: BoxItem[] = [
    {
      title: "Cyber Abyaan'22",
      description: 'Most people are at least semi-aware that identity theft and network hacks are possible, and are reasonably good at not intentionally downloading malicious code or clicking dubious links. This event will focus on rural schools and villages to spread cyber awareness and basic training. The objective of this event is to initiate a social cyber consciousness drive to ensure that the rural population do not fall prey to malicious cyber attacks. This drive will also sensitise people on the corrective actions and support systems available in case of cyber related issues.',
      image: 'https://amritacybernation.com/events/2022/img/abyaan1.jpg'
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

        <SectionHeader id="cyber-tech-fest" title="Cyber Tech Fest'22" />
        <div className="custom-container">
          <BoxList data={cyberTechFestData} hasSlideshow={false} />
        </div>

        <SectionHeader id="industry-meet" title="Industry Meet" />
        <div className="custom-container">
          <BoxList data={industryMeetData} hasSlideshow={false} />
        </div>

        <SectionHeader id="cyber-abyaan" title="Cyber Abyaan'22" />
        <div className="custom-container">
          <BoxList data={cyberAbyaanData} hasSlideshow={false} />
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

export default Edition2022;