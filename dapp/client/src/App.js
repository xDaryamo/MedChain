import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './Register';
import Authentication from './Login';

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <nav>
            <ul>
              <li>
                <Link to="/auth/signup">Register</Link>
              </li>
              <li>
                <Link to="/auth/login">Login</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/auth/signup" element={<Register />} />
            <Route path="/auth/login" element={<Authentication />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
