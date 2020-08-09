import { MongooseModel } from './mongooseModel';

export interface Group extends MongooseModel {
  owner: string;
  name: string;
  color: string;
  numContacts: number;
}
