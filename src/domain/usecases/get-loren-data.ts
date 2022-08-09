import { ResponseInterface } from "@/data/protocols";
import { CharacterModel } from "@/domain/models";

export interface GetLorenData {
  execute: (characterId: number) => Promise<ResponseInterface<CharacterModel>>;
}
