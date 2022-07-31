import { useCallback, useEffect, useReducer } from "react";

function requestReducer(state: any, action: any) {
  const { type, payload } = action;

  switch (type) {
    case "LOADING": {
      return {
        ...state,
        isLoading: true,
      };
    }
    case "FETCH_SUCCESS":
      return {
        isLoading: false,
        data: payload.data,
        error: "",
      };
    case "FETCH_ERROR":
      return {
        isLoading: false,
        data: payload.data,
        error: payload.error,
      };
    default:
      return state;
  }
}

export function useRequest(execute: (arg: any) => Promise<any>) {
  const [state, dispatch] = useReducer(requestReducer, {
    data: null,
    isLoading: false,
    error: "",
  });

  const request = useCallback(async () => {
    dispatch({ type: "LOADING" });

    const response = await execute(802);

    dispatch({ type: "FETCH_SUCCESS", payload: response });
  }, [execute]);

  useEffect(() => {
    request();
  }, [request]);

  return {
    state,
  };
}
