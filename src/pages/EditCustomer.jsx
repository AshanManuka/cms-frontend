import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditCustomer = () => {
  const { customerId } = useParams();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    dob: '',
    nic: '',
    mobileNumber: [''],
    memberList: [],
    addressList: [{ lineOne: '', lineTwo: '', cityId: '', countryId: '' }],
  });

  const [allCustomers, setAllCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [citiesByCountry, setCitiesByCountry] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8080/customer/all')
      .then(res => {
        setAllCustomers(res.data.body);
      }).catch(console.error);

    axios.get('http://localhost:8080/customer/get-countries')
      .then(res => {
        setCountries(res.data.body);
      }).catch(console.error);

    axios.get(`http://localhost:8080/customer/single?customerId=${customerId}`)
    .then(res => {
        const data = res.data.body;
      
        const memberIds = data.memberList?.map(member => member.id) || [];
      
        const updatedAddresses = data.addressList?.map(address => {
          // const country = countries.find(c => c.name === address.countryName);
          // const countryId = country?.id || '';
      
          // const cityList = citiesByCountry[countryId] || [];
          // const city = cityList.find(city => city.name === address.cityName);
          // const cityId = city?.id || '';

          const countryId = 1;
          const cityId = 1;
      
          return {
            lineOne: address.lineOne || '',
            lineTwo: address.lineTwo || '',
            cityId,
            countryId
          };
        }) || [{ lineOne: '', lineTwo: '', cityId: '', countryId: '' }];
      
        setFormData({
          id: data.id,
          name: data.name || '',
          dob: data.dob?.split('T')[0] || '',
          nic: data.nic || '',
          mobileNumber: data.mobileNumber?.length ? data.mobileNumber : [''],
          memberList: memberIds,
          addressList: updatedAddresses
        });
      })
      .catch(console.error);
  }, [customerId]);

  useEffect(() => {
    const result = allCustomers.filter(c =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.nic?.includes(search)
    );
    setFilteredCustomers(result);
  }, [search, allCustomers]);

  const handleChange = (e, index, field, listName) => {
    const updatedList = [...formData[listName]];
    updatedList[index][field] = e.target.value;
    setFormData({ ...formData, [listName]: updatedList });
  };

  const handleMobileChange = (e, index) => {
    const mobiles = [...formData.mobileNumber];
    mobiles[index] = e.target.value;
    setFormData({ ...formData, mobileNumber: mobiles });
  };

  const handleCountryChange = async (e, index) => {
    const selectedCountryId = e.target.value;
    const updatedAddresses = [...formData.addressList];
    updatedAddresses[index].countryId = selectedCountryId;
    updatedAddresses[index].cityId = '';
    setFormData({ ...formData, addressList: updatedAddresses });

    if (!citiesByCountry[selectedCountryId]) {
      try {
        const res = await axios.get(`http://localhost:8080/customer/cities-by-country?countryId=${selectedCountryId}`);
        setCitiesByCountry(prev => ({ ...prev, [selectedCountryId]: res.data.body }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const addAddress = () => {
    setFormData({
      ...formData,
      addressList: [...formData.addressList, { lineOne: '', lineTwo: '', cityId: '', countryId: '' }]
    });
  };

  const addMobile = () => {
    setFormData({ ...formData, mobileNumber: [...formData.mobileNumber, ''] });
  };

  const addToMemberList = (id) => {
    if (!formData.memberList.includes(id)) {
      setFormData({ ...formData, memberList: [...formData.memberList, id] });
    }
  };

  const removeFromMemberList = (id) => {
    setFormData({ ...formData, memberList: formData.memberList.filter(mid => mid !== id) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/customer/update`, formData);
      alert('Customer updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Error while updating customer.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 style={{ fontWeight: '900' }}>Update Customer</h2>
      <div className="row">
        <div className="col-md-7">
          <form onSubmit={handleSubmit}>
        
            <div className="mb-3">
              <label>Name:</label>
              <input type="text" className="form-control" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div className="mb-3">
              <label>Date of Birth:</label>
              <input type="date" className="form-control" value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })} required />
            </div>

            <div className="mb-3">
              <label>NIC:</label>
              <input type="text" className="form-control" value={formData.nic}
                onChange={(e) => setFormData({ ...formData, nic: e.target.value })} required />
            </div>

            <div className="mb-3">
              <label>Mobile Numbers:</label>
              {formData.mobileNumber.map((number, index) => (
                <input key={index} type="text" className="form-control mb-2" value={number}
                  onChange={(e) => handleMobileChange(e, index)} required />
              ))}
              <button type="button" className="btn btn-secondary mt-1" onClick={addMobile}>+ Add Mobile</button>
            </div>

            <div className="mb-3">
              <label>Addresses:</label>
              {formData.addressList.map((address, index) => (
                <div key={index} className="border p-3 mb-2 rounded bg-light">
                  <input type="text" className="form-control mb-2" placeholder="Line One"
                    value={address.lineOne} onChange={(e) => handleChange(e, index, 'lineOne', 'addressList')} required />
                  <input type="text" className="form-control mb-2" placeholder="Line Two"
                    value={address.lineTwo} onChange={(e) => handleChange(e, index, 'lineTwo', 'addressList')} />
                  <select className="form-control mb-2"
                    value={address.countryId}
                    onChange={(e) => handleCountryChange(e, index)} required>
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                  <select className="form-control"
                    value={address.cityId}
                    onChange={(e) => handleChange(e, index, 'cityId', 'addressList')} required>
                    <option value="">Select City</option>
                    {(citiesByCountry[address.countryId] || []).map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>
              ))}
              <button type="button" className="btn btn-secondary mt-1" onClick={addAddress}>+ Add Address</button>
            </div>

            <button style={{ fontWeight: '700', backgroundColor: '#01382b', border: '0', width: '40vw' }}
              type="submit" className="btn btn-primary">Update</button>
          </form>
        </div>

        <div className="col-md-5">
          <div className="mb-3">
            <label>Search Customers (to update Family Members):</label>
            <input type="text" className="form-control" placeholder="Search by name or NIC"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <ul className="list-group mb-3">
            {filteredCustomers.map(c => (
              <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{c.name} ({c.nic})</span>
                {formData.memberList.includes(c.id) ? (
                  <button className="btn btn-sm btn-danger" onClick={() => removeFromMemberList(c.id)}>Remove</button>
                ) : (
                  <button className="btn btn-sm btn-success" onClick={() => addToMemberList(c.id)}>Add</button>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-3">
            <h6>Selected Member IDs:</h6>
            <p>{formData.memberList.join(', ') || 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;
