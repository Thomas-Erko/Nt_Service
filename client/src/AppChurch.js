import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChurchHeader from './components/ChurchHeader';
import ChurchFooter from './components/ChurchFooter';

const ChurchHome = lazy(() => import('./pages/ChurchHome'));
const NewNesihaAbat = lazy(() => import('./pages/NewNesihaAbat'));
const ClergyDetail = lazy(() => import('./pages/ClergyDetail'));
const Resources = lazy(() => import('./pages/Resources'));
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase'));
const AllBlogs = lazy(() => import('./pages/AllBlogs'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function AppChurch() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <ChurchHeader />
        <main className="flex-grow">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<ChurchHome />} />
              <Route path="/nesiha-abat" element={<NewNesihaAbat />} />
              <Route path="/clergy/:id" element={<ClergyDetail />} />
              <Route path="/resources" element={<Resources />} />
              {/* Blog/Knowledge Base Routes - Completely separate from clergy system */}
              <Route path="/knowledge-base" element={<KnowledgeBase />} />
              <Route path="/knowledge-base/all" element={<AllBlogs />} />
              <Route path="/knowledge-base/:id" element={<BlogPost />} />
            </Routes>
          </Suspense>
        </main>
        <ChurchFooter />
      </div>
    </Router>
  );
}

export default AppChurch;
