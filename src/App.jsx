import { Outlet, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import NormalNavbar from "./Components/LandingPageNavbar/LandingPageNavbar";
import Footer from "./Components/Footer/Footer";
import ProtectedRoute from "./Context/ProtectedRoute";
import { AuthProvider } from "./Context/AuthContext";
import Login from "./Components/Login/Login";
import HomePage from "./Pages/CommunitySection/HomePage.jsx";
import Projects from "./Pages/Projects/Projects";
import About from "./Pages/About/About";
import FAQ from "./Pages/FAQ/FAQ";
import ContactUs from "./Pages/ContactUs/ContactUs";

function App() {
  const LayoutWithNavbarForVisitors = () => {
    return (
      <>
        <NormalNavbar />
        <Outlet />
        <Footer />
      </>
    );
  };

  const LayoutWithNavbarInCommunity = () => {
    return (
      <>
        <Outlet />
        <Footer />
      </>
    );
  };

  return (
    <AuthProvider>
      <Routes>
        <Route element={<LayoutWithNavbarForVisitors />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<LayoutWithNavbarInCommunity />}>
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;