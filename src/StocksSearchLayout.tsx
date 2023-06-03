import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import { stocksData } from "./data";
import Search from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { fetch } from "./api";
import { GET_MATCHING_STOCKS } from "./api/constants";

const stocksDataTransformer = (stocks: any) => {
  console.log("stocks", stocks);
  return stocks.map((stock: any) => ({
    symbol: stock["1. symbol"],
    id: stock["1. symbol"],
    label: `${stock["1. symbol"]} | ${stock["2. name"]}`
  }));
};

function StocksSearchLayout() {
  const [value, setValue] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [stocksList, setStocksList] = React.useState([]);

  const navigate = useNavigate();
  console.log(stocksList);
  React.useEffect(() => {
    if (inputValue.length >= 3) {
      fetch(GET_MATCHING_STOCKS, `&keywords=${inputValue}`).then((resp) => {
        setStocksList(resp.data.bestMatches);
      });
    }
  }, [inputValue]);

  const transformedStocks = stocksDataTransformer(stocksList);
  console.log("ssl", {
    transformedStocks
  });
  const onChangeHandler = (event: any, newValue: any) => {
    setValue(newValue);
    navigate(`/${newValue.label}`);
  };

  return (
    <>
      <section className="stocks-search">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={transformedStocks}
          value={value}
          onChange={onChangeHandler}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => {
            console.log(params);
            return <TextField {...params} label="Stock" />;
          }}
        />
        <IconButton>
          <Search />
        </IconButton>
      </section>
    </>
  );
}

export default StocksSearchLayout;
