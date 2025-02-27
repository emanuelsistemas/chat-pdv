import React from 'react';

const Logo = () => {
  return (
    <div className="text-center mb-5">
      <div className="logo-icon mb-1 flex justify-center items-center gap-3">
        <div className="relative">
          <div className="relative animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
                className="text-gray-800 dark:text-gray-100">
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
            <div className="absolute inset-0 bg-accent-300/20 dark:bg-accent-200/20 blur-2xl rounded-full -z-10"></div>
          </div>
          <div className="absolute -top-2 -right-2 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
                className="text-gray-800 dark:text-gray-100">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        </div>
      </div>
      <h1 className="font-pacifico text-3xl md:text-4xl text-gray-800 dark:text-white m-0 -mt-1">
        ChatFood
      </h1>
    </div>
  );
};

export default Logo;
