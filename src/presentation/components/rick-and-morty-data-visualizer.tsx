import { GetRickAndMortyData } from "@/domain/usecases";

import { useRequest } from "../hooks";

export function RickAndMortyDataVisualizer({
  getRickAndMortyData,
}: {
  getRickAndMortyData: GetRickAndMortyData;
}) {
  const { state } = useRequest<GetRickAndMortyData>(getRickAndMortyData, {
    initialPayload: 802,
  });

  if (state.isLoading) {
    return <div>loading...</div>;
  }

  if (state.error) {
    return <div>{state.error.message}</div>;
  }

  return (
    <div>
      <h1>Rick and morty api</h1>
      {JSON.stringify(state.data, null)}
    </div>
  );
}
