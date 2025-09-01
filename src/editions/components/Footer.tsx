import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-content" id="footer">
        <div className="footer-left">
          <a href="/index.html" className="logo2">
            <img src="/images/Welcome.jpg" alt="Logo" loading="lazy" />
          </a>
        </div>
        <div className="footer-divider"></div>
        <div className="address">
          <h4>OUR ADDRESS</h4>
          <p>
            Amrita Vishwa Vidyapeetham<br />
            Chennai Campus<br />
            Vengal<br />
            Chennai - 601 103<br />
            Tamilnadu, India
          </p>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-nav">
          <ul>
            <li><a href="/index.html">HOME</a></li>
            <li><a href="/meetup/meetup.html">TEAM</a></li>
            <li><a href="/events/2024/event-2024.html">EVENTS 3.0</a></li>
          </ul>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-right">
          <a 
            href="https://www.instagram.com/amrita_cybernation?igsh=MTVyd3hhcG5tZjJkeQ" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fab fa-instagram"
          ></a>
          <a 
            href="https://x.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="fab fa-twitter"
          ></a>
          <a 
            href="https://www.facebook.com/chennaicampus/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="fab fa-facebook-f"
          ></a>
          <a 
            href="https://www.linkedin.com/company/amrita-cybernation/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="fab fa-linkedin-in"
          ></a>
        </div>
      </div>
      <h4>
        For any Queries, Mail at <span style={{ color: '#b22049', fontWeight: 'bold' }}>amritacybernation.ch.amrita.edu</span>.
      </h4>
    </footer>
  );
};

export default Footer;