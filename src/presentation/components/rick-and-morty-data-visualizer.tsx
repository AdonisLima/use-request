import { useMemo } from "react";

import { GetRickAndMortyData } from "@/domain/usecases";

import { useRequest } from "../hooks";

export function RickAndMortyDataVisualizer({
  getRickAndMortyData,
}: {
  getRickAndMortyData: GetRickAndMortyData;
}) {
  const execute = useMemo(
    () => getRickAndMortyData.execute,
    [getRickAndMortyData.execute]
  );

  const { state } = useRequest(execute);

  return (
    <div>
      <h1>Rick and morty api</h1>
      {JSON.stringify(state, null, 3)}
    </div>
  );
}
