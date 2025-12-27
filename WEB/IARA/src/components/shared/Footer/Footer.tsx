/**
 * Footer Component
 * Application footer with copyright and version info
 */

import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <p className="footer-copyright">
            © {currentYear} EAFA (IARA) - Executive Agency for Fisheries and Aquaculture. All rights reserved.
          </p>
        </div>
        <div className="footer-section">
          <p className="footer-version">Version 1.0.0</p>
        </div>
        <div className="footer-section">
          <a href="https://www.iara.government.bg" target="_blank" rel="noopener noreferrer" className="footer-link">
            Official Website
          </a>
        </div>
      </div>
    </footer>
  );
};
