import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Home      from './pages/Home';
import LostItems from './pages/LostItems';
import Dashboard from './pages/Dashboard';
import Claims    from './pages/Claims';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Navigate to="/login" />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/home"       element={<Home />} />
        <Route path="/lost-items" element={<LostItems />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/claims"     element={<Claims />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;