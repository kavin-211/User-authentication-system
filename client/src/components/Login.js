import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!data.email) errs.email = 'Please enter your Email address';
    if (!data.password) errs.password = 'Please enter Password';
    return errs;
  };

  const handleChange = e => setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      const res = await api.post('/auth/login', data);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      alert(`Welcome ${user.firstname} ${user.lastname}`);
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {['email','password'].map(field => (
          <div key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              value={data[field]}
              onChange={handleChange}
            />
            {errors[field] && <div className="error">{errors[field]}</div>}
          </div>
        ))}
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/">Register</Link></p>
    </div>
  );
};

export default Login;
