import { CharacterModel } from "@/domain";
import { GetLorenData } from "@/domain/usecases";

import { ResponseInterface } from "../protocols";

export class RemoteGetLorenData implements GetLorenData {
  execute: (characterId: number) => Promise<ResponseInterface<CharacterModel>> =
    async characterId => {
      const apiResponse = await fetch(
        `https://rickandmortyapi.com/api/character/${characterId}`
      );

      const response: ResponseInterface<CharacterModel> = {
        ok: true,
        data: await apiResponse.json(),
        error: null,
      };

      return response;
    };
}
