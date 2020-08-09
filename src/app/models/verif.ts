import { MongooseModel } from './mongooseModel';

export interface Verif extends MongooseModel {
  userId: string;
  expiredAt: Date;
  token: string;
}
