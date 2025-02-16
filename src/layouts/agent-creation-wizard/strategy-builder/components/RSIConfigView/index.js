import React, { useEffect, useMemo, useState } from "react";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiSwitch from "components/VuiSwitch";
import VuiButton from "components/VuiButton";
import Chip from "@mui/material/Chip";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import { Checkbox, Slider } from "@mui/material";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";

const RSI_STRATEGY_OPTIONS = [
  // 1h -> 1w
  { id: "2h" },
  { id: "4h" },
  { id: "6h" },
  { id: "12h" },
  { id: "1d" },
  { id: "3d" },
  { id: "1w" },
];

const RSIConfigView = ({
  defaultRsiStrategyId,
  config,
  onChange = () => {},
  onSubmit = () => {},
  onCancel = () => {},
  buttonTitle = {
    next: "NEXT",
    back: "BACK",
  },
}) => {
  const [rsiStrategy, setRsiStrategy] = useState({});
  const [rsiRecommendStrategy, setRsiRecommendStrategy] = useState(false);
  const [rsiStrategyConfig, setRsiStrategyConfig] = useState({});
  const rsiStrategyConfigList = useSelector((e) => e.rsiStrategyConfig.data);

  useEffect(() => {
    if (defaultRsiStrategyId) {
      setRsiStrategyConfig(rsiStrategyConfigList.find((it) => it.id === defaultRsiStrategyId));
      setRsiRecommendStrategy(true);
    }
    return () => {
      setRsiStrategy({});
      setRsiStrategyConfig({});
      setRsiRecommendStrategy(false);
    };
  }, [config.symbol, rsiStrategyConfigList]);

  useEffect(() => {
    if (config.rsiRequireValues?.length > 0 && rsiRecommendStrategy === false) {
      config.rsiRequireValues?.forEach((rsiValue) => {
        rsiStrategy[rsiValue.frame] = rsiValue.value;
      });
      setRsiStrategy({ ...rsiStrategy });
    }
  }, [config, rsiRecommendStrategy]);

  useEffect(() => {
    const rsiStrategy = {};
    if (rsiStrategyConfig.timeFrames?.length > 0) {
      (rsiStrategyConfig.timeFrames || []).forEach((frame) => {
        rsiStrategy[frame] =
          config.side === "BUY" ? rsiStrategyConfig.oversold : rsiStrategyConfig.overbought;
      });
      setRsiStrategy({ ...rsiStrategy });
    }
  }, [rsiStrategyConfig]);

  const buyRSIStrategyCheckbox = useMemo(() => {
    const renderFrames = (it) => {
      const currentChecked = rsiStrategy[it.id] || 0;
      return (
        <VuiBox
          id={it.id}
          mt={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: "100%",
          }}
        >
          <VuiBox display="flex" flexDirection="row">
            <Checkbox
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 28,
                  fill: "#d6e6e6",
                },
              }}
              color="success"
              defaultChecked={currentChecked}
              checked={currentChecked}
              onChange={(e, checked) =>
                setRsiStrategy({
                  ...rsiStrategy,
                  [it.id]: checked ? (config.side === "BUY" ? 30 : 70) : 0,
                })
              }
            />
            <VuiTypography
              ml={1}
              variant="caption"
              color="white"
              fontWeight="normal"
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              {["Frame", it.id].join(" ")}
            </VuiTypography>
            {rsiStrategy[it.id] ? (
              <VuiTypography
                ml={1}
                variant="caption"
                color={config.side === "BUY" ? "success" : "error"}
                fontWeight="normal"
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                {["RSI", config.side === "BUY" ? "<" : ">", rsiStrategy[it.id] || 0].join(" ")}
              </VuiTypography>
            ) : null}
          </VuiBox>
          <Slider
            style={{ width: isMobile ? 120 : 170 }}
            color="warning"
            size="small"
            min={1}
            max={100}
            value={rsiStrategy[it.id] || 0}
            onChange={(e, value) => {
              setRsiStrategy({
                ...rsiStrategy,
                [it.id]: value,
              });
            }}
            disabled={currentChecked === 0}
            defaultValue={config.side === "BUY" ? 30 : 70}
            valueLabelDisplay="auto"
          />
        </VuiBox>
      );
    };

    if (rsiRecommendStrategy) {
      return (
        <VuiBox sx={{ width: "100%" }}>
          {(rsiStrategyConfig.timeFrames || []).map((frame) => renderFrames({ id: frame }))}
        </VuiBox>
      );
    }

    return (
      <VuiBox sx={{ width: "100%" }}>{RSI_STRATEGY_OPTIONS.map((it) => renderFrames(it))}</VuiBox>
    );
  }, [rsiStrategy, config, rsiRecommendStrategy]);

  return (
    <VuiBox>
      <VuiBox mb={2}>
        <VuiBox mb={1} alignItems="center" justifyContent="space-between" display="flex">
          <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
            Enable RSI Strategy Check
          </VuiTypography>
          <VuiSwitch
            color="success"
            checked={config.enableRSIStrategy}
            onChange={(e, switched) => {
              onChange("enableRSIStrategy", switched);
            }}
          />
        </VuiBox>
        {config.enableRSIStrategy ? buyRSIStrategyCheckbox : null}
      </VuiBox>
      <VuiBox mb={2}>
        <VuiBox mb={1} alignItems="center" justifyContent="space-between" display="flex">
          <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
            RSI Recommend Strategy
          </VuiTypography>
          <VuiSwitch
            color="success"
            checked={rsiRecommendStrategy}
            onChange={(e, switched) => {
              if (switched) {
                setRsiStrategyConfig(rsiStrategyConfigList[1]);
                setRsiRecommendStrategy(switched);
              } else {
                setRsiStrategy({});
                setRsiStrategyConfig({});
                setRsiRecommendStrategy(switched);
              }
            }}
          />
        </VuiBox>

        {config.enableRSIStrategy ? (
          <VuiBox mb={2}>
            {rsiStrategyConfigList.map((item) => (
              <Chip
                clickable
                style={{ margin: 4 }}
                onClick={() => {
                  setRsiStrategyConfig(item);
                  setRsiRecommendStrategy(true);
                }}
                label={item.strategy}
                color={item.id === rsiStrategyConfig.id ? "success" : "warning"}
                size={isMobile ? "small" : "medium"}
              />
            ))}
          </VuiBox>
        ) : null}
      </VuiBox>
      {config.enableRSIStrategy ? (
        <MiniStatisticsCard
          title={{
            text: [config.side === "BUY" ? "Buy" : "Sell", "Strategy"].join(" "),
            fontWeight: "regular",
          }}
          percentage={{
            color: config.side === "BUY" ? "success" : "error",
            text: [
              "Default RSI Strategy is",
              config.side === "BUY" ? "below 30" : "above 70",
              "for",
              config.side,
              "signal. RSI Strategy will be combined with MACD Strategy to make order in Trading Frame.",
            ].join(" "),
          }}
        />
      ) : null}
      <VuiBox mt={4} justifyContent="space-between" display="flex" alignItems="center">
        <VuiBox minWidth="46%">
          <VuiButton onClick={onCancel} color={"light"} fullWidth>
            {buttonTitle.back}
          </VuiButton>
        </VuiBox>
        <VuiBox minWidth="46%">
          <VuiButton
            onClick={() => onSubmit(rsiStrategy, rsiStrategyConfig.id)}
            color={!config.enableRSIStrategy ? "dark" : "info"}
            fullWidth
          >
            {buttonTitle.next}
          </VuiButton>
        </VuiBox>
      </VuiBox>
    </VuiBox>
  );
};

export default RSIConfigView;
