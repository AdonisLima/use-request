import { ResponseInterface } from "@/data/protocols";
import { CharacterModel } from "@/domain/models";

export interface GetListOfLorens {
  execute: () => Promise<ResponseInterface<CharacterModel[]>>;
}
