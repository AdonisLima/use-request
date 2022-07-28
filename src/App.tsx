import "./App.module.css";

import React, { useCallback, useEffect, useMemo, useReducer } from "react";

interface CharacterModel {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

interface ResponseInterface<DataType> {
  ok: boolean;
  data: DataType;
  error: boolean;
}

interface GetRickAndMortyData {
  execute: (characterId: number) => Promise<ResponseInterface<CharacterModel>>;
}

export class RemoteGetRickAndMortyData implements GetRickAndMortyData {
  execute: (characterId: number) => Promise<ResponseInterface<CharacterModel>> =
    async characterId => {
      const apiResponse = await fetch(
        `https://rickandmortyapi.com/api/character/${characterId}`
      );

      const response: ResponseInterface<CharacterModel> = {
        ok: true,
        data: await apiResponse.json(),
        error: false,
      };

      return response;
    };
}

function requestReducer(state: any, action: any) {
  const { type, payload } = action;

  switch (type) {
    case "LOADING": {
      return {
        ...state,
        loading: true,
      };
    }
    case "FETCH_SUCCESS":
      return {
        loading: false,
        data: payload.data,
        error: "",
      };
    case "FETCH_ERROR":
      return {
        loading: false,
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

export default function App() {
  const execute = useMemo(() => new RemoteGetRickAndMortyData().execute, []);

  const { state } = useRequest(execute);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <div>
      <h1 className="teste">Rick and morty api</h1>
      {JSON.stringify(state, null, 3)}
    </div>
  );
}
