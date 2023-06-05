import StockDetails from "../../../../src/components/stocks/Details";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import Router from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  globalQuote,
  intraDayData,
  overViewData,
} from "../../../../mock_data/data";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("[Component: StockDetails Success Case]", () => {
  jest.spyOn(Router, "useParams").mockReturnValue({ id: "TSLA" });

  const server = setupServer(
    rest.get("https://www.alphavantage.co/query", (req, res, ctx) => {
      let fn = req.url.searchParams.get("function");
      if (fn === "OVERVIEW") {
        return res(ctx.json(overViewData));
      } else if (fn === "TIME_SERIES_INTRADAY") {
        return res(ctx.json(intraDayData));
      } else {
        return res(ctx.json(globalQuote));
      }
    })
  );
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  it("should render data when api resolves correct data", async () => {
    render(<StockDetails />);

    await waitFor(() => {
      expect(screen.getByText("NVIDIA Corporation (NVDA)")).toBeInTheDocument();
      expect(screen.getByText("More Details :")).toBeInTheDocument();
    });
  });
});

xdescribe("[Component: StockDetails Error Case]", () => {
  jest.spyOn(Router, "useParams").mockReturnValue({ id: "TSLA" });
  const server = setupServer(
    rest.get("https://www.alphavantage.co/query", (req, res, ctx) => {
      ctx.status(500);
      return res(
        ctx.json({
          error: "error",
        })
      );
    })
  );
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  it("should not render data when api throws error", async () => {
    render(<StockDetails />);
    await waitFor(() => {
      expect(screen.queryByText("Stock Details")).not.toBeInTheDocument();
      expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
    });
  });
});
