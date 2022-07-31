import { CharacterModel } from "@/domain";
import { GetRickAndMortyData } from "@/domain/usecases";

import { ResponseInterface } from "../protocols";

export class RemoteGetRickAndMortyData implements GetRickAndMortyData {
  execute: (characterId: number) => Promise<ResponseInterface<CharacterModel>> =
    async characterId => {
      const apiResponse = await fetch(
        `https://rickandmortyapi.com/api/character/${characterId}`
      );

      const response: ResponseInterface<CharacterModel> = {
        ok: true,
        data: await apiResponse.json(),
        error: false,
      };

      return response;
    };
}
