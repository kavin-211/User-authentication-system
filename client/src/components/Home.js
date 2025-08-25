import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get('/users/me')
      .then(res => setUser(res.data))
      .catch(() => {/* handle errors if any */});
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome, {user.firstname} {user.lastname}</h2>
      <div>
        <p><strong>Firstname:</strong> {user.firstname}</p>
        <p><strong>Lastname:</strong> {user.lastname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Mobile:</strong> {user.mobileNumber}</p>
      </div>
    </div>
  );
};

export default Home;
