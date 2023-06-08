import { Option } from "../../AutoComplete/types";
import { SearchOptionsProps } from "./types";

function SearchOption(props: SearchOptionsProps) {
  const { options, optionIndex, onClickHandler } = props;
  return (
    <>
      {!options.length && <div>No options try different search term</div>}
      {options.length > 0 && (
        <ul id="search-results" role="listbox" className="hidden" tabIndex={-1}>
          {options.map((option: Option, index: number) => (
            <li
              key={option.symbol}
              tabIndex={-1}
              id={option.label}
              aria-selected={optionIndex === index ? "true" : "false"}
              data-option-value={option.symbol}
              role="option"
              className={optionIndex === index ? "active" : "inactive"}
              onClick={() => onClickHandler(option.symbol)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default SearchOption;
