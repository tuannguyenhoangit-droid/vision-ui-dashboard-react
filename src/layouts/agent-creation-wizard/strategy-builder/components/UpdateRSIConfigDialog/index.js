import { Dialog } from "@mui/material";
import { useEffect, useState } from "react";
import RSIConfigView from "../RSIConfigView";
import VuiBox from "components/VuiBox";
import GradientBorder from "examples/GradientBorder";
import { isMobile } from "react-device-detect";
import VuiTypography from "components/VuiTypography";
import { createSymbolConfig, getSymbolConfig } from "services/api";
import { setMessage } from "app-redux/futures/messageSlice";
import { setSymbolConfigData } from "app-redux/futures/symbolConfigSlice";
import { useDispatch } from "react-redux";

export default function UpdateRSIConfigDialog({ open, onClose = () => null, item = null }) {
  const [config, setConfig] = useState(null);
  const dispatch = useDispatch();

  // init config from item
  useEffect(() => {
    if (item) {
      // remove symbol contains USDT
      const itemWithInit = { ...item, symbol: item.symbol.replace("USDT", "") };
      setConfig(itemWithInit);
    }
    return () => {
      setConfig({});
    };
  }, [item]);

  const onChange = (key, value) => {
    setConfig({ ...config, [key]: value });
  };

  const onSubmit = async (rsiStrategiesValues, rsiStrategyConfigId) => {
    const finalConfig = {
      ...config,
      rsiStrategy: {
        BUY: rsiStrategyConfigId?.["BUY"]?.id || "",
        SELL: rsiStrategyConfigId?.["SELL"]?.id || "",
      },
      rsiRequireValues: rsiStrategiesValues,
    };

    try {
      const result = await createSymbolConfig(
        finalConfig.side,
        finalConfig.symbol,
        parseFloat(finalConfig.buyAmount),
        parseInt(finalConfig.maxBudget),
        finalConfig.frame,
        finalConfig.requireHistogramCondition,
        finalConfig.buyRequireHistogram,
        finalConfig.autoTakeProfit,
        finalConfig.optimizeEntry,
        parseFloat(finalConfig.optimizeEntryPercent),
        finalConfig.enableRSIStrategy,
        finalConfig.rsiRequireValues,
        finalConfig.rsiStrategy,
        finalConfig.maxDCAPerWave
      );
      if (result.status === 1) {
        dispatch(
          setMessage({
            message: "Update RSI config success",
            type: "success",
          })
        );
        onClose();
        const userSymbolConfig = await getSymbolConfig();
        dispatch(setSymbolConfigData(userSymbolConfig));
      }
    } catch (e) {
      dispatch(
        setMessage({
          message: e.message,
          type: "error",
        })
      );
    }
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth>
      <GradientBorder borderRadius={"6"} fullWidth="100%">
        <VuiBox
          component="form"
          role="form"
          borderRadius="inherit"
          p="24px"
          width={isMobile ? "100%" : "420px"}
          sx={({ palette: { secondary } }) => ({
            backgroundColor: secondary.focus,
          })}
        >
          <VuiBox mb={2}>
            <VuiTypography variant="h6" color="white">
              Update RSI Config
            </VuiTypography>
          </VuiBox>
          {config ? (
            <RSIConfigView
              buttonTitle={{
                next: "UPDATE",
                back: "CANCEL",
              }}
              defaultRsiStrategyIds={config.rsiStrategy}
              onCancel={onClose}
              onSubmit={onSubmit}
              config={config}
              onChange={onChange}
            />
          ) : null}
        </VuiBox>
      </GradientBorder>
    </Dialog>
  );
}
