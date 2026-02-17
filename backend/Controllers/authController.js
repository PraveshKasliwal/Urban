const axios = require("axios");
const User = require('../Models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: "All field are required" });
        
        const user = await User.findOne({ email: email });
        
        if (!user) return res.status(400).json({ success: false, message: "User does not exist" });
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) return res.status(400).json({ success: false, message: "Password Incorrect" });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        })
        const userId = user._id;
        res.status(200).json({
            success: true,
            token,
            userId: userId,
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", erro: err });
    }
}

exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password)
            return res.status(400).json({ success: false, message: "All field are required" });

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: "User already exist" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", erro: err });
    }
}