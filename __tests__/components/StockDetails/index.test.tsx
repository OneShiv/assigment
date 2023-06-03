import StockDetails from "../../../src/components/StockDetails";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import Router from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { globalQuote, intraDayData, overViewData } from "./data";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("[Component: StockDetails Success Case]", () => {
  jest.spyOn(Router, "useParams").mockReturnValue({ id: "TSLA" });
  const server = setupServer(
    rest.get(
      "https://www.alphavantage.co/query?function=OVERVIEW&symbol=TSLA&apikey=AJJ8Z7R3VHXJAOC0",
      (req, res, ctx) => {
        return res(ctx.json(overViewData));
      }
    ),
    rest.get(
      "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=TSLA&interval=60min&apikey=N8TOV18D8REYIST0",
      (req, res, ctx) => {
        return res(ctx.json(intraDayData));
      }
    ),
    rest.get(
      "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=TSLA&interval=5min&apikey=N8TOV18D8REYIST0",
      (req, res, ctx) => {
        return res(ctx.json(globalQuote));
      }
    )
  );
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  it("should render data when api resolves correct data", async () => {
    render(<StockDetails />);
    await waitFor(() => {
      expect(screen.getByText("Stock Details")).toBeInTheDocument();
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });
});

describe("[Component: StockDetails Error Case]", () => {
  jest.spyOn(Router, "useParams").mockReturnValue({ id: "TSLA" });
  const server = setupServer(
    rest.get(
      "https://www.alphavantage.co/query?function=OVERVIEW&symbol=TSLA&apikey=AJJ8Z7R3VHXJAOC0",
      (req, res, ctx) => {
        ctx.status(400);
        return res(
          ctx.json({
            error: "error",
          })
        );
      }
    ),
    rest.get(
      "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=TSLA&interval=60min&apikey=N8TOV18D8REYIST0",
      (req, res, ctx) => {
        ctx.status(400);
        return res(
          ctx.json({
            error: "error",
          })
        );
      }
    ),
    rest.get(
      "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=TSLA&interval=5min&apikey=N8TOV18D8REYIST0",
      (req, res, ctx) => {
        ctx.status(400);
        return res(
          ctx.json({
            error: "error",
          })
        );
      }
    )
  );
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  it("should not render data when api doesn't resolve data", async () => {
    render(<StockDetails />);
    await waitFor(() => {
      expect(screen.queryByText("Stock Details")).not.toBeInTheDocument();
      expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
    });
  });
});
