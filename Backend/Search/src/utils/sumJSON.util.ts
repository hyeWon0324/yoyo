import parseJson from 'parse-json';
import {Tracks} from '../entities/Tracks';
import {Users} from '../entities/Users';

export const sumObjectToJSON = function(first: Tracks[] | Users[], second:Users[]): string{
  const trLength = first.length;
  const idLength = first.length;
  const header = {trLength:trLength,idLength:idLength};
  const headerJSON = JSON.stringify(header)+',';
  const user1JSON = JSON.stringify(first).split('[')[1].split(']')[0]+',';
  const user2JSON = JSON.stringify(second).split('[')[1].split(']')[0];
  const result = '['+headerJSON+user1JSON+user2JSON+']';
  return result;
}
