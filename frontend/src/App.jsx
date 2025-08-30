import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Welcome to MERN Notes App</div>} />
      {/* Add more routes as features are implemented */}
    </Routes>
  );
}

export default App;
