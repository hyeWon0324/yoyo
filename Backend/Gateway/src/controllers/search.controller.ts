import {Request, Response} from 'express';
import axios from'axios';
import { RequestWithFiles } from '../interface/requestWithToken';
import { axiosConfig } from '../utils/axiosConfig.util';


async function search(req: RequestWithFiles, res: Response): Promise<Response>{
  try{
    console.log(req);
    const ret: any = await new Promise(((resolve, reject) =>{
      axios(axiosConfig('post', req, 'http://localhost:3200/search'))
      .then(result => {
        
        resolve(result);
      })
      .catch(result => {
        reject(result);
      });
    }));
    res.status(200);
    //console.log(ret);
    return res.send();
  }
  catch (e){
    console.error(e);
    return res.status(400);
  }
}

export {search}