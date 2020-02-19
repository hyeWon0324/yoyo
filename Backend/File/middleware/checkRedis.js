const express = require('express');
const redis = require('redis');

module.exports = function(req, res, next){
  const accessToken = req.cookies.access_token;
  const client = redis.createClient();
  client.get(accessToken,function(err, reply){
    if(err) return res.send(500);
    if(reply == null){
      res.status(203);
     return res.json({res_state:'access denied'}).end();
    }
    else {
      req.userIdx = reply;
      return next();
    }
  });
}
