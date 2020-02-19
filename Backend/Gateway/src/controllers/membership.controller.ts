import {Request, Response} from 'express';
import axios from 'axios';
import { fstat } from 'fs';

//


/*
 로그인, 회원가입 요청시에는 토큰 검사를 진행하지 않음.
 
* */

async function signIn(req: Request, res: Response): Promise<Response> {
    const data = req.body; // 세부 파라미터 정해야됨 비효율적일거 같음 바디
    try{
        const ret: any  = await new Promise(((resolve, reject) => {
            axios.post('http://localhost:3000/sign_in',data)
            .then(({data})=> {
                resolve(data)
            })
            .catch(({data})=> reject(data));
        }));
        res.status(200);
        return res.json({res_status:'sign_in complete'});
    }catch (e){
        console.error(e);
        return res.status(400);
    }
    
}



async function signUp(req: Request, res: Response): Promise<Response> {
    const data = req.body; // 위와 동일
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
    } catch(e){
        console.error(e);
        return res.status(400);
    }
}

async function signOut(req: Request, res: Response): Promise<Response>{
    const data = req.body;
    try{
        const ret: any = await new Promise(((resolve, reject) => {
            axios.post('http://localhost:3000/sign_out',data)
            .then(({data}) => {
                resolve(data);
            })
            .catch(({data}) => {
                reject(data);
            });
        }))
        return res.status(200).send(ret);
    } catch(e){
        console.error(e);
        return res.status(400).send();
    }
}
/*
const data = req.body;
    async function profileEdit(req: Request, res: Response): Promise<Response>{
    try{
        const ret: any = await new Promise(((resolve, reject) =>{
            axios.post('http://localhost:3000/',data, {
                headers: {
                }
            })
        }))
    }
}
*/

export {signIn, signUp, signOut};