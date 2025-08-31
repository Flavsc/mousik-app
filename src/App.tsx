import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout/MainLayout";

// Importação das páginas
import Home from "./pages/Home/Home";
import Studio from "./pages/Studio/Studio";
import Gallery from "./pages/Gallery/Gallery";
import About from "./pages/About/About";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="studio" element={<Studio />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="about" element={<About />} />
          <Route path="account" element={<Profile />} />
          {/* Rota "catch-all" para páginas não encontradas */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
