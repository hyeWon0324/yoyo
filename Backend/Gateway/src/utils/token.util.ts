import {client} from './redisClient.util';
import * as jwt from 'jsonwebtoken';
import * as jwtConfig from '../config/jwt'


export function generate(accessToken: string): string | null {
  let newAccessToken: string;
  const decoded : any = jwt.decode(accessToken);
  const user = {
    idx: decoded.idx,
    email: decoded.email,
    id: decoded.userId
  }
  if(client.get(user.idx)){
   newAccessToken = jwt.sign(user, jwtConfig.secret, {expiresIn : '2h'}); 
   return newAccessToken;
  }
  else
    return null;
}