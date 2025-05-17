import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RegisterCustomer from './pages/RegisterCustomer';
import AllCustomer from './pages/AllCustomer';
import EditCustomer from './pages/EditCustomer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<RegisterCustomer />} />
        <Route path="/customers" element={<AllCustomer />} />
        <Route path="/update/:customerId" element={<EditCustomer />} />

      </Routes>
    </Router>
  );
}

export default App;
