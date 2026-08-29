import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FloatingBackground from "./components/FloatingBackground";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import RecipeDetail from "./pages/RecipeDetail";
import WhatCanICook from "./pages/WhatCanICook";

export default function App() {
  return (
    <div className="min-h-screen">
      <FloatingBackground />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/what-can-i-cook" element={<WhatCanICook />} />
      </Routes>
    </div>
  );
}
