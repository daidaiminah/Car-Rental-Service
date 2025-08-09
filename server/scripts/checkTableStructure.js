import { sequelize } from '../config/db.js';
import { QueryTypes } from 'sequelize';

async function checkTableStructure() {
  try {
    console.log('=== Checking Cars Table Structure ===');
    
    // Get table columns
    const columns = await sequelize.query(
      `SELECT 
         column_name, 
         data_type, 
         is_nullable,
         column_default,
         character_maximum_length,
         udt_name
       FROM information_schema.columns 
       WHERE table_name = 'Cars' 
       ORDER BY ordinal_position`,
      { type: QueryTypes.SELECT }
    );

    console.log('\n=== Table Columns ===');
    console.table(columns);

    // Get indexes
    const indexes = await sequelize.query(
      `SELECT 
         i.relname as index_name,
         a.attname as column_name,
         ix.indisprimary as is_primary,
         ix.indisunique as is_unique
       FROM pg_class t, pg_class i, pg_index ix, pg_attribute a
       WHERE t.oid = ix.indrelid
         AND i.oid = ix.indexrelid
         AND a.attrelid = t.oid
         AND a.attnum = ANY(ix.indkey)
         AND t.relkind = 'r'
         AND t.relname = 'Cars'
       ORDER BY i.relname, a.attnum`,
      { type: QueryTypes.SELECT }
    );

    console.log('\n=== Indexes ===');
    console.table(indexes);

    // Get constraints
    const constraints = await sequelize.query(
      `SELECT 
         conname as constraint_name,
         pg_get_constraintdef(oid) as definition
       FROM pg_constraint 
       WHERE conrelid = '\"Cars\"'::regclass`,
      { type: QueryTypes.SELECT }
    );

    console.log('\n=== Constraints ===');
    console.table(constraints);

  } catch (error) {
    console.error('Error checking table structure:', error);
  } finally {
    await sequelize.close();
  }
}

checkTableStructure();
