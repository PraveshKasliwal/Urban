import React from 'react'
import { useNavigate } from 'react-router-dom';
import UserProfileNavbar from '../../Components/UserProfile/UserProfileNavbar';

const Profile = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  }
  return (
    <div>
      <UserProfileNavbar />
      {/* <button onClick={() => handleLogout()}>Logout</button> */}
    </div>
  )
}

export default Profile