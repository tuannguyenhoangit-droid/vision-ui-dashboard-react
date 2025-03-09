import React, { useEffect, useMemo, useState } from "react";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiSwitch from "components/VuiSwitch";
import VuiButton from "components/VuiButton";
import Chip from "@mui/material/Chip";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import { ButtonGroup, Checkbox, Slider } from "@mui/material";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { current } from "@reduxjs/toolkit";

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
  defaultRsiStrategyIds,
  config,
  onChange = () => {},
  onSubmit = () => {},
  onCancel = () => {},
  buttonTitle = {
    next: "NEXT",
    back: "BACK",
  },
}) => {
  const [rsiStrategy, setRsiStrategy] = useState([]);
  const [rsiRecommendStrategy, setRsiRecommendStrategy] = useState(false);
  const [rsiStrategyConfig, setRsiStrategyConfig] = useState({});
  const rsiStrategyConfigList = useSelector((e) => e.rsiStrategyConfig.data);
  const [rsiSide, setRsiSide] = useState("");

  useEffect(() => {
    if (typeof defaultRsiStrategyIds === "object") {
      setRsiStrategyConfig({
        BUY: rsiStrategyConfigList.find((it) => it.id === defaultRsiStrategyIds["BUY"]),
        SELL: rsiStrategyConfigList.find((it) => it.id === defaultRsiStrategyIds["SELL"]),
      });
      setRsiRecommendStrategy(true);
    } else if (defaultRsiStrategyIds) {
      setRsiStrategyConfig({
        BUY: rsiStrategyConfigList.find((it) => it.id === defaultRsiStrategyIds),
        SELL: {},
      });
      setRsiRecommendStrategy(true);
    }
    setRsiSide(config.side === "BOTH" ? "BUY" : config.side);
    return () => {
      setRsiSide("");
      setRsiStrategy([]);
      setRsiStrategyConfig({});
      setRsiRecommendStrategy(false);
    };
  }, [config.symbol, rsiStrategyConfigList]);

  useEffect(() => {
    if (config.rsiRequireValues?.length > 0 && rsiRecommendStrategy === false) {
      setRsiStrategy({ ...config.rsiRequireValues });
    }
  }, [config, rsiRecommendStrategy]);

  console.log("rsiStrategy", rsiStrategy);
  console.log("rsiStrategyConfig", rsiStrategyConfig);
  console.log("rsiSide", rsiSide);

  useEffect(() => {
    const rsiStrategies = [];
    const currentRsiStrategyConfig = rsiStrategyConfig?.[rsiSide] || rsiStrategyConfig || {};
    const timeFrames = currentRsiStrategyConfig.timeFrames || [];
    if (timeFrames?.length > 0) {
      timeFrames.forEach((frame) => {
        rsiStrategies.push({
          frame,
          value:
            rsiSide === "BUY"
              ? currentRsiStrategyConfig.oversold
              : currentRsiStrategyConfig.overbought,
          side: rsiSide,
        });
      });
      console.log("rsiStrategies", rsiStrategies);
      // merge data
      setRsiStrategy((pre) => {
        return [
          ...rsiStrategies,
          ...(Array.isArray(pre) ? pre : Object.keys(pre).map((k) => pre[k])).filter(
            (item) => item.side && item.side !== rsiSide
          ),
        ];
      });
    }
  }, [rsiStrategyConfig, rsiSide]);

  const buyRSIStrategyCheckbox = useMemo(() => {
    const renderFrames = (it) => {
      const current = (
        Array.isArray(rsiStrategy)
          ? rsiStrategy
          : Object.keys(rsiStrategy).map((k) => rsiStrategy[k])
      ).find((item) => item.frame === it.id && item.side === rsiSide);

      console.log("current", current);
      const currentChecked = current !== undefined;
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
                setRsiStrategy((pre) => {
                  return [
                    ...(Array.isArray(pre) ? pre : Object.keys(pre).map((k) => pre[k])),
                    {
                      ...(current === undefined
                        ? {
                            frame: it.id,
                            side: rsiSide,
                          }
                        : current),
                      value: checked ? (rsiSide === "BUY" ? 30 : 70) : 0,
                    },
                  ];
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
            {currentChecked ? (
              <VuiTypography
                ml={1}
                variant="caption"
                color={rsiSide === "BUY" ? "success" : "error"}
                fontWeight="normal"
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                {["RSI", rsiSide === "BUY" ? "<" : ">", current.value || 0].join(" ")}
              </VuiTypography>
            ) : null}
          </VuiBox>
          <Slider
            style={{ width: isMobile ? 120 : 170 }}
            color="warning"
            size="small"
            min={1}
            max={100}
            value={current?.value || 0}
            onChange={(e, value) => {
              setRsiStrategy((pre) => {
                return [
                  ...pre.filter((item) => item.frame !== it.id && item.side === rsiSide),
                  {
                    ...current,
                    value: value,
                  },
                ];
              });
            }}
            disabled={!currentChecked}
            defaultValue={rsiSide === "BUY" ? 30 : 70}
            valueLabelDisplay="auto"
          />
        </VuiBox>
      );
    };
    console.log(
      "rsiRecommendStrategy && rsiStrategyConfig[rsiSide]",
      rsiRecommendStrategy && rsiStrategyConfig[rsiSide]
    );
    if (rsiRecommendStrategy && rsiStrategyConfig[rsiSide]) {
      return (
        <VuiBox sx={{ width: "100%" }}>
          {(rsiStrategyConfig[rsiSide].timeFrames || []).map((frame) =>
            renderFrames({ id: frame })
          )}
        </VuiBox>
      );
    }

    return (
      <VuiBox sx={{ width: "100%" }}>{RSI_STRATEGY_OPTIONS.map((it) => renderFrames(it))}</VuiBox>
    );
  }, [rsiStrategy, config, rsiRecommendStrategy, rsiSide]);

  return (
    <VuiBox>
      <VuiBox mb={2}>
        <VuiBox display="flex" flexDirection="row" justifyContent="center" alignItems="center">
          <VuiTypography
            textAlign="center"
            component="label"
            variant="h6"
            color="white"
            fontWeight="medium"
          >
            Advanced Settings
          </VuiTypography>
        </VuiBox>
        <VuiBox
          mb={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <VuiTypography
            textAlign="center"
            component="label"
            variant="button"
            color="white"
            fontWeight="medium"
          >
            Side
          </VuiTypography>
          <VuiBox mt={2} display="flex" justifyContent="center">
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <VuiButton
                size="small"
                disabled={config.side === "SELL"}
                onClick={() => setRsiSide("BUY")}
                color={rsiSide === "BUY" ? "success" : "light"}
              >
                BUY
              </VuiButton>
              <VuiButton
                size="small"
                disabled={config.side === "BUY"}
                onClick={() => setRsiSide("SELL")}
                color={rsiSide === "SELL" ? "error" : "light"}
              >
                SELL
              </VuiButton>
            </ButtonGroup>
          </VuiBox>
        </VuiBox>
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
                setRsiStrategyConfig((pre) => {
                  return {
                    ...pre,
                    [rsiSide]: rsiStrategyConfigList[1],
                  };
                });
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
                  setRsiStrategyConfig((pre) => {
                    return {
                      ...pre,
                      [rsiSide]: item,
                    };
                  });
                  setRsiRecommendStrategy(true);
                }}
                label={item.strategy}
                color={
                  item.id === (rsiStrategyConfig?.[rsiSide]?.id || rsiStrategyConfig?.id)
                    ? "success"
                    : "warning"
                }
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
            onClick={() => onSubmit(rsiStrategy, rsiStrategyConfig, rsiSide)}
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
