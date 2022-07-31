export type ResponseInterface<DataType> =
  | SuccessfulResponse<DataType>
  | FailureResponse;

export interface SuccessfulResponse<DataType> {
  ok: true;
  data: DataType;
  error: null;
}

export interface FailureResponse {
  ok: false;
  data: null;
  error: { code: number; message: string };
}
