/**
 * Loading Component
 * Loading spinner with optional text
 */

import React from 'react';
import logo from '../../../assets/logo.png';
import './Loading.css';

interface LoadingProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  text,
  size = 'medium',
  fullScreen = false,
}) => {
  const content = (
    <div className="loading-content">
      <img 
        src={logo} 
        alt="EAFA (IARA) Logo" 
        className="loading-logo"
      />
      <div className={`loading-spinner ${size}`} />
      {text && <p className="loading-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="loading-fullscreen">{content}</div>;
  }

  return <div className="loading-inline">{content}</div>;
};
