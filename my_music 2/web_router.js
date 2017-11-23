`use strict`;
const express = require('express');
const userController = require('./controllers/userController');
const musicController = require('./controllers/musicController');

let router = express.Router();
router.get('/test',userController.doTest)
.post('/check-user',userController.checkUser)
.post('/do-register',userController.doRegister)
.post('/do-login',userController.doLogin)
.post('/add-music',musicController.addMusic)
.put('/update-music',musicController.updateMusic)

module.exports = router;