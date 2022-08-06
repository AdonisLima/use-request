import { ErrorInterface, ResponseInterface } from "@/data/protocols";

export interface StateInterface<UsecaseReturnType> {
  ok: boolean;
  isLoading: boolean;
  data: UsecaseReturnType | null;
  error: ErrorInterface | null;
}

export type PromiseResponseType = ResponseInterface<any>;

export type UsecaseParams<UseCaseType extends GenericUsecase> =
  OptionsInterface<Parameters<UseCaseType["execute"]>[0]>;

export type GenericUsecasePayloadType<UseCaseType extends GenericUsecase> =
  Parameters<UseCaseType["execute"]>[0];

export type GenericUsecaseDataReturn<UseCaseType extends GenericUsecase> =
  Awaited<ReturnType<UseCaseType["execute"]>>;

export enum ActionTypesEnum {
  PROMISE_PENDING = "PROMISE_PENDING",
  PROMISE_FULFILLED = "PROMISE_FULFILLED",
}

export type ActionInterface =
  | {
      type: ActionTypesEnum.PROMISE_FULFILLED;
      payload: PromiseResponseType;
    }
  | {
      type: ActionTypesEnum.PROMISE_PENDING;
    };

type UsecasePayloadType = string | number | object | null | undefined | void;

export interface GenericUsecase {
  execute(payload: UsecasePayloadType): Promise<ResponseInterface<any>>;
}

export interface OptionsInterface<InitialUsecasePayloadType> {
  initialPayload?: InitialUsecasePayloadType;
  shouldRequestOnLoad?: boolean;
  onSuccess?: () => void;
}
