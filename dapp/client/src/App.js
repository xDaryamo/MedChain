// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import RecordHome from "./pages/RecordHome";
import RecordPage from "./pages/RecordPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/records" element={<RecordHome />} />
          <Route path="/records/:id" element={<RecordPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
