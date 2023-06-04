import React, { KeyboardEvent, FocusEvent, ChangeEvent } from "react";
import IconButton from "@mui/material/IconButton";
import Search from "@mui/icons-material/Search";
import { AutoCompleteProps } from "./types";
import SearchOptions from "../common/SearchOptions";
import { Keys } from "./constants";

function AutoComplete(props: AutoCompleteProps) {
  const [showOptions, setShowOptions] = React.useState(false);
  const [optionIndex, setOptionIndex] = React.useState(-1);
  const [searchText, setSearchText] = React.useState("");

  let timeoutId: NodeJS.Timeout;

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case Keys.ESCAPE:
        setShowOptions(false);
      case Keys.ARROW_UP:
        if (optionIndex === 0) {
          setOptionIndex(props.options.length - 1);
        } else {
          setOptionIndex((prev) => prev - 1);
        }
        break;
      case Keys.ARROW_DOWN:
        if (optionIndex >= props.options.length - 1) {
          setOptionIndex(0);
        } else {
          setOptionIndex((prev) => prev + 1);
        }
        break;
      case Keys.ENTER:
        e.preventDefault();
        if (optionIndex > -1) {
          props.onChange && props.onChange(props.options[optionIndex].symbol);
          props.setSelectedValue(props.options[optionIndex].symbol);
          setShowOptions(false);
        } else {
          props.setSelectedValue(searchText);
        }
        setSearchText("");
      default:
        props.onKeyDown && props.onKeyDown(e);
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    props.onChange && props.onChange(e.target.value);
  };

  const onBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    props.onBlur && props.onBlur(e);
    timeoutId = setTimeout(() => setShowOptions(false), 1000);
  };

  const onFocus = (e: FocusEvent<HTMLInputElement, Element>) => {
    clearTimeout(timeoutId);
    setShowOptions(true);
    props.onFocus && props.onFocus(e);
  };

  return (
    <form className="autocomplete">
      <label htmlFor="search">{props.label}</label>
      <div className="input-with-searchbtn">
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
          onChange={onChangeHandler}
          onBlur={onBlur}
          onFocus={onFocus}
          value={searchText}
          className="search-input"
          list="search-results"
        />
        <IconButton>
          <Search />
        </IconButton>
      </div>
      {showOptions && (
        <SearchOptions
          noOptions={searchText !== "" && props.options.length === 0}
          options={props.options}
          optionIndex={optionIndex}
          onClickHandler={(symbol: string) => {
            props.setSelectedValue(symbol);
            setSearchText("");
          }}
        />
      )}
    </form>
  );
}

export default AutoComplete;
