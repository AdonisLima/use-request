import { useCallback, useEffect, useReducer } from "react";

import {
  ActionInterface,
  ActionTypesEnum,
  GenericUsecase,
  GenericUsecaseDataReturn,
  GenericUsecasePayloadType,
  OptionsInterface,
  StateInterface,
} from "./types";

function requestReducer<ResponseDataType>(
  state: StateInterface<ResponseDataType>,
  action: ActionInterface
): StateInterface<ResponseDataType> {
  switch (action.type) {
    case ActionTypesEnum.PROMISE_PENDING: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case ActionTypesEnum.PROMISE_FULFILLED:
      return {
        ok: action.payload.ok,
        isLoading: false,
        data: action.payload.data,
        error: action.payload.error,
      };
    default:
      return state;
  }
}

export function useRequest<UseCaseType extends GenericUsecase>(
  usecase: UseCaseType,
  options?: OptionsInterface<GenericUsecasePayloadType<UseCaseType>>
) {
  const [state, dispatch] = useReducer<
    (
      state: StateInterface<GenericUsecaseDataReturn<UseCaseType>["data"]>,
      action: ActionInterface
    ) => StateInterface<GenericUsecaseDataReturn<UseCaseType>["data"]>
  >(requestReducer, {
    ok: false,
    data: null,
    isLoading: false,
    error: null,
  });

  const request = useCallback(
    async (payload: GenericUsecasePayloadType<UseCaseType> | void) => {
      dispatch({ type: ActionTypesEnum.PROMISE_PENDING });

      let response;

      if (payload) {
        response = await usecase.execute(payload);

        dispatch({
          type: ActionTypesEnum.PROMISE_FULFILLED,
          payload: response,
        });

        return;
      }

      response = await usecase.execute();

      dispatch({ type: ActionTypesEnum.PROMISE_FULFILLED, payload: response });
    },
    [usecase]
  );

  useEffect(() => {
    if (options?.initialPayload) {
      request(options?.initialPayload);
      return;
    }

    request();
  }, [options?.initialPayload, request]);

  return {
    state,
    request,
  };
}
