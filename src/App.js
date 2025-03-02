import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import ArtifactView from './components/ArtifactView';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:artifactId" element={<ArtifactView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
