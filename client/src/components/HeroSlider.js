import React, { useState, useEffect } from 'react';
import Amharic from './Amharic';

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      quote: "The blind leading the blind.",
      isAmharic: false,
      sub: "Nighttime Service community knowledge base",
      button: "Get started",
      link: "/nesiha-abat"
    },
    {
      quote: "ዐይነ ስውር ዐይነ ስውር ሲመራ",
      isAmharic: true,
      sub: "Ethiopian Orthodox Tewahedo · DFW Area",
      button: "Get started",
      link: "/nesiha-abat"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-96 overflow-hidden bg-gray-800">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-primary/60 to-green-secondary/60"></div>
      
      {/* Slide content */}
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl">
          {slides[currentSlide].isAmharic ? (
            <Amharic className="text-4xl md:text-5xl text-white italic mb-4 leading-relaxed">
              "{slides[currentSlide].quote}"
            </Amharic>
          ) : (
            <h1 className="text-4xl md:text-5xl text-white italic font-serif mb-4 leading-relaxed">
              "{slides[currentSlide].quote}"
            </h1>
          )}
          <p className="text-white text-sm md:text-base mb-6 opacity-90">
            {slides[currentSlide].sub}
          </p>
          <a
            href={slides[currentSlide].link}
            className="inline-block border-2 border-white text-white rounded-full px-6 py-2 text-sm hover:bg-white hover:text-green-primary transition-all"
          >
            {slides[currentSlide].button}
          </a>
        </div>
      </div>

      {/* Previous button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full border-2 border-white transition-all ${
              currentSlide === index ? 'bg-white' : 'bg-transparent'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroSlider;
