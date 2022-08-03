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
  error: ErrorInterface;
}

export interface ErrorInterface {
  code: number;
  message: string;
}
