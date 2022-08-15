export interface IResponse {
  status: number;
  message: string;
  response: {
    token: string;
    name: string;
    email: string;
    id: string;
  };
}
