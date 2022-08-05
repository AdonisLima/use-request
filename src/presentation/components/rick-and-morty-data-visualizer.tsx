/* eslint-disable simple-import-sort/imports */
import { GetRickAndMortyData } from "@/domain/usecases";
import { GetListOfRicks } from "@/domain/usecases/get-list-of-ricks";

import { useRequest } from "../hooks";

import { RickAndMortyDataVisualizer } from "./types";

export function RickAndMortyDataVisualizer({
  getRickAndMortyData,
  getListOfRicks,
}: RickAndMortyDataVisualizer) {
  const { state, request } = useRequest<GetRickAndMortyData>(
    getRickAndMortyData,
    {
      initialPayload: 805,
    }
  );

  const { state: listOfRicksState } = useRequest<GetListOfRicks>(
    getListOfRicks,
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
      <h1>Rick and morty api</h1>
      <h2>A single rick:</h2>
      <div>{JSON.stringify(state.data, null)}</div>
      <button
        onClick={() => {
          request(802);
        }}
      >
        request
      </button>
      <h2>List of Ricks</h2>
      <div data-testid={"area-for-ricks-list"}>
        {JSON.stringify(listOfRicksState.data, null)}
      </div>
    </div>
  );
}
