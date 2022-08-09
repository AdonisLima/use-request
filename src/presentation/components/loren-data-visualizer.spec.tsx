import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastContainer } from "react-toastify";

import { ResponseInterface } from "@/data/protocols";
import { CharacterModel } from "@/domain";
import { GetLorenData } from "@/domain/usecases";
import { GetListOfLorens } from "@/domain/usecases/get-list-of-lorens";
import { fakeData, listOfFakeLorens } from "@/tests";

import { LorenDataVisualizer } from "./loren-data-visualizer";

class RemoteLorenDataSpy implements GetLorenData {
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

class RemoteGetListOfLorens implements GetListOfLorens {
  execute: () => Promise<ResponseInterface<CharacterModel[]>> = async () => {
    const response: ResponseInterface<CharacterModel[]> = {
      ok: true,
      data: listOfFakeLorens,
      error: null,
    };

    return Promise.resolve(response);
  };
}

interface SutInterface {
  getLorenDataSpy?: RemoteLorenDataSpy;
  getListsOfLorensSpy?: GetListOfLorens;
}

function makeSut(params?: SutInterface) {
  const { getLorenDataSpy, getListsOfLorensSpy } = params || {};

  const parsedGetLorenDataSpy = getLorenDataSpy || new RemoteLorenDataSpy();

  const parsedGetListOfLorensSpy =
    getListsOfLorensSpy || new RemoteGetListOfLorens();

  const user = userEvent.setup();

  render(
    <>
      <ToastContainer />
      <LorenDataVisualizer
        getLorenData={parsedGetLorenDataSpy}
        getListOfLorens={parsedGetListOfLorensSpy}
      ></LorenDataVisualizer>
    </>
  );

  return { getLorenDataSpy, user };
}

describe("<LorenDataVisualizer />", () => {
  test("Should render loading state", async () => {
    makeSut();

    const loadingComponent = await screen.findByText("loading...");

    await waitFor(() => {
      expect(loadingComponent).toBeInTheDocument();
    });
  });

  test("Should render an error state", async () => {
    const errorMessage = "UnexpectedError";

    const getLorenDataSpy = new RemoteLorenDataSpy();

    const executeSpy = jest
      .spyOn(getLorenDataSpy, "execute")
      .mockResolvedValueOnce({
        ok: false,
        data: null,
        error: { code: 1, message: errorMessage },
      });

    makeSut({ getLorenDataSpy });

    const errorComponent = await screen.findByText(errorMessage);

    await waitFor(() => {
      expect(errorComponent).toBeInTheDocument();
    });
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  test("Should render proper data", async () => {
    const getLorenDataSpy = new RemoteLorenDataSpy();

    const executeSpy = jest.spyOn(getLorenDataSpy, "execute");

    makeSut({ getLorenDataSpy });

    const stringifiedFakeData = JSON.stringify(fakeData, null);

    const dataVisualizer = await screen.findByText(stringifiedFakeData);

    await waitFor(() => {
      expect(dataVisualizer).toBeInTheDocument();
    });
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  test("Should ba able to retry request programmatically", async () => {
    const getLorenDataSpy = new RemoteLorenDataSpy();

    const executeSpy = jest.spyOn(getLorenDataSpy, "execute");

    const { user } = makeSut({
      getLorenDataSpy: getLorenDataSpy,
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
    const listOfLorensSpy = new RemoteGetListOfLorens();

    const optionalExecuteSpy = jest.spyOn(listOfLorensSpy, "execute");

    makeSut({ getListsOfLorensSpy: listOfLorensSpy });

    const getAreaForListOfLorens = await screen.findByTestId(
      "area-for-lorens-list"
    );

    await waitFor(() => {
      expect(getAreaForListOfLorens).toHaveTextContent("null");
    });
    expect(optionalExecuteSpy).toHaveBeenCalledTimes(0);
  });

  test("Should allow to execute custom behavior on successful request", async () => {
    const { user } = makeSut();

    const requestButton = await screen.findByRole("button", {
      name: /request/i,
    });

    await user.click(requestButton);

    const toast = await screen.findByRole("alert");

    expect(toast).toHaveTextContent("Dados obtidos com sucesso!");
  });

  test("Should allow to execute custom behavior on failed request", async () => {
    const getLorenDataSpy = new RemoteLorenDataSpy();

    const errorMessage = "Any error message";

    jest.spyOn(getLorenDataSpy, "execute").mockResolvedValueOnce({
      ok: false,
      data: null,
      error: { code: 1, message: errorMessage },
    });

    makeSut({ getLorenDataSpy });

    const toast = await screen.findByRole("alert");

    await waitFor(() => {
      expect(toast).toHaveTextContent(errorMessage);
    });
  });
});
