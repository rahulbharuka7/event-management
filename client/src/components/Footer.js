import React from 'react';
import { Linkedin } from 'lucide-react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          Designed and Developed by{' '}
          <a 
            href="https://www.linkedin.com/in/rahulbharuka/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            <strong>Rahul Bharuka</strong>
            <Linkedin size={16} className="linkedin-icon" />
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
