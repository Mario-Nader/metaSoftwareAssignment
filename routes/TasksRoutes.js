const express = require("express")
const router = express.Router();
const auth = require('../controllers/AuthControllers')
const task = require('../controllers/TaskControllers')

router.use(auth.authenMid,auth.verifyUser)
router.post('/addTask',task.addTask)
router.put('/changeStatus',task.updateTaskStatus)
router.delete('/deleteTask',task.deleteTask)
router.get('/getTask',task.getTask)
router.get('/getTasks',task.getTasks)

module.exports = router