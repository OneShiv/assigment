import React from "react";
import { KeyboardEvent, ChangeEvent, FocusEvent } from "react";
import { List } from "react-virtualized";
import IconButton from "@mui/material/IconButton";
import Search from "@mui/icons-material/Search";
import "react-virtualized/styles.css";
import { setOptions } from "react-chartjs-2/dist/utils";

type AutoCompleteProps = {
  label: string;
  options: Option[];
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (value: string) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  setSelectedValue: (option: Option) => void;
};

type Option = {
  symbol: string;
  label: string;
  id: string;
};

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
          props.setSelectedValue(props.options[optionIndex]);
          setShowOptions(false);
        }
      default:
        props.onKeyDown && props.onKeyDown(e);
    }
  };

  const onChangeHandler = (e: any) => {
    setSearchText(e.target.value);
    props.onChange && props.onChange(searchText);
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
                      props.setSelectedValue(props.options[index]);
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
