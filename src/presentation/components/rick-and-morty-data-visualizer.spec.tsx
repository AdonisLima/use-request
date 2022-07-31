import { getByText, render, screen, waitFor } from "@testing-library/react";

import { ResponseInterface } from "@/data/protocols";
import { CharacterModel } from "@/domain";
import { GetRickAndMortyData } from "@/domain/usecases";
import { fakeData } from "@/tests";

import { RickAndMortyDataVisualizer } from "./rick-and-morty-data-visualizer";

class RemoteGetRickAndMortyDataMock implements GetRickAndMortyData {
  execute: (characterId: number) => Promise<ResponseInterface<CharacterModel>> =
    async characterId => {
      // const apiResponse = await fetch(
      //   `https://rickandmortyapi.com/api/character/${characterId}`
      // );

      const response: ResponseInterface<CharacterModel> = {
        ok: true,
        data: fakeData,
        error: false,
      };

      return Promise.resolve(response);
    };
}

function makeSut() {
  const getRickAndMortyDataMock = new RemoteGetRickAndMortyDataMock();

  render(
    <RickAndMortyDataVisualizer
      getRickAndMortyData={getRickAndMortyDataMock}
    ></RickAndMortyDataVisualizer>
  );

  return { getRickAndMortyDataMock };
}

describe("<RickAndMortyDataVisualizer />", () => {
  test("should render proper data", async () => {
    makeSut();

    const stringifiedFakeData = JSON.stringify(fakeData, null);

    const dataVisualizer = await screen.findByText(stringifiedFakeData);

    await waitFor(() => {
      expect(dataVisualizer).toBeInTheDocument();
    });
  });
});
