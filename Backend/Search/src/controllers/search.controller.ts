import {Request, Response} from 'express';
import axios from 'axios';
import {getManager, Like} from 'typeorm';
import {Tracks} from '../entities/Tracks';
import {Users} from '../entities/Users';
import parseJson from 'parse-json';
import {sumObjectToJSON} from '../utils/sumJSON.util';



async function Test(req:Request, res:Response){
  console.log(req);
  const UsersRepository = await getManager().getRepository(Users);
  const savedUser1 = await UsersRepository.find({userId: Like("%jys%")});// tracks by title
  const savedUser2 = await UsersRepository.find({email: Like("%jys%")});// tracks by userid or nickname?
  
  const result = sumObjectToJSON(savedUser1,savedUser2);

  //console.log(parseJson(result));
  const testResult = parseJson(result);
  //const prettierParsing = parseJson(usersJSON);
  //console.log(prettierParsing);
  console.log(testResult[0]);
  return res.send(testResult);
}

async function search(req:Request, res: Response): Promise<Response>{
  
  const keyword = req.params.keyword;

  if(keyword != null || keyword != undefined){
    try{

      const tracksRepository = await getManager().getRepository(Tracks);
      const usersRepository = await getManager().getRepository(Users);
      
      let tracksResult = await tracksRepository.find({title: Like(`%${keyword}%`)});
      let usersResult = await usersRepository.find({userId: Like(`%${keyword}%`)});
      
      tracksResult =await tracksResult.sort(function(a: Tracks, b: Tracks): number{
        return a.playedCount - b.playedCount;
      })

      let tracksLength = tracksResult.length;
      let idLength = usersResult.length;
      
      if(tracksLength > 5){
        tracksResult = tracksResult.slice(0,5);
      }
      if(idLength > 5){
        usersResult = usersResult.slice(0,5); 
      }
      
      const result = await sumObjectToJSON(tracksResult, usersResult);
      const JsonPrettier = parseJson(result);
      return res.json(JsonPrettier);

    }catch(err){
      console.error(err);
      res.status(500);
      return res.send();
    }
  }
  else{
    return res.send();
  }
}

async function searchTrack(req:Request ,res: Response): Promise<Response>{
  
  const keyword = req.params.keyword
  let pages: number = parseInt(req.params.pages);
  
  if(pages != null || pages != undefined){
    try{
      
      const tracksRepository = await getManager().getRepository(Tracks)
      let tracksResult = await tracksRepository.find({title: Like(`${keyword}`)});
      
      tracksResult = await tracksResult.sort(function(a: Tracks, b: Tracks): number{
        return a.playedCount - b.playedCount; // ### not null CHECK ###
      });

      if(pages == 1 && tracksResult.length > 20){
        tracksResult = await tracksResult.slice(0,21);
      }
      else if(tracksResult.length > 20 && tracksResult.length > 20*pages){
        tracksResult = await tracksResult.slice((pages-1)*20, pages*20+21);
      }
      else{
        tracksResult = await tracksResult.slice((pages-1)*20, tracksResult.length);
      }
      
      const result = await JSON.stringify(tracksResult);

      return res.json(result);

    }catch(err){
      console.error(err);
      res.status(500);
      return res.send();
    }
  }
  return res.send();
}


async function searchArtist(req:Request, res: Response): Promise<Response>{
const keyword = req.params.keyword
let pages: number = parseInt(req.params.pages);

  if(pages != null || pages != undefined){
    try{
      
      const usersRepository = await getManager().getRepository(Users);
      let usersResult = await usersRepository.find({userId: Like(`${keyword}`)});
      
      usersResult = await usersResult.sort(function(a: Users, b: Users): number{
        return a.followerCount - b.followerCount; // ### not null CHECK ###
      });

      if(pages == 1 && usersResult.length > 20){
        usersResult = await usersResult.slice(0,21);
      }
      else if(usersResult.length > 20 && usersResult.length > 20*pages){
        usersResult = await usersResult.slice((pages-1)*20, pages*20+21);
      }
      else{
        usersResult = await usersResult.slice((pages-1)*20, usersResult.length);
      }
      
      const result = await JSON.stringify(usersResult);

      return res.json(result);

    }catch(err){
      console.error(err);
      res.status(500);
      return res.send();
    }
  }
  return res.send();
}

export {Test, search, searchTrack, searchArtist}
 