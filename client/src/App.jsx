import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login/Login";
import Signup from "./components/Auth/Signup/Signup";
import AboutPage from "./components/AboutUs/AboutPage";
import ContactPage from "./components/ContactUs/ContactPage";
import StoresList from "./components/Stores/StoresList";
import { Navbar } from "./components/Nav/Navbar";
import HomePage from "./components/HeroSection/HomePage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Footer from "./components/Footer/Footer";
import StoresPage from "./components/StoresDetails/StoresPage";
import OwnerDashboardPage from "./components/OwnerDash/OwnerDashBoardPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />   
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/storeowner" element={< OwnerDashboardPage />} />
        {/* <Route path="/storedetails" element={<StoresPage />} /> */}
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
