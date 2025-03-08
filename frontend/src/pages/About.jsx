import React from 'react';

const About = () => {
    return (
        <div className="bg-gradient-to-b from-white to-blue-50 py-20">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">

                {/* Section 1: Title */}
                <div className="mb-16 text-center">
                    <h1 className="text-4xl font-extrabold text-blue-800 sm:text-5xl mb-4">
                        Dr. Vidya Kollu
                    </h1>
                    <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
                    <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                        Medical Oncologist & Hematologist with a commitment to accessible, 
                        compassionate, and comprehensive patient care.
                    </p>
                </div>

                {/* Section 2: Bio - Now fullwidth without image */}
                <div className="max-w-3xl mx-auto mb-16">
                    <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-700">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                            Professional Background
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            Dr. Vidya Kollu, MD, is a Medical Oncologist/Hematology specialist with extensive experience, 
                            particularly as a bone marrow transplant Hospitalist. She is deeply passionate about delivering 
                            world-class cancer care within the community and providing authentic, comprehensive patient education. 
                            Her commitment extends to making cancer care more affordable and empowering both patients and women, 
                            especially those navigating challenging relationships.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            Dr. Kollu is also dedicated to helping non-US IMGs pursue residency/fellowship opportunities. 
                            She inspires, educates, and champions healthcare equality.
                        </p>
                    </div>
                </div>

                {/* Simplified Professional Links Section */}
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Let's Connect</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            <a href="https://www.linkedin.com/in/vidya-kollu-md-026a2340/" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="px-6 py-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                                LinkedIn
                            </a>
                            <a href="https://scholar.google.co.in/citations?user=9zk0lAsAAAAJ&hl=en" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="px-6 py-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                                Google Scholar
                            </a>
                            <a href="https://x.com/KolluVidya" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="px-6 py-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                                Twitter
                            </a>
                            <a href="https://www.instagram.com/vidya_kollu/" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="px-6 py-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                                Instagram
                            </a>
                            <a href="https://creators.spotify.com/pod/show/vidya-kollu2019" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="px-6 py-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                                Podcast
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;