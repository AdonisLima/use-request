import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ResponseInterface } from "@/data/protocols";
import { CharacterModel } from "@/domain";
import { GetRickAndMortyData } from "@/domain/usecases";
import { GetListOfRicks } from "@/domain/usecases/get-list-of-ricks";
import { fakeData, listOfFakeRicks } from "@/tests";

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

class RemoteGetListOfRicks implements GetListOfRicks {
  execute: () => Promise<ResponseInterface<CharacterModel[]>> = async () => {
    const response: ResponseInterface<CharacterModel[]> = {
      ok: true,
      data: listOfFakeRicks,
      error: null,
    };

    return Promise.resolve(response);
  };
}

interface SutInterface {
  getRickAndMortyDataSpy?: RemoteGetRickAndMortyDataSpy;
  getListsOfRicksSpy?: GetListOfRicks;
}

function makeSut(params?: SutInterface) {
  const { getRickAndMortyDataSpy, getListsOfRicksSpy } = params || {};

  const parsedGetRickAndMortyDataSpy =
    getRickAndMortyDataSpy || new RemoteGetRickAndMortyDataSpy();

  const parsedGetListOfRicksSpy =
    getListsOfRicksSpy || new RemoteGetListOfRicks();

  const user = userEvent.setup();

  render(
    <RickAndMortyDataVisualizer
      getRickAndMortyData={parsedGetRickAndMortyDataSpy}
      getListOfRicks={parsedGetListOfRicksSpy}
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

    makeSut({ getRickAndMortyDataSpy });

    const errorComponent = await screen.findByText(errorMessage);

    await waitFor(() => {
      expect(errorComponent).toBeInTheDocument();
    });
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  test("Should render proper data", async () => {
    const getRickAndMortyDataSpy = new RemoteGetRickAndMortyDataSpy();

    const executeSpy = jest.spyOn(getRickAndMortyDataSpy, "execute");

    makeSut({ getRickAndMortyDataSpy });

    const stringifiedFakeData = JSON.stringify(fakeData, null);

    const dataVisualizer = await screen.findByText(stringifiedFakeData);

    await waitFor(() => {
      expect(dataVisualizer).toBeInTheDocument();
    });
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  test("Should ba able to retry request programmatically", async () => {
    const getRickAndMortyDataSpy = new RemoteGetRickAndMortyDataSpy();

    const executeSpy = jest.spyOn(getRickAndMortyDataSpy, "execute");

    const { user } = makeSut({
      getRickAndMortyDataSpy: getRickAndMortyDataSpy,
    });

    const requestButton = await screen.findByRole("button", {
      name: /request/i,
    });

    await user.click(requestButton);

    await waitFor(() => {
      expect(executeSpy).toHaveBeenCalledTimes(2);
    });
  });

  test("Should allow request on page load to be optional", async () => {
    const listOfRicksSpy = new RemoteGetListOfRicks();

    const optionalExecuteSpy = jest.spyOn(listOfRicksSpy, "execute");

    makeSut({});

    const getAreaForListOfRicks = await screen.findByTestId(
      "area-for-ricks-list"
    );

    await waitFor(() => {
      expect(getAreaForListOfRicks).toHaveTextContent("null");
    });
    expect(optionalExecuteSpy).toHaveBeenCalledTimes(0);
  });
});

/**
 * Requirements:
 * should work with any http method
 */

//Todo:
// Make first request optional
// Allow to extend success and failure, (state reducer maybe?)
