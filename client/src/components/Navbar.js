import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import logoutSound from './assets/logout.mp3';
import thanksSound from './assets/thanks.mp3';

const Navbar = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      if (audioRef.current) {
        audioRef.current.src = logoutSound;
        audioRef.current.play().catch(() => {
        });

        audioRef.current.onended = () => {
          localStorage.removeItem('token');
          audioRef.current.src = thanksSound;
          audioRef.current.play().catch(() => {});
          audioRef.current.onended = () => {
            navigate('/');
          };
        };
      } else {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };

  const token = localStorage.getItem('token');

  return (
    <>
      <nav>
        {token && (
          <>
            <Link to="/home">Homepage</Link>{" | "}
            <Link to="/users">User Module</Link>{" | "}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} />
    </>
  );
};

export default Navbar;
