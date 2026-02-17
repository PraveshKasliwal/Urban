import React from "react";
import "./Footer.css";

import { FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

const data = [
    {
        title: "Shop",
        links: [
            { label: "Women", href: "/product/women" },
            { label: "Men", href: "/product/men" },
            { label: "New Arrivals", href: "/support" },
            { label: "Collections", href: "/forums" },
        ],
    },
    {
        title: "About",
        links: [
            { label: "Our Story", href: "/contribute" },
            { label: "Sustainability", href: "/media" },
            { label: "Materials", href: "/changelog" },
            { label: "Ethical Product", href: "/releases" },
        ],
    },
    {
        title: "Help",
        links: [
            { label: "Shipping", href: "https://discord.com" },
            { label: "Return", href: "https://twitter.com" },
            { label: "Contact", href: "/newsletter" },
            { label: "FAQ", href: "https://github.com" },
        ],
    },
];

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-inner">
                {/* Logo + description */}
                <div className="footer-logo">
                    <div className="logo-circle">URBAN</div>
                    <p className="footer-description">
                        A destination for the modern minimalist seeking sustainable, high-quality essentials designed to elevate your daily ritual.
                    </p>
                </div>

                {/* Links */}
                <div className="footer-groups">
                    {data.map((group) => (
                        <div className="footer-group" key={group.title}>
                            <h4 className="footer-title">{group.title}</h4>

                            {group.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="footer-link"
                                    target={link.href.startsWith("http") ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* After footer */}
            <div className="footer-after">
                <p className="footer-copy">
                    © 2020 mantine.dev. All rights reserved.
                </p>

                <div className="footer-social">
                    <button className="social-btn">
                        <FaTwitter size={18} />
                    </button>
                    <button className="social-btn">
                        <FaYoutube size={18} />
                    </button>
                    <button className="social-btn">
                        <FaInstagram size={18} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
