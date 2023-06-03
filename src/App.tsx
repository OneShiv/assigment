import "./styles.css";
import { Route, Routes } from "react-router-dom";
import StocksSearchLayout from "./StocksSearchLayout";
import StockDetails from "./StockDetails";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<StocksSearchLayout />} />
        <Route path="/:id" element={<StockDetails />} />
      </Routes>
    </div>
  );
}
