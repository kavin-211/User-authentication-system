import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const UserModule = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users')
      .then(res => setUsers(res.data))
      .catch(() => {/* handle errors */}
    );
  }, []);

  return (
    <div>
      <h2>Other Users</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Firstname</th><th>Lastname</th><th>Email</th><th>MobileNumber</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.firstname}</td><td>{u.lastname}</td><td>{u.email}</td><td>{u.mobileNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserModule;
