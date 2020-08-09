import { MongooseModel } from './mongooseModel';
import { Group } from './group';
import { Face } from './face';

export interface Contact extends MongooseModel {
  name?: {
    full?: string,
    first?: string,
    last?: string
  };
  phones?: {
    label: string,
    number: string
  }[];
  emails?: {
    label: string,
    address: string
  }[];
  occupation?: {
    company: string,
    position: string
  };
  socials?: {
    platform: string,
    username: string
  }[];
  faces?: {
    avatar: string,
    list: string[] | Face[]
  };
  relatedPhotos?: string[];
  group?: string | Group;
}
