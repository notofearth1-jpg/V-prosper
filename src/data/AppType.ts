import { ChangeEvent } from "react";
import { SERVICE_METHODS } from "../utils/AppEnumerations";
import { IPagination } from "./AppInterface";

export type IServiceMethods =
  | SERVICE_METHODS.GET
  | SERVICE_METHODS.GET_CONFIG
  | SERVICE_METHODS.POST
  | SERVICE_METHODS.POST_CONFIG
  | SERVICE_METHODS.PUT
  | SERVICE_METHODS.PUT_CONFIG
  | SERVICE_METHODS.DELETE
  | SERVICE_METHODS.DELETE_CONFIG
  | SERVICE_METHODS.REQUEST;

export type TUseTranslationTfn = (text: string) => string;

export type TDateFormat = 1 | 2 | 3 | 4;

export type TTimeFormat = 1 | 2;

export type TReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type TSetPaginationFn = (value: IPagination) => void;

export type TIsActive = "1" | "0";

export type TOnChangeInput = ChangeEvent<HTMLInputElement>;

export type TOnChangeSelect = ChangeEvent<HTMLSelectElement>;

export type TScrollEvent = React.UIEvent<HTMLDivElement>;

export interface ISelectOptionType {
  label: string;
  value: string;
}
