import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ResponseInterface } from "@/data/protocols";
import { CharacterModel } from "@/domain";
import { GetRickAndMortyData } from "@/domain/usecases";
import { fakeData } from "@/tests";

import { RickAndMortyDataVisualizer } from "./rick-and-morty-data-visualizer";

class RemoteGetRickAndMortyDataSpy implements GetRickAndMortyData {
  characterId!: number;

  execute: (characterId: number) => Promise<ResponseInterface<CharacterModel>> =
    async characterId => {
      this.characterId = characterId;

      const response: ResponseInterface<CharacterModel> = {
        ok: true,
        data: fakeData,
        error: null,
      };

      return Promise.resolve(response);
    };
}

function makeSut(customGetRickAndMortyDataSpy?: RemoteGetRickAndMortyDataSpy) {
  const getRickAndMortyDataSpy =
    customGetRickAndMortyDataSpy || new RemoteGetRickAndMortyDataSpy();

  const user = userEvent.setup();

  render(
    <RickAndMortyDataVisualizer
      getRickAndMortyData={getRickAndMortyDataSpy}
    ></RickAndMortyDataVisualizer>
  );

  return { getRickAndMortyDataSpy, user };
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

    const getRickAndMortyDataSpy = new RemoteGetRickAndMortyDataSpy();

    const executeSpy = jest
      .spyOn(getRickAndMortyDataSpy, "execute")
      .mockResolvedValueOnce({
        ok: false,
        data: null,
        error: { code: 1, message: errorMessage },
      });

    makeSut(getRickAndMortyDataSpy);

    const errorComponent = await screen.findByText(errorMessage);

    await waitFor(() => {
      expect(errorComponent).toBeInTheDocument();
    });
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  test("should render proper data", async () => {
    const getRickAndMortyDataSpy = new RemoteGetRickAndMortyDataSpy();

    const executeSpy = jest.spyOn(getRickAndMortyDataSpy, "execute");

    makeSut(getRickAndMortyDataSpy);

    const stringifiedFakeData = JSON.stringify(fakeData, null);

    const dataVisualizer = await screen.findByText(stringifiedFakeData);

    await waitFor(() => {
      expect(dataVisualizer).toBeInTheDocument();
    });
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });
});

/**
 * Requirements:
 * should work with any http method
 *
 */

//Todo:
// Allow to retry request
// Make first request optional
// Allow to programmatically request
// Allow to extend success and failure, (state reducer maybe?)
