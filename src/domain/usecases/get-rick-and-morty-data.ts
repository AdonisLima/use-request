import { ResponseInterface } from "@/data/protocols";
import { CharacterModel } from "@/domain/models";

export interface GetRickAndMortyData {
  execute: (characterId: number) => Promise<ResponseInterface<CharacterModel>>;
}
