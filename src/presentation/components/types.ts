import { GetLorenData } from "@/domain/usecases";
import { GetListOfLorens } from "@/domain/usecases/get-list-of-lorens";

export interface LorenDataVisualizer {
  getLorenData: GetLorenData;
  getListOfLorens: GetListOfLorens;
}
