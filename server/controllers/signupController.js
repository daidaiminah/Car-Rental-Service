import db from "../models/index.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signupController = async (req, res) => {
    console.log('=== SIGNUP REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Environment:', process.env.NODE_ENV);
    
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            const errorMessage = 'Missing required fields';
            console.error(errorMessage, { name, email, password: !!password });
            return res.status(400).json({ 
                success: false,
                message: errorMessage,
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
            role: role || 'customer', // Use provided role or default to customer
            isAdmin: false // Default to regular user
        });

        console.log('User created successfully:', { userId: user.id, email: user.email });

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role, isAdmin: user.isAdmin },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '30d' }
        );

        // Return user data and token (exclude password)
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin,
            token
        });

    } catch (error) {
        console.error('=== SIGNUP ERROR ===');
        console.error('Error:', error.message);
        console.error('Error name:', error.name);
        console.error('Error code:', error.code);
        console.error('Error stack:', error.stack);
        console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        
        // Handle specific Sequelize validation errors
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => ({
                field: err.path,
                message: err.message,
                type: err.type,
                validatorKey: err.validatorKey,
                value: err.value
            }));
            
            console.error('Validation errors:', errors);
            
            return res.status(400).json({ 
                success: false,
                message: 'Validation error',
                errors 
            });
        }

        // Handle database connection errors
        if (error.name === 'SequelizeConnectionError') {
            console.error('Database connection error:', error);
            return res.status(503).json({
                success: false,
                message: 'Unable to connect to the database',
                error: 'Database connection error'
            });
        }

        // Handle other errors
        const errorMessage = process.env.NODE_ENV === 'development' 
            ? 'An error occurred during registration' 
            : error.message;
            
        res.status(500).json({ 
            success: false,
            message: errorMessage,
            ...(process.env.NODE_ENV !== 'development' && { error: error.message, stack: error.stack })
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
