import { KeyboardEvent, FocusEvent } from "react";

export type AutoCompleteProps = {
  label: string;
  options: Option[];
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (value: string) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  setSelectedValue: (option: string) => void;
};

export type Option = {
  symbol: string;
  label: string;
  id: string;
};
