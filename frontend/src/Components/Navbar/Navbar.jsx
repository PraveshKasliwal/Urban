import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flex, Text, Input } from '@mantine/core';
import './Navbar.css';

import { useCart } from '../../Context/CartContext';
import { CiSearch } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { HiMiniSparkles } from "react-icons/hi2";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { openCart } = useCart();

    const isMenActive = location.pathname === "/product/men";
    const isWomenActive = location.pathname === "/product/women";

    const handleStyleStudio = () => {
        const token = localStorage.getItem("token");
        console.log(token)
        if (token) {
            navigate('/style-studio');
        }
        else {
            alert("please login to use this feature");
            navigate("/login");
        }
    }
    return (
        <Flex className="navbar">
            <Text className="navbar-logo" onClick={() => navigate("/")}>
                urban
            </Text>

            <Flex className="navbar-links">
                <Text
                    className={`nav-link ${isMenActive ? "active" : ""}`}
                    onClick={() => navigate("/product/men")}
                >
                    Men
                </Text>
                <Text
                    className={`nav-link ${isWomenActive ? "active" : ""}`}
                    onClick={() => navigate("/product/women")}
                >
                    Women
                </Text>
            </Flex>

            <Flex className="navbar-actions">
                <HiMiniSparkles className="nav-icon" size={20} onClick={() => handleStyleStudio()} />
                <Input
                    className="search-input"
                    placeholder="Search collections..."
                    leftSection={<CiSearch size={20} />}
                    radius="20px"
                />
                {
                    localStorage.getItem("role") === "admin" &&
                    <RiAdminFill className="nav-icon" size={20} onClick={() => navigate('/admin')} />
                }
                <IoBagOutline className="nav-icon" size={20} onClick={openCart} />
                <FaUser onClick={localStorage.getItem("userId") ? () => navigate('/profile') : () => navigate('/login')} className="nav-icon" size={16} />
            </Flex>
        </Flex>
    );
};

export default Navbar;
