import "./App.module.css";

import { ToastContainer } from "react-toastify";

import { RemoteGetLorenData } from "@/data/usecases";
import { LorenDataVisualizer } from "@/presentation/components";

export function App() {
  return (
    <>
      <ToastContainer />

      <LorenDataVisualizer
        getLorenData={new RemoteGetLorenData()}
      ></LorenDataVisualizer>
    </>
  );
}
