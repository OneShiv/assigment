import React from "react";
import { KeyboardEvent, FocusEvent, ChangeEvent } from "react";
import { List } from "react-virtualized";
import IconButton from "@mui/material/IconButton";
import Search from "@mui/icons-material/Search";
import "react-virtualized/styles.css";
import { AutoCompleteProps, Option } from "./types";

function AutoComplete(props: AutoCompleteProps) {
  const [showOptions, setShowOptions] = React.useState(false);
  const [optionIndex, setOptionIndex] = React.useState(-1);
  const [searchText, setSearchText] = React.useState("");
  const listRef = React.useRef<HTMLUListElement>();

  let timeoutId: NodeJS.Timeout;

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);
    switch (e.key) {
      case "Escape":
        setShowOptions(false);
      case "ArrowUp":
        if (optionIndex === 0) {
          setOptionIndex(props.options.length - 1);
        } else {
          setOptionIndex((prev) => prev - 1);
        }
        break;
      case "ArrowDown":
        if (optionIndex >= props.options.length - 1) {
          setOptionIndex(0);
        } else {
          setOptionIndex((prev) => prev + 1);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (optionIndex > -1) {
          props.onChange && props.onChange(props.options[optionIndex].symbol);
          props.setSelectedValue(searchText);
          setShowOptions(false);
        }
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
    <section className="autocomplete-field">
      <label htmlFor="search">{props.label}</label>
      <div className="autocomplete">
        <form>
          <div className="input-btn-wrapper">
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
          {props.options.length === 0 && searchText !== "" && (
            <div>No options try different search term</div>
          )}
          <ul
            id="search-results"
            role="listbox"
            className="hidden"
            ref={listRef as any}
            tabIndex={-1}
          >
            {showOptions &&
              props.options.map((option, index) => {
                return (
                  <li
                    tabIndex={-1}
                    id={option.label}
                    aria-selected="false"
                    data-option-value={option.symbol}
                    key={option.label}
                    role="option"
                    className={optionIndex === index ? "active" : "inactive"}
                    onClick={() => {
                      console.log("clicked", index);
                      props.setSelectedValue(props.options[index].symbol);
                    }}
                  >
                    {props.options[index].label}
                  </li>
                );
              })}
          </ul>
        </form>
      </div>
    </section>
  );
}

export default AutoComplete;
