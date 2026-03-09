import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Code, Text } from '@mantine/core';
import './UserProfileNavbar.css';

import UserDetails from './UserDetails/UserDetails';
import OrderHistory from './OrderHistory/OrderHistory';


const data = [
    { label: 'Profile Details', component: <UserDetails /> },
    { label: 'Order History', component: <OrderHistory /> },
];

const UserProfileNavbar = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState('Profile Details');
    const handleLogout = () => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate('/');
            localStorage.clear();
        }
    }

    const activeComponent = data.find(item => item.label === active)?.component;

    return (
        <div className="admin-layout">
            <nav className="admin-navbar">
                <div className="admin-navbarMain">
                    {data.map((item) => (
                        <button
                            key={item.label}
                            className={`admin-link ${active === item.label ? 'admin-active' : ''}`}
                            onClick={() => setActive(item.label)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="admin-footer">
                    <button className="admin-link" onClick={() => handleLogout()}>Logout</button>
                </div>
            </nav>

            <div className="admin-content">
                {activeComponent}
            </div>
        </div>
    );
}

export default UserProfileNavbar;