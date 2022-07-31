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

/**
 * Requirements:
 * should work with any method
 *
 */

// TestCases
// Should return error on request
// Shoud return successful result

//Todo:
// Allow to pass custom payload to request
// Allow to retry request
// Allow to programatically request, instead of
// Allow to extend reducer, (state reducer maybe?)
