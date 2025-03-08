import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Header = () => {
    const primaryColor = 'rgb(52, 152, 219)';
    const secondaryColor = 'rgb(41, 128, 185)'; // Slightly darker for depth

    return (
        <div
            className="flex flex-col md:flex-row items-center justify-between rounded-xl px-6 md:px-12 lg:px-20 py-10 md:py-16 shadow-xl my-8 mx-4 md:mx-8 lg:mx-12 relative overflow-hidden"
            style={{ 
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
            }}
        >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-5 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white opacity-5 -ml-16 -mb-16"></div>
            
            {/* --------- Header Right (Image) - Now first on mobile --------- */}
            <div className="w-full md:w-1/2 mb-8 md:mb-0 md:order-2 md:pl-6 lg:pl-10 flex justify-center md:justify-end relative z-10">
                <div className="relative max-w-md w-full">
                    {/* Image with subtle border */}
                    <div className="rounded-xl overflow-hidden shadow-xl" style={{ border: '4px solid rgba(255, 255, 255, 0.2)' }}>
                        <img
                            className="w-full object-cover object-center"
                            src={assets.header_img}
                            alt="Dr. Vidya Kollu"
                            style={{ maxHeight: '500px' }}
                        />
                    </div>
                    
                    {/* Optional: Floating credential badge */}
                    <div className="absolute -bottom-3 right-8 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Board Certified
                        </div>
                    </div>
                </div>
            </div>

            {/* --------- Header Left (Text) - Now second on mobile --------- */}
            <div className="w-full md:w-1/2 md:order-1 flex flex-col items-start justify-center md:pr-8 lg:pr-12 relative z-10">
                {/* Optional: Small badge-like element */}
                <div className="bg-white bg-opacity-20 text-white text-sm px-4 py-1 rounded-full mb-6 inline-flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                    Oncology Specialist
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight mb-6">
                    Book Appointment<br className="hidden lg:block" /> with Dr. Vidya Kollu, MD
                </h1>
                
                <div className="mb-8">
                    <p className="text-white text-base md:text-lg leading-relaxed max-w-lg">
                        Cancer doc! Triple Board certified. I help diagnose & treat blood disorders and cancer in adults. Views are my own.
                    </p>
                </div>

                <Link
                    to="/doctors"
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-lg rounded-full shadow-md transition-all group"
                    style={{ 
                        color: primaryColor, 
                        padding: '0.75rem 1.75rem', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    Book Appointment
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default Header;