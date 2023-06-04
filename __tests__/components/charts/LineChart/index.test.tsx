import React from "react";
import { render, screen } from "@testing-library/react";
import LineChart from "../../../../src/components/charts/LineChart";
import { LineChartData } from "../../../../src/components/charts/LineChart/types";

describe("[Component Card]", () => {
  it("should render passed component", () => {
    const data: LineChartData = {
      labels: ["1", "2"],
      datasets: [
        {
          label: "Last operating day chart",
          data: [3, 4],
          fill: true,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
        },
        {
          label: "previous closing",
          data: [0, 0],
          borderDash: [5],
          fill: true,
          borderColor: "rgba(75,16,19,1)",
        },
      ],
    };
    render(<LineChart data={data} />);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });
});
