import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import NewFooter from './components/NewFooter';

const NewHome = lazy(() => import('./pages/NewHome'));
const NewNesihaAbat = lazy(() => import('./pages/NewNesihaAbat'));
const ClergyDetail = lazy(() => import('./pages/ClergyDetail'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<NewHome />} />
              <Route path="/nesiha-abat" element={<NewNesihaAbat />} />
              <Route path="/clergy/:id" element={<ClergyDetail />} />
            </Routes>
          </Suspense>
        </main>
        <NewFooter />
      </div>
    </Router>
  );
}

export default App;
