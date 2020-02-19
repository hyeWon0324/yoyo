import {Request, Response} from 'express';
import {RequestWithFiles} from '../interface/requestWithToken';
import {axiosConfig} from '../utils/axiosConfig.util';
import axios from 'axios';


function getTest(req: RequestWithFiles, res: Response){
    return res.render('test')
}

async function signIn(req: RequestWithFiles, res: Response): Promise<any> {
    try{
        const ret: any  = await new Promise(((resolve, reject) => {
            /*axios.post('http://localhost:3000/sign_in',data,{
                headers:{
                    
                },
                
               //withCredentials: true
            })*/
            axios(axiosConfig('post', req, 'http://localhost:3000/sign_in'))
            .then(result => {
                if(result.status == 203){
                    console.log(result.status);
                }
                console.log(result.headers);
                resolve(result);
            })
            .catch(result => {
                reject(result);
            })
        }));
        res.status(200);
        console.log(ret);
        return res.render('test');
    }catch (e){
        console.error(e);
        return res.status(400);
    }
    
}



async function signUp(req: RequestWithFiles, res: Response): Promise<Response> {
    
    const data = req;
    try{
        const ret: any = await new Promise(((resolve, reject) => {
            axios.post('http://localhost:3000/sign_up', data)
            .then(({data}) => {
                resolve(data);
            })
            .catch(({data}) => {
                reject(data);
            });
        }));
        return res.status(200).send();
    }catch (e){
        console.error(e);
        return res.status(400);
    }
}


export {signIn, signUp, getTest};