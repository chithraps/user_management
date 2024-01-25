const express = require("express");
const admin_rout = express();

const adminController = require("../controller/adminController");

admin_rout.post('/signUp',adminController.adminSignUp)
admin_rout.post('/login',adminController.adminLogin)
admin_rout.get('/fetchUsers',adminController.fetchUsers)
admin_rout.get('/fetchUser',adminController.fetchUser)
admin_rout.post('/editUser',adminController.editUser)
admin_rout.post('/deleteUser',adminController.deleteUser)
admin_rout.post('/addUser',adminController.addUser)
module.exports = admin_rout;