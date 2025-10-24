import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { WhatsAppChat } from "./components/WhatsAppChat";
import { Landing } from "./pages/Landing";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/courses" element={<div className="pt-32 pb-20 px-4 text-center"><h1 className="text-4xl font-bold">Courses Page - Coming Soon</h1></div>} />
          <Route path="/about" element={<div className="pt-32 pb-20 px-4 text-center"><h1 className="text-4xl font-bold">About Page - Coming Soon</h1></div>} />
          <Route path="/contact" element={<div className="pt-32 pb-20 px-4 text-center"><h1 className="text-4xl font-bold">Contact Page - Coming Soon</h1></div>} />
          <Route path="/login" element={<div className="pt-32 pb-20 px-4 text-center"><h1 className="text-4xl font-bold">Login Page - Coming Soon</h1></div>} />
          <Route path="/register" element={<div className="pt-32 pb-20 px-4 text-center"><h1 className="text-4xl font-bold">Register Page - Coming Soon</h1></div>} />
        </Routes>
        <Footer />
        <WhatsAppChat />
      </BrowserRouter>
    </div>
  );
}

export default App;
