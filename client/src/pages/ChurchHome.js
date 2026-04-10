import React from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import Amharic from '../components/Amharic';

function ChurchHome() {
  return (
    <div className="bg-white">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Welcome Section */}
      <section className="py-16 bg-white">
        <div className="max-w-content mx-auto px-4 text-center">
          <h2 className="text-3xl font-light text-teal-accent mb-6">
            Welcome to Nighttime Service
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-3xl mx-auto mb-8">
            We are an independent community resource for Ethiopian Orthodox Tewahedo Church members 
            in the DFW area. This site is an amalgamation of community knowledge to help members 
            find a Nesiha Abat and understand how to run and maintain an EOTC church. Join us this{' '}
            <a href="#" className="text-teal-accent hover:underline">Sunday</a> as we serve our community.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="border border-gray-600 text-gray-600 rounded-full px-6 py-2 text-xs uppercase tracking-wider hover:bg-teal-accent hover:text-white hover:border-teal-accent transition-all">
              About Us
            </button>
            <button className="border border-gray-600 text-gray-600 rounded-full px-6 py-2 text-xs uppercase tracking-wider hover:bg-teal-accent hover:text-white hover:border-teal-accent transition-all">
              New to Community?
            </button>
          </div>
        </div>
      </section>

      {/* Three Panel Section */}
      <section className="grid grid-cols-1 md:grid-cols-3">
        {/* Panel 1 - Worship */}
        <div className="relative h-80 bg-gray-800 overflow-hidden group">
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all"></div>
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <h3 className="text-white text-4xl font-light mb-6">Worship</h3>
            <button className="border-2 border-white text-white rounded-full px-6 py-2 text-sm hover:bg-white hover:text-gray-800 transition-all">
              What we believe
            </button>
          </div>
        </div>

        {/* Panel 2 - Connect */}
        <div className="relative h-80 bg-gray-700 overflow-hidden group">
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all"></div>
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <h3 className="text-white text-4xl font-light mb-6">Connect</h3>
            <button className="border-2 border-white text-white rounded-full px-6 py-2 text-sm hover:bg-white hover:text-gray-800 transition-all">
              Getting involved
            </button>
          </div>
        </div>

        {/* Panel 3 - Learn */}
        <div className="relative h-80 bg-gray-600 overflow-hidden group">
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all"></div>
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <h3 className="text-white text-4xl font-light mb-6">Learn</h3>
            <Link
              to="/knowledge-base"
              className="border-2 border-white text-white rounded-full px-6 py-2 text-sm hover:bg-white hover:text-gray-800 transition-all"
            >
              Knowledge base
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-white">
        <div className="max-w-content mx-auto px-4">
          <h2 className="text-3xl font-light text-teal-accent text-center mb-12">
            How to find us
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1 - The blind leading the blind (English) */}
            <div className="text-center">
              <div className="h-56 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-green-primary to-green-secondary"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">The blind leading the blind</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 px-2">
                Find a spiritual father confessor in the DFW area. Filter by language 
                and church to find your Aba.
              </p>
              <Link
                to="/nesiha-abat"
                className="inline-block border border-gray-600 text-gray-600 rounded-full px-6 py-2 text-xs hover:bg-teal-accent hover:text-white hover:border-teal-accent transition-all"
              >
                Read more
              </Link>
            </div>

            {/* Card 2 - Amharic version */}
            <div className="text-center">
              <div className="h-56 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-teal-accent to-green-secondary"></div>
              </div>
              <Amharic className="text-lg font-medium text-gray-800 mb-3 block">ዐይነ ስውር ዐይነ ስውር ሲመራ</Amharic>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 px-2">
                Connect with other EOTC members in your area. Join a Mahber or 
                community prayer group near you.
              </p>
              <Link
                to="/nesiha-abat"
                className="inline-block border border-gray-600 text-gray-600 rounded-full px-6 py-2 text-xs hover:bg-teal-accent hover:text-white hover:border-teal-accent transition-all"
              >
                Read more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Section - Our Community */}
      <section className="bg-dark-green py-16">
        <div className="max-w-content mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left - Image with gradient */}
            <div className="relative h-80 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-primary/70 to-gold-accent/50"></div>
              <div className="relative h-full flex items-center justify-center">
                <svg className="w-32 h-32 text-white opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            {/* Right - Text */}
            <div>
              <h2 className="text-3xl font-light text-white mb-4">Our community:</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                If you decide to connect with one of our Nesiha Abat or attend a service, you 
                can expect a very warm welcome. Our community is here to guide you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="bg-gold-dark py-3">
        <div className="max-w-content mx-auto px-4 text-center">
          <p className="text-white text-xs">
            This site is not officially endorsed by the Ethiopian Orthodox Tewahedo Church. Community resource only.
          </p>
        </div>
      </section>
    </div>
  );
}

export default ChurchHome;
