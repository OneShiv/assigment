import React from "react";
import { screen, render, waitFor } from "@testing-library/react";
import StockSearchLayout from "../../../../src/components/stocks/SearchLayout";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const responseData = {
  bestMatches: [
    {
      "1. symbol": "TS",
      "2. name": "Tenaris S.A.",
      "3. type": "Equity",
      "4. region": "United States",
      "5. marketOpen": "09:30",
      "6. marketClose": "16:00",
      "7. timezone": "UTC-04",
      "8. currency": "USD",
      "9. matchScore": "1.0000",
    },
    {
      "1. symbol": "TS3E.DEX",
      "2. name": "TS3E",
      "3. type": "ETF",
      "4. region": "XETRA",
      "5. marketOpen": "08:00",
      "6. marketClose": "20:00",
      "7. timezone": "UTC+02",
      "8. currency": "EUR",
      "9. matchScore": "0.6667",
    },
  ],
};

describe("[Component : StockSearchlayout]", () => {
  const server = setupServer(
    rest.get("https://www.alphavantage.co/query", (req, res, ctx) => {
      const fnId = req.url.searchParams.get("function");
      if (fnId === "SYMBOL_SEARCH") {
        return res(ctx.json(responseData));
      } else {
        return res(ctx.json({}));
      }
    })
  );
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());
  it("should render results when a search symbol is typed in input", async () => {
    render(
      <Router>
        <StockSearchLayout />
      </Router>
    );
    const inputEl = screen.getByLabelText("Find a Symbol");
    expect(inputEl).toBeInTheDocument();
    userEvent.type(inputEl, "ts3");
    let el = await screen.findByText("TS3E.DEX | TS3E");
    expect(el).toBeInTheDocument();
    userEvent.click(el);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  it("should render empty if value is cleared", async () => {
    render(
      <Router>
        <StockSearchLayout />
      </Router>
    );
    const inputEl = screen.getByLabelText("Find a Symbol");
    expect(inputEl).toBeInTheDocument();
    userEvent.type(inputEl, "ts3");
    let el = await screen.findByText("TS3E.DEX | TS3E");
    expect(el).toBeInTheDocument();
    userEvent.clear(inputEl);
    await waitFor(() => {
      expect(el).not.toBeInTheDocument();
    });
  });
});
