import { ResponseInterface } from "@/data/protocols";
import { CharacterModel } from "@/domain/models";

export interface GetListOfRicks {
  execute: () => Promise<ResponseInterface<CharacterModel[]>>;
}
