const express = require("express");
require("express-async-errors");
const router = express.Router();
const {
  Employee,
  employeeValidate,
  employeePutValidate,
} = require("../model/employee");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

//Request all employees
router.get("/", async (req, res) => {
  const employees = await Employee.find().sort("name");
  res.send(employees);
});

// Pagination
router.get("/pages", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const employees = await Employee.find()
    .sort("salary")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  res.send(employees);
});

//Request a specified employee
router.get("/:id", async (req, res) => {
  const findEmployee = await Employee.findById(req.params.id);
  if (!findEmployee) {
    res.status(404).send("This Employee is not found");
  }
  res.send(findEmployee);
});

//Add an employee
router.post("/", auth, async (req, res) => {
  const { error } = employeeValidate(req.body);
  if (error) {
    return res.send(error.details[0].message);
  }
  const employee = new Employee({
    fullname: req.body.fullname,
    salary: req.body.salary,
  });
  await employee.save();
  res.send(employee);
});

//Delete and employee
router.delete("/:id", [auth, admin], async (req, res) => {
  const findEmployee = await Employee.findByIdAndDelete(req.params.id);
  if (!findEmployee) {
    res.status(404).send("Employee not found");
  }

  res.send(findEmployee);
});

//Edit employees' info
router.put("/:id", async (req, res) => {
  const { error } = employeePutValidate(req.body);
  if (error) {
    return res.send(error.details[0].message);
  }

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    { fullname: req.body.fullname },
    { new: true }
  );
  if (!employee) {
    return res.status(404).send(error.details[0].message);
  }
  res.send(findEmployee);
});

module.exports = router;
