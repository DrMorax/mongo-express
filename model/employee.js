const mongoose = require("mongoose");
const Joi = require("joi");

const employeeSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  salary: {
    type: Number,
    required: true,
  },
});
const Employee = mongoose.model("Employee", employeeSchema);

// Validate post inputs
function employeeValidate(employee) {
  const schema = Joi.object({
    fullname: Joi.string().min(3).max(50).required(),
    salary: Joi.number().integer().required(),
  });

  return schema.validate(employee); // return the result of validation
}

// Validate put inputs
function employeePutValidate(employee) {
  const schema = Joi.object({
    id: Joi.number().integer(),
    fullname: Joi.string().min(3).max(50),
    salary: Joi.number().integer(),
  });

  return schema.validate(employee); // return the result of validation
}

exports.Employee = Employee;
exports.employeeValidate = employeeValidate;
exports.employeePutValidate = employeePutValidate;
