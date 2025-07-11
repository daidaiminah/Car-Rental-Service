import { sequelize } from '../models';
import { Car } from '../models';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the car data from the client side
const { featuredCars } = await import(
  path.join(
    __dirname,
    '../../client/src/data/cars.js'
  )
);

const descriptions = {
  suv: 'This is a brand new SUV in excellent condition, perfect for family trips and off-road adventures. Features include advanced safety systems, comfortable seating, and modern technology.',
  luxury: 'Experience luxury at its finest with this premium vehicle. Impeccable condition with all the latest features and amenities for a first-class driving experience.',
  sedan: 'A reliable and efficient sedan that offers great fuel economy and a smooth ride. Perfect for daily commutes and long drives alike.',
  electric: 'Eco-friendly and high-performance electric vehicle with zero emissions. Enjoy the latest in electric vehicle technology and a quiet, powerful ride.',
  sports: 'High-performance sports car with powerful engine and sport-tuned suspension. Delivers an exhilarating driving experience with head-turning style.',
  truck: 'Rugged and capable truck built for work and play. Offers impressive towing capacity and plenty of cargo space.',
  van: 'Spacious and comfortable van ideal for large families or group transportation. Features ample cargo space and passenger comfort.'
};

const migrateCars = async () => {
  try {
    // Sync the database
    await sequelize.sync({ force: false });
    
    console.log('Starting car migration...');
    
    // Transform and create cars in the database
    const carsToCreate = featuredCars.map(car => ({
      make: car.make,
      model: car.model,
      year: car.year,
      rentalPricePerDay: car.pricePerDay,
      isAvailable: true,
      type: car.type,
      transmission: car.transmission,
      fuelType: car.fuelType,
      seats: car.seats,
      description: descriptions[car.type] || 'This is a well-maintained vehicle in excellent condition, ready for your next adventure.',
      imageUrl: car.image || null,
      rating: car.rating,
      location: car.location
    }));
    
    // Bulk create cars
    const createdCars = await Car.bulkCreate(carsToCreate, { returning: true });
    
    console.log(`Successfully migrated ${createdCars.length} cars to the database.`);
    process.exit(0);
  } catch (error) {
    console.error('Error migrating cars:', error);
    process.exit(1);
  }
};

migrateCars();
