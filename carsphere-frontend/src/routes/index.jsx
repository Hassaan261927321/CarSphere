import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import CustomerCarePage from '../pages/CustomerCarePage';
import FaqPage from '../pages/FaqPage';
import MarketplacePage from '../pages/MarketplacePage';
import VehicleDetailsPage from '../pages/VehicleDetailsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import MechanicProfilePage from '../pages/MechanicProfilePage';
import AppointmentHistoryPage from '../pages/AppointmentHistoryPage';
import MechanicAppointmentsPage from '../pages/MechanicAppointmentsPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import SparePartsPage from '../pages/SparePartsPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailsPage from '../pages/OrderDetailsPage';
import PrivateRoute from '../utils/PrivateRoute';
import MyListingsPage from '../pages/MyListingsPage';
import CreateListingPage from '../pages/CreateListingPage';
import EditListingPage from '../pages/EditListingPage';
import PaymentSuccess from '../pages/PaymentSuccess';   
import PaymentFailed from '../pages/PaymentFailed';     



const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} /> 
      <Route path="/payment-failed" element={<PaymentFailed />} />     
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
        <Route path="/appointments" element={<AppointmentHistoryPage />} />
        <Route path="/mechanic/:id" element={<MechanicProfilePage />} />
        <Route path="/spare-parts" element={<SparePartsPage />} />
        <Route path="/my-listings" element={<MyListingsPage />} />
        <Route path="/listings/new" element={<CreateListingPage />} />
        <Route path="/listings/edit/:id" element={<EditListingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/customer-care" element={<CustomerCarePage />} />
        <Route path="/contact" element={<CustomerCarePage />} />
        <Route path="/faq" element={<FaqPage />} />

      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mechanic-appointments" element={<MechanicAppointmentsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />

        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;