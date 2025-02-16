import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import Projects from "layouts/agent-creation-wizard/strategy-builder/components/Projects";
import { SymbolConfigModal } from "./components/SymbolConfigModal";
import VuiDialog from "components/VuiDialog";
import { deleteSymbolConfig, getSymbolConfig } from "services/api";
import { setSymbolConfigData } from "app-redux/futures/symbolConfigSlice";
import { useDispatch, useSelector } from "react-redux";
import UpdateRSIConfigDialog from "./components/UpdateRSIConfigDialog";
import { setRsiStrategyConfig } from "app-redux/futures/rsiStrategyConfigSlice";
import { getRsiStrategyConfig } from "services/api";

function StrategyBuilder() {
  const [symbolDeleteItem, setSymbolDeleteItem] = useState(null);
  const [symbolEditItem, setSymbolEditItem] = useState(null);
  const [isOpenSymbolConfigModal, openSymbolConfigModal] = useState(false);
  const [symbolUpdateRSIConfigItem, setSymbolUpdateRSIConfigItem] = useState(null);
  const rsiStrategyConfigList = useSelector((e) => e.rsiStrategyConfig.data);
  const dispatch = useDispatch();

  useEffect(() => {
    getSymbolConfig().then((data) => dispatch(setSymbolConfigData(data)));
    if (rsiStrategyConfigList.length === 0) {
      getRsiStrategyConfig().then((response) => {
        dispatch(setRsiStrategyConfig(response.data));
      });
    }
  }, []);

  const confirmDeleteSymbol = (item) => {
    deleteSymbolConfig(item.symbol).then(() => {
      getSymbolConfig().then((data) => dispatch(setSymbolConfigData(data)));
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={3} direction="row" justifyContent="center" alignItems="stretch">
        <Grid item xs={12} md={12} lg={12}>
          <Projects
            onEditRSIItem={(item) => {
              setSymbolUpdateRSIConfigItem(item);
            }}
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
      <SymbolConfigModal
        item={symbolEditItem}
        onClose={() => {
          openSymbolConfigModal(false);
          setSymbolEditItem(null);
        }}
        open={isOpenSymbolConfigModal || symbolEditItem !== null}
      />
      <UpdateRSIConfigDialog
        item={symbolUpdateRSIConfigItem}
        onClose={() => {
          setSymbolUpdateRSIConfigItem(null);
        }}
        open={symbolUpdateRSIConfigItem !== null}
      />
      <VuiDialog
        onConfirm={confirmDeleteSymbol}
        cancelTitle="Cancel"
        confirmTitle="Confirm"
        description={`Confirm to delete symbol config: ${
          symbolDeleteItem?.symbol || ""
        }.\nYou will handle exist symbol position!`}
        title="Delete strategy config"
        onClose={() => setSymbolDeleteItem(null)}
        openItem={symbolDeleteItem}
      />
    </DashboardLayout>
  );
}

export default StrategyBuilder;
