/* eslint-disable simple-import-sort/imports */
import { ErrorInterface } from "@/data/protocols";
import { GetLorenData } from "@/domain/usecases";
import { GetListOfLorens } from "@/domain/usecases/get-list-of-lorens";
import { useCallback } from "react";
import { toast } from "react-toastify";

import { useRequest } from "../hooks";

import { LorenDataVisualizer } from "./types";

export function LorenDataVisualizer({
  getLorenData,
  getListOfLorens,
}: LorenDataVisualizer) {
  const { state, request } = useRequest<GetLorenData>(getLorenData, {
    initialPayload: 805,

    onSuccess: useCallback(() => {
      toast("Dados obtidos com sucesso!");
    }, []),
    onFailure: useCallback((error: ErrorInterface) => {
      toast(error.message);
    }, []),
  });

  const { state: listOfLorensState } = useRequest<GetListOfLorens>(
    getListOfLorens,
    { shouldRequestOnLoad: false }
  );

  if (state.isLoading) {
    return <div>loading...</div>;
  }

  if (state.error) {
    return <div>{state.error.message}</div>;
  }

  return (
    <div>
      <h1>Loren api</h1>
      <h2>A single Loren:</h2>
      <div>{JSON.stringify(state.data, null)}</div>
      <button
        onClick={() => {
          request(802);
        }}
      >
        Request
      </button>
      <h2>List of Lorens</h2>
      <div data-testid={"area-for-lorens-list"}>
        {JSON.stringify(listOfLorensState.data, null)}
      </div>
    </div>
  );
}
