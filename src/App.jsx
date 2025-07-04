import { useState } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import NormalNavbar from './Components/LandingPageNavbar/LandingPageNavbar';
import CommunityNavbar from './Components/CommunityNavbar/CommunityNavbar';
import HomePage from './Pages/Community/HomePage';

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
