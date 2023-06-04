import "./styles.css";
import { Route, Routes } from "react-router-dom";
import StocksSearchLayout from "./components/StockSearchLayout";
import StockDetails from "./components/StockDetails";
import { useState } from "react";

export default function App() {
  const [searchText, setSearchText] = useState("");
  const options = [
    {
      label: "aa",
      value: "aa",
    },
    {
      label: "bb",
      value: "bb",
    },
    {
      label: "cc",
      value: "cc",
    },
    {
      label: "dd",
      value: "dd",
    },
    {
      label: "ef",
      value: "ef",
    },
    {
      label: "ge",
      value: "ge",
    },
    {
      label: "he",
      value: "he",
    },
    {
      label: "le",
      value: "le",
    },
    {
      label: "me",
      value: "me",
    },
  ];
  const onBlur = (e: any) => console.log("blur", e);
  const onChange = (value: string) => setSearchText(value);
  const onKeyDown = (e: any) => {};
  const setSelectedValue = (opt: any) => console.log(opt);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<StocksSearchLayout />}>
          <Route path="/:id" element={<StockDetails />} />
        </Route>
      </Routes>
    </div>
  );
}
