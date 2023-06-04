export type DataSet = {
  label: string;
  data: number[] | string[];
  fill?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  borderDash?: number[];
};

export type LineChartData = {
  labels: string[];
  datasets: DataSet[];
};
