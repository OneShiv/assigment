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

  const deboundecInpValue = useDebounce(inputValue, 300);

  const navigate = useNavigate();
  console.log(stocksList);

  React.useEffect(() => {
    if (deboundecInpValue.length >= 3) {
      fetch(GET_MATCHING_STOCKS, `&keywords=${deboundecInpValue}`).then(
        (resp: StockSearchResponse) => {
          setStocksList(resp.bestMatches);
        }
      );
    }
  }, [deboundecInpValue]);

  const transformedStocks = stocksDataTransformer(stocksList);

  const onChangeHandler = (event: any, newValue: any) => {
    setValue(newValue);
    if (newValue) {
      const id = newValue.symbol;
      setValue(null);
      setInputValue("");
      navigate(`/${id}`);
    }
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
            onChange={(val) => setInputValue(val)}
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
