export type Response<T> = {
  status: {
    code: string;
    message: string;
    requestId: string;
    requestTime: number;
  };
  data: T;
};
