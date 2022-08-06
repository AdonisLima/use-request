import "./App.module.css";

import { ToastContainer } from "react-toastify";

import { RemoteGetRickAndMortyData } from "@/data/usecases";
import { RickAndMortyDataVisualizer } from "@/presentation/components";

export function App() {
  return (
    <>
      <ToastContainer />

      <RickAndMortyDataVisualizer
        getRickAndMortyData={new RemoteGetRickAndMortyData()}
      ></RickAndMortyDataVisualizer>
    </>
  );
}
