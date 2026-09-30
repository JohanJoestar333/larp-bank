import React from 'react';

// Status bar completely removed as requested:
// "dont show the phone time, hour and battery. it just needs to be the website it self."
export const IOSStatusBar: React.FC<{ theme?: 'light' | 'dark' }> = () => {
  return null;
};
