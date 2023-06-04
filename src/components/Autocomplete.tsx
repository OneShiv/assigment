// @ts-nocheck
import React, { LegacyRef, RefObject } from "react";
import { KeyboardEvent, ChangeEvent, FocusEvent } from "react";
import List from "react-virtualized";

type AutoCompleteProps = {
  label: string;
  value: string;
  options: Option[];
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (value: string) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  setSelectedValue: (option: Option) => void;
};

type Option = {
  label: string;
  value: string;
};

function AutoComplete(props: AutoCompleteProps) {
  const [showOptions, setShowOptions] = React.useState(false);
  const [optionIndex, setOptionIndex] = React.useState(-1);

  const listRef = React.createRef<HTMLUListElement>();

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
          props.onChange(props.options[optionIndex].value);
          props.setSelectedValue(props.options[optionIndex]);
        }
      default:
        props.onKeyDown && props.onKeyDown(e);
    }
  };

  const onChangeHandler = (e) => {
    props.onChange(e.target.value);
  };

  const onBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    setShowOptions(false);
    props.onBlur && props.onBlur(e);
  };

  const onFocus = (e: FocusEvent<HTMLInputElement, Element>) => {
    setShowOptions(true);
    props.onFocus && props.onFocus(e);
  };
  console.log(optionIndex);

  function renderOption({ index, key, style }) {
    return (
      <li
        tabIndex={-1}
        id={option.label}
        aria-selected="false"
        data-option-value={option.value}
        key={option.label}
        role="option"
        className={optionIndex === index ? "active" : "inactive"}
        onClick={() => {
          props.setSelectedValue(option);
        }}
      >
        {option.label}
      </li>
    );
  }

  return (
    <section className="autocomplete-field">
      <label htmlFor="search">{props.label}</label>
      <select
        name="search"
        aria-hidden="true"
        tabIndex={-1}
        className="visually-hidden"
      >
        {showOptions &&
          props.options.map((option) => {
            return <option key={`opt-${option.label}`}>{option.label}</option>;
          })}
      </select>
      <div className="autocomplete">
        <form>
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
            value={props.value}
            className="search-input"
            list="search-results"
          />
          <ul
            id="search-results"
            role="listbox"
            className="hidden"
            ref={listRef}
            tabIndex={-1}
          >
            {showOptions &&
              props.options.map((option, index) => {
                return (
                  <li
                    tabIndex={-1}
                    id={option.label}
                    aria-selected="false"
                    data-option-value={option.value}
                    key={option.label}
                    role="option"
                    className={optionIndex === index ? "active" : "inactive"}
                    onClick={() => {
                      props.setSelectedValue(option);
                    }}
                  >
                    {option.label}
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
