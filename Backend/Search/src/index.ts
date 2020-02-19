import {App} from './app';
import "reflect-metadata";
import {createConnection, Like} from "typeorm";
import { Users } from './entities/Users';
import {connectionOptions} from './utils/ormConnectionOption.util';
import parseJson = require('parse-json');

createConnection(connectionOptions).then(async connection => {
  const UsersRepository = await connection.getRepository(Users);
  const savedUser = await UsersRepository.find({userId: Like("%jys%")});
  const User1: Users = savedUser[0];
  const usersJSON = JSON.stringify(savedUser);
  const prettierParsing = parseJson(usersJSON);
  console.log(Object.keys(prettierParsing).length);                                                                    
}).catch(error => console.log(error));


(async function main(){
  const app = new App();
  await app.listen();


})();