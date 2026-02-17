import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Flex, Input, Anchor, Button, Text, PasswordInput } from "@mantine/core";

import "./Login.css";

import loginImage from "../../assets/loginPage-img.jpg"

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError("Email and password are required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/auth/login`, formData);
            const { token, userId, role } = res.data;

            localStorage.setItem("userId", userId);
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            if (token) {
                const { exp } = JSON.parse(atob(token.split(".")[1]));
                if (Date.now() >= exp * 1000) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("role");
                }
            }
            navigate('/');
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
                {/* Form */}
                <div className="login-form-wrapper">
                    <form className="login-form">
                        <div className="form-header">
                            <h1>Welcome Back</h1>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <div className="form-group">
                            <Input
                                name="email"
                                variant="unstyled"
                                placeholder="Email"
                                classNames={{
                                    wrapper: "login-input-wrapper",
                                    input: "login-input",
                                }}
                                onChange={handleChange}
                                value={formData.email}
                            />
                        </div>

                        <div className="form-group">
                            <PasswordInput
                                name="password"
                                placeholder="Password"
                                classNames={{
                                    wrapper: "login-input-wrapper",
                                    input: "login-input",
                                    innerInput: "login-inner-input",
                                }}
                                onChange={handleChange}
                                value={formData.password}
                            />
                        </div>

                        <Flex justify={"flex-end"} className="options">
                            <Anchor href="https://mantine.dev/" target="_blank" underline="always">
                                Forget Password?
                            </Anchor>
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
                                    root: "login-btn-primary",
                                    label: "login-btn-label",
                                }}
                                onClick={handleSubmit}
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="filled"
                                size="lg"
                                radius="xl"
                                classNames={{
                                    root: "login-btn-google",
                                    label: "login-btn-label",
                                }}
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                                    alt="google"
                                />
                                Continue with Google
                            </Button>
                        </Flex>

                        <Flex justify={"center"} align={"center"} gap={2}>
                            <Text className="textColor">Don't have an account?</Text>
                            <Anchor className="textColor" underline="always" ml={"5px"} onClick={() => navigate("/signup")}>
                                Sign Up
                            </Anchor>
                        </Flex>
                    </form>
                </div>
                <div className="login-image">
                    <img
                        src={loginImage}
                        alt="login"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;