import { ResponseInterface } from "@/data/protocols";
import { CharacterModel } from "@/domain";
import { GetRickAndMortyData } from "@/domain/usecases";
import { fakeData } from "@/tests";

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
