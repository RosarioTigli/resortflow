import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import KitchenPage from "./pages/KitchenPage";
import ReceptionPage from "./pages/ReceptionPage";
import SpaPage from "./pages/SpaPage";
import WelcomePage from "./pages/WelcomePage";
import AdminMenuPage from "./pages/AdminMenuPage";
import RestaurantHomePage from "./pages/RestaurantHomePage";
import RestaurantAdminPage from "./pages/RestaurantAdminPage";

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
        <Route path="/admin/menu" element={<AdminMenuPage />} />
        <Route path="/restaurant" element={<RestaurantHomePage />} />
        <Route path="/restaurant/admin" element={<RestaurantAdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}