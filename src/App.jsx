import { useState } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import NormalNavbar from './Components/LandingPageNavbar/LandingPageNavbar';
import CommunityNavbar from './Components/CommunityNavbar/CommunityNavbar';
import HomePage from './Pages/CommunitySection/HomePage';
import Projects from './Pages/Projects/Projects';
import About from './Pages/About/About';
import FAQ from './Pages/FAQ/FAQ';
import ContactUs from './Pages/ContactUs/ContactUs';

function App() {
  const [count, setCount] = useState(0);

  const LayoutWithNavbarForVisitors = () => {
    return (
      <>
        <NormalNavbar />
        <Outlet />
      </>
    );
  };

  const LayoutWithNavbarInCommunity = () => {
    return (
      <>
        <CommunityNavbar />
        <Outlet />
      </>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout for Visitors */}
        <Route element={<LayoutWithNavbarForVisitors />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<ContactUs />} />
        </Route>

        {/* Layout for Community */}
        <Route element={<LayoutWithNavbarInCommunity />}>
          <Route path="/community" element={<HomePage />} /> 

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
