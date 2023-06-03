import "./styles.css";
import { Route, Routes } from "react-router-dom";
import StocksSearchLayout from "./components/StockSearchLayout";
import StockDetails from "./components/StockDetails";

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
