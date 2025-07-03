import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import LandingPage from './Pages/LandingPage/LandingPage'
import NormalNavbar from './Components/NormalNavbar/NormalNavbar'
import CommunityNavbar from './Components/CommunityNavbar/CommunityNavbar'
import HomePage from './Pages/Community/HomePage'


function App() {
  const [count, setCount] = useState(0)

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
        <Route element={<LayoutWithNavbarForVisitors/>}/> 
          <Route index element={<LandingPage />} />


        <Route element={<LayoutWithNavbarInCommunity/>}/> 
         <Route path='/community' element={<HomePage />} />
      </Routes>
   </BrowserRouter> 
  )
}

export default App
