# Car Rental API System

A RESTful API for a car rental system that allows users to manage cars, customers, and rentals.

## Features

- **Cars Management**: Add, update, delete, and list available cars
- **Customer Management**: Register and manage customers
- **Rental Management**: Create and track car rentals with automatic availability updates

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure your database connection in `config/config.json`
4. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Cars

| Method | Endpoint    | Description            |
| ------ | ----------- | ---------------------- |
| POST   | /api/cars   | Add new car            |
| GET    | /api/cars   | List all cars          |
| GET    | /api/cars/:id | Get single car details |
| PUT    | /api/cars/:id | Update car info        |
| DELETE | /api/cars/:id | Remove a car           |

### Customers

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| POST   | /api/customers   | Register customer    |
| GET    | /api/customers   | List customers       |
| GET    | /api/customers/:id | View single customer |
| PUT    | /api/customers/:id | Update customer      |
| DELETE | /api/customers/:id | Delete customer      |

### Rentals

| Method | Endpoint       | Description                |
| ------ | -------------- | -------------------------- |
| POST   | /api/rentals   | Rent a car                 |
| GET    | /api/rentals   | View all rentals           |
| GET    | /api/rentals/:id | View a specific rental     |
| DELETE | /api/rentals/:id | Cancel a rental            |

## Models

### Car
- id: integer (auto-increment, primary key)
- make: string
- model: string
- year: integer
- rentalPricePerDay: decimal
- isAvailable: boolean (default: true)

### Customer
- id: integer (auto-increment, primary key)
- name: string
- email: string
- phone: string

### Rental
- id: integer (auto-increment, primary key)
- carId: foreign key → Car
- customerId: foreign key → Customer
- startDate: date
- endDate: date
- totalCost: decimal (auto-calculated: days * rentalPricePerDay)

## Business Logic

- When renting a car, the system checks if isAvailable is true
- On successful rental, the car's isAvailable status is updated to false
- When canceling a rental, the car's isAvailable status is set back to true
- Total cost is calculated as: number of days × rentalPricePerDay
