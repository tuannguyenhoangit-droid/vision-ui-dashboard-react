/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React from "react";
import Chart from "react-apexcharts";

const BarChart = ({ chartData = [], chartOptions = [] }) => {
  if (chartData.length === 0) {
    return <div></div>;
  }

  return <Chart options={chartOptions} series={chartData} type="bar" width="100%" height="100%" />;
};

export default BarChart;
