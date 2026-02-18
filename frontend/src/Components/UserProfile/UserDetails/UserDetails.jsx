import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

import './UserDetails.css';

const UserDetails = () => {
    const [userDetail, setUserDetail] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_APP_BACKEND_LINK}/api/user/getUserDetail`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setUserDetail(res.data);

            } catch (err) {
                console.log("Error fetching user info:", err);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <section className="profile-container">
            {/* Header */}
            <div className="profile-header">
                <h2>Your Profile</h2>
                <p>
                    Update your personal information and manage security preferences.
                </p>
            </div>

            {/* Profile Form */}
            <form className="profile-form">
                <div className="profile-grid">
                    <div className="profile-form-group">
                        <label>First Name</label>
                        <input type="text" placeholder="Your first name" value={userDetail.firstName} />
                    </div>

                    <div className="profile-form-group">
                        <label>Last Name</label>
                        <input type="text" placeholder="Your last name" value={userDetail.lastName} />
                    </div>

                    <div className="profile-form-group full-width">
                        <label>Email Address</label>
                        <div className="email-wrapper">
                            <input type="email" placeholder="you@example.com" value={userDetail.email} />
                            <span className="verified">✓</span>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
}

export default UserDetails