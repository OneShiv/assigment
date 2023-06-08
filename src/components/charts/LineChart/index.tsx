import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { LineChartData } from "./types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({ data }: { data: LineChartData }) {
  return (
    <div className="chartWrapper">
      <Line data={data} data-testid="line-chart" />
    </div>
  );
}

export default LineChart;
