import { Contact } from './contact';
import { MongooseModel } from './mongooseModel';

export interface User extends MongooseModel {
  email?: string;
  password?: boolean;
  status?: {
    firstSignedIn: boolean,
    verified: boolean,
    locked: boolean,
    closed: boolean
  };
  profile?: Contact;
  connections?: {
    facebook: string,
    twitter: string,
    google: string
  };
  membership?: {
    payment?: string
  };
}
