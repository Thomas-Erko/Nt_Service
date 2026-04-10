import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold text-forest-green mb-4">
          <span className="amharic-text">የማታ አገልግሎት</span>
        </h1>
        <h2 className="text-4xl font-bold text-medium-green mb-8">
          Nighttime Service
        </h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          A community resource for Ethiopian Orthodox Tewahedo Church members and organizations
        </p>
      </section>

      <section className="max-w-4xl mx-auto mb-16">
        <div className="bg-amber/10 border-l-4 border-gold p-6 rounded-r-lg shadow-md">
          <h3 className="text-2xl font-bold text-forest-green mb-4">Important Disclaimer</h3>
          <p className="text-gray-800 leading-relaxed">
            This site is an independent community resource for Ethiopian Orthodox Tewahedo Church (EOTC) 
            members and organizations. It is an amalgamation of community knowledge intended to help members 
            understand the backend processes needed to run and maintain an EOTC church or organization. 
            <strong className="text-forest-green"> This site is NOT an official source endorsed by the 
            Ethiopian Orthodox Tewahedo Church or any of its governing bodies.</strong>
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mb-12">
        <h3 className="text-3xl font-bold text-medium-green mb-8 text-center">What We Offer</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4 text-center">📖</div>
            <h4 className="text-xl font-bold text-forest-green mb-3 text-center">
              Church Administration
            </h4>
            <p className="text-gray-700 text-center">
              Resources and guidance on managing church operations and administrative tasks
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4 text-center">⛪</div>
            <h4 className="text-xl font-bold text-forest-green mb-3 text-center">
              Clergy Directory
            </h4>
            <p className="text-gray-700 text-center">
              Find spiritual fathers (Nesiha Abat) in your area for confession and guidance
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4 text-center">📅</div>
            <h4 className="text-xl font-bold text-forest-green mb-3 text-center">
              Service Schedules
            </h4>
            <p className="text-gray-700 text-center">
              Information about church services, feast days, and organizational guidance
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-medium-green mb-6 text-center">
            Explore Our Resources
          </h3>
          <div className="space-y-4">
            <Link
              to="/nesiha-abat"
              className="block bg-forest-green hover:bg-medium-green text-white font-semibold py-4 px-6 rounded-lg transition-colors text-center text-lg"
            >
              Find a Nesiha Abat (Spiritual Father)
            </Link>
            <div className="text-center text-gray-500 text-sm">
              More sections coming soon...
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
