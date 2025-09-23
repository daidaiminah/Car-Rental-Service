import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Import models using dynamic import
const modelImports = await import('../models/index.js');
const db = modelImports.default;
const { sequelize, User, Car, Rental } = db;

// Initialize the database connection
await sequelize.authenticate();

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database synced!');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@carrental.com',
      password: adminPassword,
      isAdmin: true
    });
    console.log('Admin user created:', admin.email);

    // Create Regular Users
    const users = [];
    const userPasswords = await Promise.all(
      ['user1@test.com', 'user2@test.com'].map(email => 
        bcrypt.hash('password123', 10)
      )
    );

    const userData = [
      { name: 'John Doe', email: 'user1@test.com', password: userPasswords[0] },
      { name: 'Jane Smith', email: 'user2@test.com', password: userPasswords[1] }
    ];

    for (const user of userData) {
      const newUser = await User.create(user);
      users.push(newUser);
      console.log(`User created: ${newUser.email}`);
    }

    // Create Cars
    const cars = [
      {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        rentalPricePerDay: 45.99,
        isAvailable: true,
        type: 'sedan',
        transmission: 'automatic',
        fuelType: 'gasoline',
        seats: 5,
        description: 'Comfortable and reliable sedan with great fuel efficiency',
        imageUrl: '/images/camry.jpg',
        location: 'Monrovia',
        features: ['Bluetooth', 'Backup Camera', 'Keyless Entry']
      },
      {
        make: 'Honda',
        model: 'Civic',
        year: 2023,
        rentalPricePerDay: 39.99,
        isAvailable: true,
        type: 'sedan',
        transmission: 'automatic',
        fuelType: 'gasoline',
        seats: 5,
        description: 'Popular compact car with excellent handling',
        imageUrl: '/images/civic.jpg',
        location: 'Monrovia',
        features: ['Apple CarPlay', 'Lane Assist', 'Cruise Control']
      },
      {
        make: 'Ford',
        model: 'Mustang',
        year: 2023,
        rentalPricePerDay: 89.99,
        isAvailable: true,
        type: 'sports',
        transmission: 'manual',
        fuelType: 'gasoline',
        seats: 4,
        description: 'Classic American muscle car with powerful performance',
        imageUrl: '/images/mustang.jpg',
        location: 'Monrovia',
        features: ['Leather Seats', 'Premium Sound', 'Sport Mode']
      },
      {
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        rentalPricePerDay: 99.99,
        isAvailable: true,
        type: 'electric',
        transmission: 'automatic',
        fuelType: 'electric',
        seats: 5,
        description: 'Fully electric vehicle with autopilot features',
        imageUrl: '/images/tesla.jpg',
        location: 'Monrovia',
        features: ['Autopilot', 'Premium Audio', 'Glass Roof']
      },
      {
        make: 'BMW',
        model: 'X5',
        year: 2022,
        rentalPricePerDay: 109.99,
        isAvailable: true,
        type: 'suv',
        transmission: 'automatic',
        fuelType: 'diesel',
        seats: 7,
        description: 'Luxury SUV with premium features and ample space',
        imageUrl: '/images/x5.jpg',
        location: 'Monrovia',
        features: ['Heated Seats', 'Navigation', 'Panoramic Sunroof']
      }
    ];

    const createdCars = await Car.bulkCreate(cars);
    console.log(`Created ${createdCars.length} cars`);

    // Create Rentals (in the past)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthPlusAWeek = new Date(lastMonth);
    lastMonthPlusAWeek.setDate(lastMonth.getDate() + 7);

    const rentals = [
      {
        userId: users[0].id,
        carId: createdCars[0].id,
        startDate: lastMonth,
        endDate: lastMonthPlusAWeek,
        totalCost: 300.00,
        status: 'completed', // Mark as completed since it's in the past
        paymentStatus: 'paid',
        totalDays: 7,
        dailyRate: createdCars[0].rentalPricePerDay,
        paymentMethod: 'credit_card',
        paymentDate: lastMonth
      },
      {
        userId: users[1].id,
        carId: createdCars[1].id,
        startDate: lastMonth,
        endDate: lastMonthPlusAWeek,
        totalCost: 350.00,
        status: 'completed', // Mark as completed
        paymentStatus: 'paid',
        totalDays: 7,
        dailyRate: createdCars[1].rentalPricePerDay,
        paymentMethod: 'mobile_money',
        paymentDate: lastMonth
      }
    ];

    const createdRentals = await Rental.bulkCreate(rentals);
    console.log(`Created ${createdRentals.length} rentals`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
