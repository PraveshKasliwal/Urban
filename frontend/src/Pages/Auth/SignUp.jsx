import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Input, Anchor, Button, Text, PasswordInput } from "@mantine/core";

import "./Login.css";
import SignUpImage from "../../assets/signUpPage-img.jpg"

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("All fields are required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (formData.password != formData.confirmPassword) {
            setError("Passwords do not match")
            return;
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/auth/register-user`, formData);
            alert("Account created successfully! Please login");
            navigate('/login');
        }
        catch (err) {
            console.log(err);
            setError(
                err.response?.data?.message || "Something went wrong. Please try again."
            );
        }
    }
    return (
        <div className="login-wrapper">
            <div className="login-grid">
                <div className="login-image">
                    <img
                        src={SignUpImage}
                        alt="login"
                    />
                </div>
                {/* Form */}
                <div className="login-form-wrapper">
                    <form className="login-form">
                        <div className="form-header">
                            <h1>Join</h1>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <Flex className="form-group" direction="column" gap={10}>
                            <Flex className="form-group" gap={10}>
                                <Input
                                    name="firstName"
                                    placeholder="First Name"
                                    w={"100%"}
                                    classNames={{
                                        wrapper: "signup-input-wrapper",
                                        input: "signup-input",
                                    }}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="lastName"
                                    placeholder="Last Name"
                                    w={"100%"}
                                    classNames={{
                                        wrapper: "signup-input-wrapper",
                                        input: "signup-input",
                                    }}
                                    onChange={handleChange}
                                />
                            </Flex>
                            <Input
                                name="email"
                                placeholder="Email"
                                w="100%"
                                classNames={{ input: "signup-input" }}
                                onChange={handleChange}
                            />
                            <PasswordInput
                                name="password"
                                placeholder="Password"
                                classNames={{ input: "signup-input" }}
                                onChange={handleChange}
                            />

                            <PasswordInput
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                classNames={{ input: "signup-input" }}
                                onChange={handleChange}
                            />
                        </Flex>
                        <Flex
                            direction="column"
                            gap={"10px"}
                            p={"20px 0 40px 0"}
                        >
                            <Button
                                variant="filled"
                                size="lg"
                                radius="xl"
                                classNames={{
                                    root: "signup-btn-primary",
                                    label: "signup-btn-label",
                                }}
                                onClick={handleSubmit}
                            >
                                Create Account
                            </Button>
                        </Flex>
                        <Flex justify={"center"} align={"center"} gap={2}>
                            <Text c={"#4f604e"}>Already have an account?</Text>
                            <Anchor c={"#4f604e"} underline="always" ml={"5px"} onClick={() => navigate("/login")}>
                                Log In
                            </Anchor>
                        </Flex>
                    </form>
                </div>
                {/* Left Image */}
            </div>
        </div>
    );
};

export default SignUp;