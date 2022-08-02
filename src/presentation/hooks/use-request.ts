import { useCallback, useEffect, useReducer } from "react";

function requestReducer(state: any, action: any) {
  const { type, payload } = action;

  switch (type) {
    case "PROMISE_PENDING": {
      return {
        ...state,
        isLoading: true,
      };
    }
    case "PROMISE_FULFILLED":
      return {
        isLoading: false,
        data: payload.data,
        error: payload.error,
      };
    default:
      return state;
  }
}

export function useRequest(execute: (arg: any) => Promise<any>, options: any) {
  const { initialPayload } = options;

  const [state, dispatch] = useReducer(requestReducer, {
    data: null,
    isLoading: false,
    error: null,
  });

  const request = useCallback(async () => {
    dispatch({ type: "PROMISE_PENDING" });

    const response = await execute(initialPayload);

    dispatch({ type: "PROMISE_FULFILLED", payload: response });
  }, [execute, initialPayload]);

  useEffect(() => {
    request();
  }, [request]);

  return {
    state,
  };
}
