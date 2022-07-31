import { render, screen, waitFor } from "@testing-library/react";

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
        error: null,
      };

      return Promise.resolve(response);
    };
}

function makeSut(mockedResolvedValue?: ResponseInterface<CharacterModel>) {
  const getRickAndMortyDataMock = new RemoteGetRickAndMortyDataMock();

  if (mockedResolvedValue) {
    jest
      .spyOn(getRickAndMortyDataMock, "execute")
      .mockResolvedValueOnce(mockedResolvedValue);
  }

  render(
    <RickAndMortyDataVisualizer
      getRickAndMortyData={getRickAndMortyDataMock}
    ></RickAndMortyDataVisualizer>
  );

  return { getRickAndMortyDataMock };
}

describe("<RickAndMortyDataVisualizer />", () => {
  test("Should render loading state", async () => {
    makeSut();

    const loadingComponent = await screen.findByText("loading...");

    await waitFor(() => {
      expect(loadingComponent).toBeInTheDocument();
    });
  });

  test("Should render an error state", async () => {
    const errorMessage = "UnexpectedError";

    makeSut({
      ok: false,
      data: null,
      error: { code: 1, message: errorMessage },
    });

    const errorComponent = await screen.findByText(errorMessage);

    await waitFor(() => {
      expect(errorComponent).toBeInTheDocument();
    });
  });

  test("should render proper data", async () => {
    makeSut();

    const stringifiedFakeData = JSON.stringify(fakeData, null);

    const dataVisualizer = await screen.findByText(stringifiedFakeData);

    await waitFor(() => {
      expect(dataVisualizer).toBeInTheDocument();
    });
  });
});
