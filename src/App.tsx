import "./App.css";
import "./index.css"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout  from './layout/MainLayout';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Rutas protegidas */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/productos" />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        {/* Redirección por defecto */}
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
