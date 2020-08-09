import { MongooseModel } from './mongooseModel';
import { User } from './user';

enum MessageType {
  TEXT = 'TEXT',
  CONTACT = 'CONTACT',
  IMAGE = 'IMAGE'
}

export interface Message extends MongooseModel {
  sender?: string | User;
  receiver?: string | User;
  type?: MessageType;
  content?: string;
  unread?: boolean;
  timestamp?: Date;
}
