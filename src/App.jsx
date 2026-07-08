import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import KitchenPage from "./pages/KitchenPage";
import ReceptionPage from "./pages/ReceptionPage";
import SpaPage from "./pages/SpaPage";
import WelcomePage from "./pages/WelcomePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/18" replace />} />
        <Route path="/:umbrellaId" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/kitchen" element={<KitchenPage />} />
        <Route path="/reception" element={<ReceptionPage />} />
        <Route path="/spa" element={<SpaPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
      </Routes>
    </BrowserRouter>
  );
}