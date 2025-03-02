import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';

function ArtifactView() {
  const { artifactId } = useParams();
  const [artifact, setArtifact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArtifact = async () => {
      try {
        const artifacts = await import('../artifacts.json');
        const artifact = artifacts.default.find(a => a.id === artifactId);
        if (!artifact) {
          throw new Error('Artifact not found');
        }
        setArtifact(artifact);
        document.title = artifact.title;
        setLoading(false);
      } catch (err) {
        setError('Artifact not found or failed to load. Please check the URL and try again.');
        setLoading(false);
      }
    };

    loadArtifact();
  }, [artifactId]);

  if (loading) {
    return <div className="loading-message">Loading artifact...</div>;
  }

  if (error) {
    return (
      <div>
        <Link to="/" className="back-link">← Back to Artifacts</Link>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Artifacts
            </Link>
            <span className="text-sm text-gray-500">{artifact.date}</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-16">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
                <p className="text-gray-600">Loading artifact...</p>
              </div>
            </div>
          }
        >
          {React.createElement(
            lazy(() => import(`./artifacts/${artifact.componentName}`)),
            { key: artifact.id }
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default ArtifactView;
