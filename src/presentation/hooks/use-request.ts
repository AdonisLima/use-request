import { useCallback, useEffect, useReducer } from "react";

import {
  ActionInterface,
  ActionTypesEnum,
  GenericUsecase,
  OptionsInterface,
  StateInterface,
} from "./types";

function requestReducer(
  state: StateInterface,
  action: ActionInterface
): StateInterface {
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
  options: OptionsInterface<Parameters<UseCaseType["execute"]>[0]>
) {
  const { initialPayload } = options;

  const [state, dispatch] = useReducer<
    (state: StateInterface, action: ActionInterface) => StateInterface
  >(requestReducer, {
    ok: false,
    data: null,
    isLoading: false,
    error: null,
  });

  const request = useCallback(async () => {
    dispatch({ type: ActionTypesEnum.PROMISE_PENDING });

    const response = await usecase.execute(initialPayload);

    dispatch({ type: ActionTypesEnum.PROMISE_FULFILLED, payload: response });
  }, [usecase, initialPayload]);

  useEffect(() => {
    request();
  }, [request]);

  return {
    state,
  };
}
