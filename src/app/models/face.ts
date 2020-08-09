import { MongooseModel } from './mongooseModel';

export interface Face extends MongooseModel {
  srcImage: string;
  thumbnailImageFilename: string;
  awsImageId: string;
  awsFaceId: string;
  details: object;
}
