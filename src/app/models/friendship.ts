import { MongooseModel } from './mongooseModel';
import { User } from './user';

enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DELETED = 'DELETED'
}

export interface Friendship extends MongooseModel {
  requester: User;
  recipient: User;
  status: Status;
  requestOn: Date;
  friendSince: Date;
}
