const express = require('express');
const router = express.Router();
const models = require("../models");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const verify = require('../middlewares/verifyToken');

const client = redis.createClient(process.env.REDIS_PORT);

router.post('/', (req,res) => {
  const accessToken = req.cookies.access_token;
  res.clearCookie(accessToken);
  res.status(200);
  return res.json({res_status: "sign out"});
})  