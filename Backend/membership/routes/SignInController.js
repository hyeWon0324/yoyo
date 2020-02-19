const express = require('express');
const router = express.Router();
const models = require("../models");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const verify = require('../middlewares/verifyToken');

const client = redis.createClient(process.env.REDIS_PORT);


//---GET---
router.get('/', function (req, res, next) {
  res.render("login.html");
});


//---POST---
router.post("/", function (req, res, next) {
  console.log(req.body);
  const body = req.body;
  const result = models.users.findOne({
    where: {
      email: body.email
    }
  }).then(result => {
    if (result == null || result == undefined) {
      // Login Failed
      res.status(203);
      return res.json({res_status: "email is not exist"});
      
    } else {
      const userIdx = result.dataValues.idx;
      const userId = result.dataValues.user_id;
      const dbPassword = result.dataValues.pw;
      const inputPassword = body.pass;
      const salt = result.dataValues.salt;
      const hashPassword = crypto.createHash('sha256').update(salt+inputPassword).digest('base64');
      
      if(dbPassword == hashPassword){
        console.log("password correct");
        const refreshToken = result.dataValues.refreshToken;
        console.log(refreshToken);
        // Verify RefreshToken and Generate Access Token
        jwt.verify(refreshToken, process.env.JWT_SECRET,  function(err, decoded) {
          if(err.name == 'TokenExpiredError' || err.message == 'jwt must be provided'){
            // Regenerate refresh token
            const newRefreshToken = jwt.sign({userIdx: userIdx}, process.env.JWT_SECRET,{expiresIn: '7d'});
            console.log(newRefreshToken);
            const updateRefreshToken =  models.users.update({refresh_token:newRefreshToken},{
              where: {
                idx : userIdx
              }
            }).then(result =>{
              console.log(result);
            }).catch(err =>{
              console.error(err);
            })
          }
          else if(err){
            console.error(err);
            res.status(203);
            return res.json({res_status: 'invalid refresh token'});
          }
          
          // Generte Access Token
          const accessToken = jwt.sign({userIdx:userIdx, userId:userId}, process.env.JWT_SECRET, {expiresIn:'30m'});
          client.setex(accessToken,1800, userIdx);
          res.status(200);
        
          res.cookie('access_token', accessToken);
          return res.send();
        });
      }
      else{
        res.status(204);
        return res.json({res_status: "incorrect password"});
      }
    }
  }).catch(err => {
    console.error(err);
    res.status(500);
    return res.json({res_status: "internal server error"});
  })
})
module.exports = router;