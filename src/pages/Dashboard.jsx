import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
      <h1 className="mb-4">Customer Management Dashboard</h1>
      
      <div className="d-grid gap-3 col-6 mx-auto">
        <button className="btn btn-lg" style={{fontWeight: 700, backgroundColor: '#021424', color:'white'}} onClick={() => navigate('/register')}>
          Register Customer
        </button>
        <button className="btn btn-success btn-lg" style={{fontWeight: 700, backgroundColor: '#170224', color:'white'}} onClick={() => navigate('/customers')}>
          All Customers
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
