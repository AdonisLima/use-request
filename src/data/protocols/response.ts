export interface ResponseInterface<DataType> {
  ok: boolean;
  data: DataType;
  error: boolean;
}
