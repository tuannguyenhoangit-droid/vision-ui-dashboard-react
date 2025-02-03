import { Card, Chip, Grid } from "@mui/material";
import VuiBox from "components/VuiBox";
import { getBestPerformanceVolume } from "services/api";
import BestPerformanceVolumeList from "../BestPerformanceVolumeList";
import { useEffect, useState } from "react";
import VuiTypography from "components/VuiTypography";
import { isMobile } from "react-device-detect";

function TwistBestPerfVolume(props) {
  const { setSymbolEditItem = () => {} } = props;
  const [bestPerformanceVolume, setBestPerformanceVolume] = useState([]);

  useEffect(() => {
    getBestPerformanceVolume().then((data) => setBestPerformanceVolume(data));
  }, []);

  const handleQuickChangeFrequency = (frequency) => {
    getBestPerformanceVolume(frequency).then((data) => setBestPerformanceVolume(data));
  };

  return (
    <Card mb={3}>
      <VuiBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <VuiTypography variant="lg" color="white" gutterBottom>
          Top Inflow - Outflow
        </VuiTypography>
        <VuiBox display="flex" alignItems="center" flexDirection="row" gap={1}>
          <Chip
            clickable
            onClick={() => handleQuickChangeFrequency("5d")}
            color="warning"
            label={isMobile ? "5d" : "5 days"}
            size={isMobile ? "small" : "medium"}
          />
          <Chip
            clickable
            onClick={() => handleQuickChangeFrequency("3d")}
            color="warning"
            label={isMobile ? "3d" : "3 days"}
            size={isMobile ? "small" : "medium"}
          />
        </VuiBox>
      </VuiBox>
      <Grid container spacing="18px">
        <Grid item xs={12} lg={6} xl={6}>
          <BestPerformanceVolumeList
            onItemClick={(item) => {
              setSymbolEditItem(item);
            }}
            title="Inflow"
            description="has best inflow"
            // onFilterChange={onFilterChangeBestPerformanceVolume}
            data={bestPerformanceVolume.data}
          />
        </Grid>
        <Grid item xs={12} lg={6} xl={6}>
          <BestPerformanceVolumeList
            onItemClick={(item) => {
              setSymbolEditItem(item);
            }}
            title="Outflow"
            description="has best outflow"
            // onFilterChange={onFilterChangeBestPerformanceVolume}
            data={bestPerformanceVolume.dataOutFlow}
          />
        </Grid>
      </Grid>
    </Card>
  );
}

export default TwistBestPerfVolume;
