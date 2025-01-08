const router = require("express").Router();

const userController = require("../controllers/userController")

router.post("/register",userController.registerUser)

router.post("/login",userController.loginUser)

router.get("/user/:id",userController.getUserById)

router.get("/user",userController.getUsers)

module.exports = router;