const express = require('express');
const router = express.Router();
const models = require("../models");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const verify = require('../middlewares/verifyToken');
const yymmdd = require('yymmdd');

/*******************
 * DB ATTRIBUTE
 * users = {
 *   idx
 *   userId - V
 *   pw - V
 *   nickname - V
 *   email - V
 *   profile
 *   salt
 *   followerCount
 *   followingCount
 *   tracksCount
 *   grade
 *   status
 *   createdAt
 *   accessDt
 *   updatedDt
 *   refreshToken
 * }
 *******************/

router.post("/check_email", function (req, res, next) {
  const body = req.body;
  const checkEmail = models.users.findOne({
    where: {
      email: body.email
    }
  }).then(result => {
    if (result == null || result == undefined) {
      res.status(200);
      return res.json({res_status: 'available'});
      
    } else {
      res.status(200);
      return res.json({res_status: 'already exist'});
    }
  }).catch(err => {
    res.status(500);
    return res.send('internal server error');
  })
})

router.post("/check_id", function (req, res, next) {
  const body = req.body;
  const checkId = models.users.findOne({
    where: {
      user_id: body.id
    }
  }).then(result => {
    if (result == null || result == undefined) {
      res.status(200);
      return res.json({res_status: "available"});
    } else {
      res.status(200);
      return res.json({res_status: "already exist"});
    }
  }).catch(err => {
    console.error(err);
    res.status(500);
    return res.json({res_status: "internal server error"});
  })
})

router.post('/', function (req, res, next) {
  const body = req.body;
  console.log(body);
  const checkEmail = models.users.findOne({
    where: {
      email: body.email
    }
  }).then(result => {
    //check Email is already exist?
  }).catch(err => {
    console.error(err);
    res.status(500);
    return res.json({res_status: "internal server error"});
  })
  const checkId = models.users.findOne({
    where: {
      user_id: body.id
    }
  }).then(result => {
    //check userId is already exist?
  }).catch(err => {
    console.error(err);
    res.status(500);
    return res.json({res_status: "internal server error"});
  })
  
  // make a HashPassword
  const salt = crypto.randomBytes(32).toString('base64');
  const hashPassword = crypto.createHash('sha256').update(salt + body.pass).digest('base64');
  const date = yymmdd.yyyy_mm_dd_hh_mm_ss();
  const createUser = models.users.create({
    user_id: body.id,
    pw: hashPassword,
    nickname: body.nickname,
    email: body.email,
    profile: `{"profile_pic":"","background_pic":"","texts":"","contact_link":""}`,
    salt: salt,
    created_dt: date
  }).then(result => {
    // Generate Refresh Token using JWT
    // Payload : idx
    const userIdx = result.dataValues.idx;
    const refreshToken = jwt.sign({userIdx: userIdx}, process.env.JWT_SECRET,{
      expiresIn:'7d'
    });
    const generateRefreshToken = models.users.update({refreshToken: refreshToken}, {
      where: {idx: userIdx}
    }).then(result =>{
          console.log(result);
          return res.redirect('/sign_in');
    }).catch(err => {
      console.error(err);
      res.status(500);
      return res.json({res_status: 'internal server error'});
    });
  }).catch(err => {
    console.error(err);
    res.status(500);
    res.json({res_status: "internal server error"});
  })
})


/*
router.post("/sign_up", function (req, res, next) {
  
  const body = req.body;
  const checkEmail = models.users.findOne({
    where: {
      email: body.email
    }
  }).then(result => {
    console.log(result);
    if (result == null || result == undefined) {
      let salt = crypto.randomBytes(32).toString('base64');
      let hashPassword = crypto.createHash('sha256').update(salt + body.pass).digest('base64');
      let result = models.user.create({
        name: body.name,
        email: body.email,
        password: hashPassword,
        salt: salt
      }).then(result => {
        console.log(result);
      }).catch(err => {
        console.error(err);
      })
      res.redirect("/users/login");
      
    } else {
      console.log("email is already exist");
      res.status(200).send()
    }
  }).catch(err => {
    console.error(err);
  });
})*/
module.exports = router;