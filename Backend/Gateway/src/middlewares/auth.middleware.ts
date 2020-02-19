import {Request, Response, NextFunction} from 'express';
import {RequestWithFiles} from '../interface/requestWithToken';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import * as jwtConfig from '../config/jwt';
import {client} from '../utils/redisClient.util';
import {generate} from '../utils/token.util';


export async function check(req: RequestWithFiles, res: Response, next: NextFunction): Promise<void | Response> {
  let accessToken = req.token;
  if (accessToken == null || accessToken == undefined)
    return res.status(203).send();

  try{
    jwt.verify(accessToken, jwtConfig.secret);
    next();
  } catch(err){
    if(err.name == TokenExpiredError){
      accessToken = await generate(accessToken);
      if(accessToken != null){
        req.token = accessToken;
        return next();
      }
      return res.status(203).send();
    }
    else
      return res.status(203).send();
  }
  
}
                                                              