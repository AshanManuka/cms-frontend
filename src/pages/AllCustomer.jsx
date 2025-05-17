import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/customer/all')
      .then(res => setCustomers(res.data.body))
      .catch(err => console.error(err));
  }, []);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  
    setEditData({
      id: customer.id,
      name: customer.name,
      nic: customer.nic,
      dob: customer.dob.split('T')[0],
      mobileNumber: customer.mobileNumber,
      memberList: customer.memberList.map(m => m.id),
      addressList: customer.addressList.map(addr => ({
        lineOne: addr.lineOne,
        lineTwo: addr.lineTwo,
        cityId: addr.cityId || 1,
        countryId: addr.countryId || 1
      }))
    });
  
    setIsEditing(false);
  };
  

  const handleUpdateClick = (id) => {
    navigate(`/update/${id}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    axios.put('http://localhost:8080/customer/update', editData)
      .then(res => {
        alert("Customer updated successfully!");
        axios.get('http://localhost:8080/customer/all')
          .then(res => setCustomers(res.data.body));
        setSelectedCustomer(editData);
        setIsEditing(false);
      })
      .catch(err => {
        console.error(err);
        alert("Update failed.");
      });
  };

  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      <div style={{ width: '40%', borderRight: '1px solid #ccc', paddingRight: '20px' }}>
        <h2 style={{ fontWeight: '900' }}>All Customers</h2>
        {customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          customers.map(c => (
            <div key={c.id} style={{ marginBottom: '10px', cursor: 'pointer' }} onClick={() => handleCustomerClick(c)}>
              <hr />
              <strong>ID:</strong> {c.id}<br />
              <strong>Name:</strong> {c.name}<br />
              <strong>NIC:</strong> {c.nic}<br />
              <button style={{ backgroundColor: '#2a3801', borderRadius: '5px', padding: '5px', color: 'white', fontWeight: '700', marginTop: '10px' }}>
                View More
              </button>
            </div>
          ))
        )}
      </div>

      <div style={{ width: '60%', paddingLeft: '20px' }}>
        {selectedCustomer ? (
          <div>
            <h2 style={{ fontWeight: '900' }}>Customer Details</h2>

            {isEditing ? (
              <div>
              <label><strong>Name:</strong><br />
                <input type="text" name="name" value={editData.name} onChange={handleInputChange} />
              </label><br /><br />
            
              <label><strong>NIC:</strong><br />
                <input type="text" name="nic" value={editData.nic} onChange={handleInputChange} />
              </label><br /><br />
            
              <label><strong>DOB:</strong><br />
                <input type="date" name="dob" value={editData.dob} onChange={handleInputChange} />
              </label><br /><br />
            
              <label><strong>Mobile Numbers:</strong><br />
                {editData.mobileNumber.map((num, i) => (
                  <input
                    key={i}
                    type="text"
                    value={num}
                    onChange={(e) => {
                      const updatedNumbers = [...editData.mobileNumber];
                      updatedNumbers[i] = e.target.value;
                      setEditData(prev => ({ ...prev, mobileNumber: updatedNumbers }));
                    }}
                    style={{ display: 'block', marginBottom: '8px' }}
                  />
                ))}
              </label><br />
            
              <label><strong>Member IDs (comma separated):</strong><br />
                <input
                  type="text"
                  value={editData.memberList.join(',')}
                  onChange={(e) => {
                    const ids = e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                    setEditData(prev => ({ ...prev, memberList: ids }));
                  }}
                />
              </label><br /><br />
            
              <label><strong>Address:</strong><br />
                <input type="text" placeholder="Line One" value={editData.addressList[0].lineOne}
                  onChange={(e) => {
                    const addr = [...editData.addressList];
                    addr[0].lineOne = e.target.value;
                    setEditData(prev => ({ ...prev, addressList: addr }));
                  }} /><br />
                <input type="text" placeholder="Line Two" value={editData.addressList[0].lineTwo}
                  onChange={(e) => {
                    const addr = [...editData.addressList];
                    addr[0].lineTwo = e.target.value;
                    setEditData(prev => ({ ...prev, addressList: addr }));
                  }} /><br />
                <input type="number" placeholder="City ID" value={editData.addressList[0].cityId}
                  onChange={(e) => {
                    const addr = [...editData.addressList];
                    addr[0].cityId = parseInt(e.target.value);
                    setEditData(prev => ({ ...prev, addressList: addr }));
                  }} /><br />
                <input type="number" placeholder="Country ID" value={editData.addressList[0].countryId}
                  onChange={(e) => {
                    const addr = [...editData.addressList];
                    addr[0].countryId = parseInt(e.target.value);
                    setEditData(prev => ({ ...prev, addressList: addr }));
                  }} />
              </label><br /><br />
            
              <button onClick={handleSave} style={{ marginRight: '10px' }}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
            
            ) : (
              <div>
                <p><strong>ID:</strong> {selectedCustomer.id}</p>
                <p><strong>Name:</strong> {selectedCustomer.name}</p>
                <p><strong>NIC:</strong> {selectedCustomer.nic}</p>
                <p><strong>DOB:</strong> {new Date(selectedCustomer.dob).toLocaleDateString()}</p>

                <p><strong>Mobile Numbers:</strong></p>
                <ul>
                  {selectedCustomer.mobileNumber.map((num, i) => <li key={i}>{num}</li>)}
                </ul>

                <p><strong>Members:</strong></p>
                <ul>
                  {selectedCustomer.memberList.map(member => (
                    <li key={member.id}>{member.name}</li>
                  ))}
                </ul>

                <p><strong>Addresses:</strong></p>
                <ul>
                  {selectedCustomer.addressList.map(addr => (
                    <li key={addr.id}>{addr.lineOne}, {addr.lineTwo}, {addr.cityName}, {addr.countryName}</li>
                  ))}
                </ul>

                <button style={{backgroundColor: '#e9c9ff', border: '1px solid', borderRadius:'5px', padding:'5px', fontWeight:'700', width:'40vw'}} onClick={() => handleUpdateClick(selectedCustomer.id)}>Update</button>
              </div>
            )}
          </div>
        ) : (
          <p>Select a customer to view details</p>
        )}
      </div>
    </div>
  );
};

export default AllCustomers;
