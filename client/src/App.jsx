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
import StoresPage from "./components/StoresDetails/StoresPage";
import OwnerDashboardPage from "./components/OwnerDash/OwnerDashBoardPage";
import AddUser from "./components/Admin/AddUser";
import StoreDetails from "./components/StoresDetails/StoreDetails";
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
              <Route path="/storeowner" element={<OwnerDashboardPage />} />
            </>
          ): <></>
        )}
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/storedetails" element={<StoreDetails />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
