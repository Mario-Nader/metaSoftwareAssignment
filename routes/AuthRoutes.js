const express = require("express")
const router = express.Router();
const auth = require('../controllers/AuthControllers')


router.post('/signUp',auth.signup)
router.post('/signIn',auth.login)
router.post('/signOut',auth.logout)


module.exports = router