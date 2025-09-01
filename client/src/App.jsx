import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login/Login";
import Signup from "./components/Auth/Signup/Signup";
import AboutPage from "./components/AboutUs/AboutPage";
import ContactPage from "./components/ContactUs/ContactPage";
import { Navbar } from "./components/Nav/Navbar";
import HomePage from "./components/HeroSection/HomePage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Footer from "./components/Footer/Footer";
import StoresContainer from "./components/StoresDetails/StoresContainer"; // Import your new container
import OwnerDashboardPage from "./components/OwnerDash/OwnerDashBoardPage";
import AddUser from "./components/Admin/AddUser";
import { useContext } from "react";
import { UserContext } from "./context/userContextProvider";

function App() {
  const { user } = useContext(UserContext);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {user?.role === "ADMIN" ? (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/adduser" element={<AddUser />} />
          </>
        ) : (
          user?.role ===
          "OWNER" ? (
            <>
               <Route path="/storeowner/dashboard" element={<OwnerDashboardPage />} />
            </>
          ): <></>
        )}
        {/* Replace both store routes with the container that handles navigation */}
        <Route path="/stores" element={<StoresContainer />} />
        <Route path="/stores/:storeId" element={<StoresContainer />} />
       
      </Routes>
      <Footer />
    </>
  );
}

export default App;