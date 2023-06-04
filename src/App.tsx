import StockDetails from "./components/stocks/Details";
import StocksSearchLayout from "./components/stocks/SearchLayout";
import "./styles.css";
import { Route, Routes } from "react-router-dom";

export default function App() {
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
