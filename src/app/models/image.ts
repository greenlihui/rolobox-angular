import { MongooseModel } from './mongooseModel';
import { Face } from './face';
import { User } from './user';

export interface Image extends MongooseModel {
  owner?: User;
  filename?: string;
  faces?: Face[];
  uploadedOn?: Date;
  faceDetails?: any;
}

export class BoundingBox {
  constructor(public left: string,
              public top: string,
              public width: string,
              public height: string) {
  }
}
