export interface Response<T> {
  data?: T;
  errors?: {
    msg: string
  };
}
