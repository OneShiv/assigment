import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MyAutoComplete from "../Autocomplete";

import IconButton from "@mui/material/IconButton";
import Search from "@mui/icons-material/Search";
import { Outlet, useNavigate } from "react-router-dom";
import { fetch } from "../../api";
import { GET_MATCHING_STOCKS } from "../../api/constants";
import { useDebounce } from "../../hooks/useDebounce";
import { stocksDataTransformer } from "../../utils";
import { Stock, StockSearchResponse } from "./types";

function StocksSearchLayout() {
  const [value, setValue] = React.useState<{
    symbol: string;
    id: string;
    label: string;
  } | null>(null);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [stocksList, setStocksList] = React.useState<Stock[]>([]);

  const debouncedInputValue = useDebounce(inputValue, 300);
  console.log(debouncedInputValue);

  const navigate = useNavigate();
  console.log(stocksList);

  React.useEffect(() => {
    if (debouncedInputValue.length >= 2) {
      fetch(GET_MATCHING_STOCKS, `&keywords=${debouncedInputValue}`).then(
        (resp: StockSearchResponse) => {
          setStocksList(resp.bestMatches);
        }
      );
    }
  }, [debouncedInputValue]);

  const transformedStocks = stocksDataTransformer(stocksList);

  const onChangeHandler = (newValue: string) => {
    setInputValue(newValue);
  };

  return (
    <>
      <section>
        <h1>Stock Screener</h1>
        <section className="stocks-search">
          {/* <Autocomplete
            disablePortal
            id="stock-search-ac"
            options={transformedStocks}
            value={value}
            onChange={onChangeHandler}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => {
              return <TextField {...params} label="Find a Symbol" />;
            }}
          /> */}
          <MyAutoComplete
            options={transformedStocks}
            onChange={onChangeHandler}
            label="Find a Symbol"
            setSelectedValue={(value) => {
              console.log(value);
              setValue(value);
              navigate(`/${value.symbol}`);
            }}
          />
        </section>
        <Outlet />
      </section>
    </>
  );
}

export default StocksSearchLayout;
