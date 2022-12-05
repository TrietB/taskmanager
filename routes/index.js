var express = require('express');
const { AppError, sendResponse } = require('../helpers/utils');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("Welcome to taskmanager")
});

router.get('/test/:test', async (req,res,next)=> {
  const {test} = req.params
  try {
    if(test==="error"){
      throw new AppError(401,"Access denied","Authentication Error")
    } else {
      sendResponse(res,200,true,{data:"template"},null,"template success")
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router;
