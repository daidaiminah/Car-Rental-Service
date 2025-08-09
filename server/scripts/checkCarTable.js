import { sequelize } from '../config/db.js';
import { QueryTypes } from 'sequelize';

async function checkCarTable() {
  try {
    // Get table information
    const tableInfo = await sequelize.query(
      `SELECT column_name, data_type, is_nullable, column_default, character_maximum_length 
       FROM information_schema.columns 
       WHERE table_name = 'Cars' 
       ORDER BY ordinal_position`,
      { type: QueryTypes.SELECT }
    );

    console.log('=== Cars Table Structure ===');
    console.table(tableInfo);

    // Get indexes
    const indexes = await sequelize.query(
      `SELECT indexname, indexdef 
       FROM pg_indexes 
       WHERE tablename = 'Cars'`,
      { type: QueryTypes.SELECT }
    );

    console.log('\n=== Indexes ===');
    console.table(indexes);

    // Get constraints
    const constraints = await sequelize.query(
      `SELECT conname, pg_get_constraintdef(oid) as definition 
       FROM pg_constraint 
       WHERE conrelid = '\"Cars\"'::regclass`,
      { type: QueryTypes.SELECT }
    );

    console.log('\n=== Constraints ===');
    console.table(constraints);

  } catch (error) {
    console.error('Error checking Cars table:', error);
  } finally {
    await sequelize.close();
  }
}

checkCarTable();
