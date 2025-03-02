import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArtifacts = async () => {
      try {
        const artifacts = await import('../artifacts.json');
        setArtifacts(artifacts.default);
        setLoading(false);
      } catch (err) {
        setError('Failed to load artifacts. Please try again later.');
        setLoading(false);
      }
    };

    loadArtifacts();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading artifacts...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <header className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-6xl font-bold mb-4 tracking-tight">AI generated artifacts</h1>
          <h2 className="text-2xl text-gray-600">Set Kyar Wa Lar's Playground with AI tools</h2>
        </header>

        {artifacts.length === 0 ? (
          <p className="text-center text-gray-600">No artifacts found. Add some to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {artifacts.map(artifact => (
              <div 
                key={artifact.id} 
                className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="mb-8">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">ARTIFACT</div>
                  <h3 className="text-2xl font-semibold mb-3">{artifact.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{artifact.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{artifact.date}</span>
                  <Link 
                    to={`/${artifact.id}`}
                    className="inline-flex items-center gap-2 text-black hover:opacity-70 transition-opacity font-medium"
                  >
                    View Artifact
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
