import db from "../models/index.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signupController = async (req, res) => {
    try {
        console.log('Signup request received:', { body: req.body });
        
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            console.error('Missing required fields:', { name, email, password: !!password });
            return res.status(400).json({ 
                message: 'All fields are required',
                required: ['name', 'email', 'password']
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Check if user already exists
        const userExists = await db.User.findOne({ where: { email } });
        if (userExists) {
            console.error('Registration failed: User already exists', { email });
            return res.status(400).json({ 
                message: 'User with this email already exists',
                field: 'email'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long',
                field: 'password'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('Creating new user...');
        // Create user
        const user = await db.User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: false // Default to regular user
        });

        console.log('User created successfully:', { userId: user.id, email: user.email });

        // Generate token
        const token = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '30d' }
        );

        // Return user data and token (exclude password)
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token
        });

    } catch (error) {
        console.error('Signup error:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            ...error
        });
        
        // Handle specific Sequelize validation errors
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => ({
                field: err.path,
                message: err.message
            }));
            return res.status(400).json({ 
                message: 'Validation error',
                errors 
            });
        }

        // Handle other errors
        res.status(500).json({ 
            message: 'An error occurred during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getUserData = (req, res) => {
    db.User.findAll()
      .then((users) => {
        console.log(users); // This will print the data as Sequelize instances
        res.json(users);     // ✅ Send the actual user data as JSON
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("There was an error while getting user data DUDE!");
      });
  };
