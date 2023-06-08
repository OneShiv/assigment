import React, { KeyboardEvent, FocusEvent, ChangeEvent } from "react";
import IconButton from "@mui/material/IconButton";
import Search from "@mui/icons-material/Search";
import { AutoCompleteProps } from "./types";
import SearchOptions from "../common/SearchOptions";
import { Keys } from "./constants";

function AutoComplete(props: AutoCompleteProps) {
  const { setValue, options, label, onEnter, value } = props;

  const [showOptions, setShowOptions] = React.useState(true);
  const [optionIndex, setOptionIndex] = React.useState(-1);
  const optionsSize = props.options.length;
  let timeoutRef = React.useRef<NodeJS.Timeout>();

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case Keys.ESCAPE:
        setShowOptions(false);
      case Keys.ARROW_UP:
        if (optionIndex === 0 || optionIndex === -1) {
          setOptionIndex(options.length - 1);
        } else {
          setOptionIndex((prev) => prev - 1);
        }
        break;
      case Keys.ARROW_DOWN:
        setOptionIndex((prev) => (prev + 1) % optionsSize);
        break;
      case Keys.ENTER:
        // preventing submit
        e.preventDefault();
        if (optionIndex > -1) {
          setShowOptions(false);
          onEnter(options[optionIndex].symbol);
        } else {
          onEnter();
        }
      default:
        break;
    }
  };

  const onBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    timeoutRef.current = setTimeout(() => setShowOptions(false), 1000);
  };

  const onFocus = (e: FocusEvent<HTMLInputElement, Element>) => {
    clearTimeout(timeoutRef.current);
    setShowOptions(true);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <form className="autocomplete">
      <label htmlFor="search">{label}</label>
      <div className="autocomplete-inputWithSearchBtn">
        <input
          type="text"
          autoComplete="off"
          autoCapitalize="none"
          id="search"
          role="combobox"
          aria-expanded={false}
          aria-owns="search-results"
          aria-autocomplete="list"
          onKeyDown={onKeyDown}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          value={value}
          className="autocomplete-searchInput"
          list="search-results"
        />
        <IconButton onClick={() => onEnter()}>
          <Search />
        </IconButton>
      </div>
      {showOptions && value && options && (
        <SearchOptions
          options={options}
          optionIndex={optionIndex}
          onClickHandler={onEnter}
        />
      )}
    </form>
  );
}

export default AutoComplete;
