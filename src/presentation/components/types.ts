import { GetRickAndMortyData } from "@/domain/usecases";
import { GetListOfRicks } from "@/domain/usecases/get-list-of-ricks";

export interface RickAndMortyDataVisualizer {
  getRickAndMortyData: GetRickAndMortyData;
  getListOfRicks: GetListOfRicks;
}
