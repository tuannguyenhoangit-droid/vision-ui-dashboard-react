import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import VuiBox from "components/VuiBox";
import Grid from "@mui/material/Grid";
import BestPerformanceVolumeList from "layouts/agent-creation-wizard/strategy-builder/components/BestPerformanceVolumeList";
import { getBestPerformanceVolume } from "services/api";
import { useState } from "react";
import Projects from "layouts/agent-creation-wizard/strategy-builder/components/Projects";

function StrategyBuilder() {
  const [bestPerformanceVolume, setBestPerformanceVolume] = useState([]);

  const onFilterChangeBestPerformanceVolume = (frame, dayAgo) => {
    getBestPerformanceVolume(frame, dayAgo).then(setBestPerformanceVolume);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox mb={3}>
        <Grid container spacing="18px">
          <Grid item xs={12} lg={12} xl={12}>
            <BestPerformanceVolumeList
              onFilterChange={onFilterChangeBestPerformanceVolume}
              data={bestPerformanceVolume}
            />
          </Grid>
        </Grid>
      </VuiBox>
      <Grid container spacing={3} direction="row" justifyContent="center" alignItems="stretch">
        <Grid item xs={12} md={12} lg={12}>
          <Projects
            onEditItem={(item) => {
              setSymbolEditItem(item);
            }}
            onDeleteItem={(item) => {
              setSymbolDeleteItem(item);
            }}
            onMenuClick={(action) => {
              if (action === "add") openSymbolConfigModal(true);
            }}
          />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default StrategyBuilder;
