import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

import notFname from './assets/not-fname.mp3';
import notLname from './assets/not-lname.mp3';
import notMobile from './assets/not-mobile.mp3';
import notMail from './assets/not-mail.mp3';
import notPassword from './assets/not-password.mp3';
import nameError from './assets/name-error.mp3';
import mailError from './assets/mail-error.mp3';
import mailExist from './assets/mail-exist.mp3';
import passwordError from './assets/password-error.mp3';
import confirmPassError from './assets/conpas.mp3';
import signupSuccess from './assets/signup-success.mp3';

const Signup = () => {
  const [data, setData] = useState({
    firstname: '', lastname: '', mobileNumber: '', email: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const soundForError = (fieldKey) => {
    switch (fieldKey) {
      case 'firstname_required': return notFname;
      case 'lastname_required': return notLname;
      case 'mobileNumber_required': return notMobile;
      case 'email_required': return notMail;
      case 'password_required': return notPassword;
      case 'firstname_pattern':
      case 'lastname_pattern': return nameError;
      case 'email_format': return mailError;
      case 'email_exist': return mailExist;
      case 'password_pattern': return passwordError;
      case 'confirmPassword_match': return confirmPassError;
      default: return null;
    }
  };

  const validate = () => {
    const errs = {};
    const nameRegex = /^[A-Za-z]+$/;

    if (!data.firstname) errs.firstname_required = 'Firstname is required';
    else if (!nameRegex.test(data.firstname)) errs.firstname_pattern = 'Only letters allowed';

    if (!data.lastname) errs.lastname_required = 'Lastname is required';
    else if (!nameRegex.test(data.lastname)) errs.lastname_pattern = 'Only letters allowed';

    if (!data.mobileNumber) errs.mobileNumber_required = 'Mobile number is  required';
    else if (!/^\d+$/.test(data.mobileNumber)) errs.mobileNumber_pattern = 'Only numbers';

    if (!data.email) errs.email_required = 'Email required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email_format = 'Invalid email address';

    if (!data.password) errs.password_required = 'Please enter Password';
    else if (data.password.length < 8 || !/[A-Z]/.test(data.password) || !/[!@#$%^&*]/.test(data.password))
      errs.password_pattern = 'Password must contain uppercase, special char, min 8';

    if (data.password !== data.confirmPassword) errs.confirmPassword_match = 'Passwords do not match';

    return errs;
  };

  const handleChange = e => setData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      const firstErrorKey = Object.keys(errs)[0];
      const sound = soundForError(firstErrorKey);
      if (sound && audioRef.current) {
        audioRef.current.src = sound;
        audioRef.current.play().catch(() => {});
      }
      return;
    }

    try {
      const res = await api.post('/auth/signup', data);
      const { token, user } = res.data;
      localStorage.setItem('token', token);

      if (audioRef.current) {
        audioRef.current.src = signupSuccess;
        audioRef.current.play().catch(() => {});
      }

      alert(`Welcome ${user.firstname} ${user.lastname}`);
      navigate('/home');
    } catch (err) {
      const msg = err.response?.data?.msg;
      if (msg === 'Email already exists') {
        setErrors({ email_exist: msg });
        const sound = mailExist;
        if (audioRef.current && sound) {
          audioRef.current.src = sound;
          audioRef.current.play().catch(() => {});
        }
      } else {
        alert(msg || 'Signup failed');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        {['firstname','lastname','mobileNumber','email','password','confirmPassword'].map(field => (
          <div key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field.toLowerCase().includes('password') ? 'password' : 'text'}
              name={field}
              value={data[field]}
              onChange={handleChange}
            />
            {Object.values(errors).some((_, i) => Object.keys(errors)[i].startsWith(field)) && (
              <div className="error">{errors[Object.keys(errors).find(k => k.startsWith(field))]}</div>
            )}
          </div>
        ))}
        <button type="submit">Signup</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
      <audio ref={audioRef} />
    </div>
  );
};

export default Signup;
