import { useMemo } from "react";
import { transformStockIntradayForChart } from "../utils";
import { LineChartData } from "../components/charts/LineChart/types";
import {
  GlobalQuoteResp,
  IntraDayResponse,
} from "../components/stocks/Details/types";
import LineChart from "../components/charts/LineChart";

type LineChartStockHocProps = {
  primaryData: IntraDayResponse;
  secondaryData?: GlobalQuoteResp;
};

function LineChartHoc(props: LineChartStockHocProps) {
  const { primaryData, secondaryData } = props;
  const _secData =
    secondaryData &&
    !secondaryData["Note"] &&
    secondaryData["Global Quote"]["08. previous close"];
  const { labels, data: _data } = transformStockIntradayForChart(primaryData);

  const data: LineChartData = useMemo(() => {
    return {
      labels: labels.reverse(),
      datasets: [
        {
          label: "Last operating day chart",
          data: _data.reverse(),
          fill: true,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
        },
        {
          label: "previous closing",
          data: _secData ? new Array(_data.length).fill(_secData) : [],
          borderDash: [5],
          fill: true,
          borderColor: "rgba(75,16,19,1)",
        },
      ],
    };
  }, [_secData, _data]);
  return <LineChart data={data} data-test-id="line-chart" />;
}

export default LineChartHoc;
