import "./App.module.css";

import { RemoteGetRickAndMortyData } from "@/data/usecases";
import { RickAndMortyDataVisualizer } from "@/presentation/components";

export function App() {
  return (
    <RickAndMortyDataVisualizer
      getRickAndMortyData={new RemoteGetRickAndMortyData()}
    ></RickAndMortyDataVisualizer>
  );
}
