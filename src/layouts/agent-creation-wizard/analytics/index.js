import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Grid from "@mui/material/Grid";

import { lineChartOptionsDashboard } from "layouts/dashboard/data/lineChartOptions";
import LineChart from "examples/Charts/LineCharts/LineChart";
import TwistBestPerfVolume from "./components/TwistBestPerfVolume";
import { useState, useEffect, useMemo } from "react";
import { SymbolConfigModal } from "../strategy-builder/components/SymbolConfigModal";
import { Card } from "@mui/material";
import { getBestPerformanceVolumeTrends } from "services/api";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

function Analytics() {
  const [symbolEditItem, setSymbolEditItem] = useState(null);
  const [isOpenSymbolConfigModal, openSymbolConfigModal] = useState(false);
  const [bestPerformanceVolumeTrends, setBestPerformanceVolumeTrends] = useState({
    dataInFlow: [],
    dataOutFlow: [],
  });

  useEffect(() => {
    getBestPerformanceVolumeTrends().then((data) => {
      console.log("data", data);
      setBestPerformanceVolumeTrends({
        dataInFlow: data.dataInFlow.slice(0, 10),
        dataOutFlow: data.dataOutFlow,
      });
    });
  }, []);

  console.log("bestPerformanceVolumeTrends", bestPerformanceVolumeTrends);

  // generate a random color when trigger this function
  // have to have full 6 digits
  const getRandomColor = () => {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  };

  const getLineChartDataInFlow = useMemo(() => {
    const colors = Array.from({ length: bestPerformanceVolumeTrends.dataInFlow.length }).map(
      (_, index) => getRandomColor()
    );
    console.log("colors", colors);
    return (
      <LineChart
        key={bestPerformanceVolumeTrends.dataInFlow.length}
        lineChartData={bestPerformanceVolumeTrends.dataInFlow}
        lineChartOptions={{
          ...lineChartOptionsDashboard,
          colors: colors,
          xaxis: {
            ...lineChartOptionsDashboard.xaxis,
            // date from now to 7 days ago
            categories: Array.from({ length: 7 }, (_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - index);
              return date.toISOString().split("T")[0];
            }).reverse(),
          },
        }}
      />
    );
  }, [bestPerformanceVolumeTrends.dataInFlow]);

  const getLineChartDataOutFlow = useMemo(() => {
    const colors = Array.from({ length: bestPerformanceVolumeTrends.dataOutFlow.length }).map(
      (_, index) => getRandomColor()
    );

    return (
      <LineChart
        key={bestPerformanceVolumeTrends.dataOutFlow.length}
        lineChartData={bestPerformanceVolumeTrends.dataOutFlow}
        lineChartOptions={{
          ...lineChartOptionsDashboard,
          colors: colors,
          xaxis: {
            ...lineChartOptionsDashboard.xaxis,
            // date from now to 7 days ago
            categories: Array.from({ length: 7 }, (_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - index);
              return date.toISOString().split("T")[0];
            }).reverse(),
          },
        }}
      />
    );
  }, [bestPerformanceVolumeTrends.dataOutFlow]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <TwistBestPerfVolume setSymbolEditItem={setSymbolEditItem} />
      <Grid
        mt={1}
        container
        spacing={3}
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <VuiTypography variant="h6" fontWeight="bold" color="white">
              Inflow last 7 days (diff = inflow / outflow)
            </VuiTypography>
            <VuiBox height="620px">{getLineChartDataInFlow}</VuiBox>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <VuiTypography variant="h6" fontWeight="bold" color="white">
              Outflow last 7 days (diff = inflow / outflow)
            </VuiTypography>
            <VuiBox height="620px">{getLineChartDataOutFlow}</VuiBox>
          </Card>
        </Grid>
      </Grid>

      <SymbolConfigModal
        item={symbolEditItem}
        onClose={() => {
          openSymbolConfigModal(false);
          setSymbolEditItem(null);
        }}
        open={isOpenSymbolConfigModal || symbolEditItem !== null}
      />
    </DashboardLayout>
  );
}

export default Analytics;
