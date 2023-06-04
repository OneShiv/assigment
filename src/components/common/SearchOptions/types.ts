import { Option } from "../../AutoComplete/types";

export type SearchOptionsProps = {
  options: Option[];
  optionIndex: number;
  onClickHandler: (symbol: string) => void;
  noOptions: boolean;
};
