import { ChangeEvent } from "react";

export type AutoCompleteProps = {
  label: string;
  options: Option[];
  setValue: (val: string) => void;
  onEnter: (val?: string) => void;
  value: string;
};

export type Option = {
  symbol: string;
  label: string;
};
