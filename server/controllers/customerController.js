import db from "../models/index.js";

const Customer = db.Customer;

// Create a new customer
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, email, and phone are required fields" 
      });
    }

    // Check if email already exists
    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer with this email already exists"
      });
    }

    // Create new customer record
    const newCustomer = await Customer.create({
      name,
      email,
      phone
    });

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      data: newCustomer
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register customer",
      error: error.message
    });
  }
};

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    
    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve customers",
      error: error.message
    });
  }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: `Customer with ID ${id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve customer",
      error: error.message
    });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    
    // Check if customer exists
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: `Customer with ID ${id} not found`
      });
    }

    // If email is changing, check if the new email already exists
    if (email && email !== customer.email) {
      const existingCustomer = await Customer.findOne({ where: { email } });
      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another customer"
        });
      }
    }

    // Update customer
    await customer.update({
      name: name || customer.name,
      email: email || customer.email,
      phone: phone || customer.phone
    });

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update customer",
      error: error.message
    });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if customer exists
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: `Customer with ID ${id} not found`
      });
    }

    // Delete customer
    await customer.destroy();

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete customer",
      error: error.message
    });
  }
};
