import {
  Alert,
  ButtonGroup,
  Checkbox,
  Dialog,
  Slider,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import VuiSwitch from "components/VuiSwitch";
import GradientBorder from "examples/GradientBorder";
// Vision UI Dashboard assets
import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { createSymbolConfig, getSymbolConfig, getTickerPrice } from "../../../../../services/api";
import { setSymbolConfigData } from "../../../../../redux/futures/symbolConfigSlice";
import useDebounce from "utils";

import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import { setMessage } from "../../../../../redux/futures/messageSlice";
import { Bolt, SettingsSuggest, SmartToy } from "@mui/icons-material";
import { isMobile } from "react-device-detect";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient( 95deg, #125688 0%, #55acee 50%, #0077b5 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient( 95deg, #0077b5 0%, #55acee 50%, #125688 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage: "linear-gradient( 136deg, #2d8cfc 0%, #2d8cfc 50%, #2d8cfc 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage: "linear-gradient( 136deg, #0f4a91 0%, #0f4a91 50%, #0f4a91 100%)",
      },
    },
    {
      props: ({ ownerState }) => !ownerState.completed && !ownerState.active,
      style: {
        backgroundImage: "linear-gradient( 136deg, #0f4a91 0%, #0f4a91 50%, #0f4a91 100%)",
      },
    },
  ],
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <Bolt />,
    2: <SmartToy />,
    3: <SmartToy />,
    4: <SettingsSuggest />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const SUPPORT_CHART_FRAME = ["3m", "5m", "15m", "30m", "1h"];

const SUPPORT_CHART_FRAME_WEIGHT = {
  "3m": 0,
  "5m": 1,
  "15m": 2,
  "30m": 3,
  "1h": 4,
};

const RSI_STRATEGY_OPTIONS = [
  // 1h -> 1w
  { id: "2h", label: "Frame 2h", weight: 2 },
  { id: "4h", label: "Frame 4h", weight: 3 },
  { id: "6h", label: "Frame 6h", weight: 4 },
  { id: "12h", label: "Frame 12h", weight: 6 },
  { id: "1d", label: "Frame 1d", weight: 7 },
  { id: "3d", label: "Frame 3d", weight: 8 },
  { id: "1w", label: "Frame 1w", weight: 9 },
];

const BUY_REQUIRE_CHART_FRAME = [
  { id: "5m", label: "5m", pro: false, weight: 1 },
  { id: "15m", label: "15m", pro: false, weight: 2 },
  {
    id: "30m",
    label: "30m",
    pro: false,
    weight: 3,
  },
];
const BUY_REQUIRE_CHART_FRAME_P2 = [
  {
    id: "1h",
    label: "1h",
    pro: false,
    weight: 4,
  },
  {
    id: "2h",
    label: "2h",
    pro: false,
    weight: 5,
  },
  {
    id: "4h",
    label: "4h",
    pro: false,
    weight: 6,
  },
];
const initConfig = {
  side: "BUY",
  symbol: "",
  buyAmount: 0,
  maxBudget: 0,
  autoTakeProfit: true,
  frame: "15m",
  buyRequireHistogram: ["30m"],
  requireHistogramCondition: "AND",
  optimizeEntry: false,
  optimizeEntryPercent: 0,
  enableRSIStrategy: false,
  rsiRequireValues: [],
};
export function SymbolConfigModal({ open, onClose = () => null, item = null }) {
  const [loading, setLoading] = useState(false);
  const [requireFrame, setRequireFrame] = useState({
    "30m": true,
  });
  const [rsiStrategy, setRsiStrategy] = useState({});
  const [config, setConfig] = useState(initConfig);
  const [tickerPrice, setTickerPrice] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  const dispatch = useDispatch();

  // when requireFrame change, update buyRequireHistogram
  useEffect(() => {
    const frames = Object.keys(requireFrame)
      .map((frame) => {
        if (frame && requireFrame[frame]) {
          return frame;
        }
      })
      .filter((frame) => frame);
    onChange("buyRequireHistogram", frames);
  }, [requireFrame]);

  // when rsiStrategy change, update rsiRequireValues
  useEffect(() => {
    const rsiValues = Object.keys(rsiStrategy).map((frame) => {
      if (frame && rsiStrategy[frame]) {
        return {
          frame,
          value: rsiStrategy[frame],
        };
      }
    });
    onChange("rsiRequireValues", rsiValues);
  }, [rsiStrategy]);

  // init config from item
  useEffect(() => {
    if (item) {
      // remove symbol contains USDT
      const itemWithInit = { ...initConfig, ...item, symbol: item.symbol.replace("USDT", "") };

      const requireFrame = {};
      if (itemWithInit.buyRequireHistogram.length > 0) {
        itemWithInit.buyRequireHistogram.forEach((frame) => {
          requireFrame[frame] = true;
        });
        setRequireFrame({ ...requireFrame });
      }

      const rsiStrategy = {};
      if (itemWithInit.rsiRequireValues?.length > 0) {
        itemWithInit.rsiRequireValues?.forEach((rsiValue) => {
          rsiStrategy[rsiValue.frame] = rsiValue.value;
        });
        setRsiStrategy({ ...rsiStrategy });
      }

      setConfig(itemWithInit);
    }
    return () => {
      setConfig({
        ...initConfig,
      });
      setRequireFrame({});
      setRsiStrategy({});
      setCurrentStep(0);
      setTickerPrice({});
    };
  }, [item]);

  const tradeChartFrameButtons = useMemo(() => {
    return SUPPORT_CHART_FRAME.map((fr) => {
      return (
        <VuiButton
          onClick={() => {
            onChange("frame", fr);
          }}
          color={config.frame === fr ? "success" : "light"}
        >
          {fr}
        </VuiButton>
      );
    });
  }, [config]);

  // render buy require chart frame checkbox
  const buyRequireChartFrameCheckbox = useMemo(() => {
    const renderFrames = (it) => {
      const currentChecked = requireFrame[it.id] || false;
      const currentWeight = it.weight || 0;
      const minWeight = SUPPORT_CHART_FRAME_WEIGHT[config.frame] || 0;

      return (
        <VuiBox
          id={it.id}
          mt={1.5}
          ml={1}
          display="flex"
          sx={{
            flexDirection: "row",
          }}
        >
          <Checkbox
            sx={{
              "& .MuiSvgIcon-root": {
                fontSize: 28,
                fill: currentWeight <= minWeight ? "gray" : "#d6e6e6",
              },
            }}
            disabled={currentWeight <= minWeight}
            color="success"
            defaultChecked={currentChecked}
            checked={currentChecked}
            onChange={(e, checked) =>
              setRequireFrame({
                ...requireFrame,
                [it.id]: checked,
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
            {it.label}
          </VuiTypography>
        </VuiBox>
      );
    };

    return (
      <VuiBox display="flex" flexDirection="row" gap="16px">
        <VuiBox>{BUY_REQUIRE_CHART_FRAME.map((it) => renderFrames(it))}</VuiBox>
        <VuiBox>{BUY_REQUIRE_CHART_FRAME_P2.map((it) => renderFrames(it))}</VuiBox>
      </VuiBox>
    );
  }, [requireFrame, config]);

  // render rsi strategy checkbox
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
              {it.label}
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
            color="text"
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

    return (
      <VuiBox sx={{ width: "100%" }}>{RSI_STRATEGY_OPTIONS.map((it) => renderFrames(it))}</VuiBox>
    );
  }, [rsiStrategy, config]);

  const onChange = (key, value) => {
    if (key === "symbol") setTickerPrice({});
    setConfig({ ...config, [key]: value });
  };

  useDebounce(
    () => {
      if (config.symbol) {
        getTickerPrice(config.symbol).then((tickerPrice) => {
          if (tickerPrice.status === 1) {
            setTickerPrice(tickerPrice);
            // not found market lot size && ticker price
            const marketLotSize = tickerPrice?.exchangeInfo?.filters.find(
              (ft) => ft.filterType === "MARKET_LOT_SIZE"
            );
            if (item?.createdAt === undefined) {
              // case new config then set amount default from exchange data
              onChange("buyAmount", parseFloat(marketLotSize.minQty));
            }
          }
        });
      }
    },
    [config.symbol],
    800
  );

  const onSubmit = async () => {
    if (config.symbol && config.frame && config.buyAmount) {
      setLoading(true);
      try {
        const result = await createSymbolConfig(
          config.side,
          config.symbol,
          parseFloat(config.buyAmount),
          parseInt(config.maxBudget),
          config.frame,
          config.requireHistogramCondition,
          config.buyRequireHistogram,
          config.autoTakeProfit,
          config.optimizeEntry,
          parseFloat(config.optimizeEntryPercent)
        );

        setLoading(false);
        onClose();

        setConfig({
          ...initConfig,
        });
        setRequireFrame({});
        setCurrentStep(0);
        setTickerPrice({});

        if (result.status === -1) {
          return dispatch(
            setMessage({
              message: result.message,
              type: "warning",
            })
          );
        } else {
          dispatch(
            setMessage({
              message: "Create symbol config success",
              type: "success",
            })
          );
        }

        const userSymbolConfig = await getSymbolConfig();
        dispatch(setSymbolConfigData(userSymbolConfig));
      } catch (e) {
        setLoading(false);
      }
    } else {
      console.log("Params missing");
    }
  };

  const pricePerOrderLeverage =
    Math.round((tickerPrice?.data?.price || 0) * config.buyAmount * 100) / 100;
  const pricePerOrder = Math.round((pricePerOrderLeverage / 20) * 100) / 100;

  const buttonStepSymbolDisabled = useMemo(() => {
    // loading
    if (loading) return true;

    if (config?.symbol?.length === 0 || !["BUY", "SELL"].includes(config?.side)) return true;

    // not found market lot size && ticker price
    const marketLotSize = tickerPrice?.exchangeInfo?.filters.find(
      (ft) => ft.filterType === "MARKET_LOT_SIZE"
    );
    if (marketLotSize === undefined) return true;
    // invalid amount, cannot create order
    if (
      config.buyAmount < parseFloat(marketLotSize.minQty) ||
      config.buyAmount > parseFloat(marketLotSize.maxQty) ||
      config.buyAmount === 0
    ) {
      return true;
    }

    // max budget should be greater than price per order (including leverage)
    if (
      config.maxBudget.toString().length === 0 ||
      parseInt(config.maxBudget) < pricePerOrderLeverage
    ) {
      return true;
    }
    return false;
  }, [loading, tickerPrice, config]);

  const steps = ["Symbol", "MACD Strategy", "RSI Strategy", "Optimize"];

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
          <Stepper
            sx={({}) => ({
              marginTop: 2,
              marginBottom: 4,
              marginLeft: 0,
              marginRight: 0,
            })}
            activeStep={currentStep}
            connector={<ColorlibConnector />}
            alternativeLabel
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentStep === 0 ? (
            <VuiBox>
              <Alert
                sx={{
                  borderColor: "#0075ff",
                  borderRadius: 4,
                  fontSize: 14,
                  fontWeight: "medium",
                  alignItems: "center",
                }}
                variant="outlined"
                severity="warning"
              >
                Estimation base on sample leverage x20. Adjust leverage level in Binance please.
              </Alert>
              <VuiBox
                mt={3}
                mb={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                  SIDE
                </VuiTypography>
                <ButtonGroup variant="contained" aria-label="Basic button group">
                  {!item?.side || item?.side === "BUY" ? (
                    <VuiButton
                      onClick={() => onChange("side", "BUY")}
                      color={config.side === "BUY" ? "success" : "light"}
                    >
                      BUY
                    </VuiButton>
                  ) : null}
                  {!item?.side || item?.side === "SELL" ? (
                    <VuiButton
                      onClick={() => onChange("side", "SELL")}
                      color={config.side === "SELL" ? "error" : "light"}
                    >
                      SELL
                    </VuiButton>
                  ) : null}
                </ButtonGroup>
              </VuiBox>
              <VuiBox mb={2} justifyContent="space-between" display="flex" alignItems="center">
                <VuiBox>
                  <VuiTypography
                    component="label"
                    variant="button"
                    color="white"
                    fontWeight="medium"
                  >
                    Symbol
                  </VuiTypography>
                </VuiBox>
                <GradientBorder
                  borderRadius={borders.borderRadius.lg}
                  padding="1px"
                  style={{ maxWidth: "50%" }}
                  backgroundImage={radialGradient(
                    palette.gradients.borderLight.main,
                    palette.gradients.borderLight.state,
                    palette.gradients.borderLight.angle
                  )}
                >
                  <VuiInput
                    placeholder="BNB"
                    disabled={item?.symbol}
                    value={config.symbol}
                    onChange={(e) => onChange("symbol", e.nativeEvent.target.value)}
                    sx={({ typography: { size } }) => ({
                      fontSize: size.sm,
                    })}
                  />
                </GradientBorder>
              </VuiBox>
              <VuiBox mb={2} justifyContent="space-between" display="flex" alignItems="center">
                <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                  Buy Amount
                </VuiTypography>
                <GradientBorder
                  borderRadius={borders.borderRadius.lg}
                  padding="1px"
                  style={{ maxWidth: "50%" }}
                  backgroundImage={radialGradient(
                    palette.gradients.borderLight.main,
                    palette.gradients.borderLight.state,
                    palette.gradients.borderLight.angle
                  )}
                >
                  <VuiInput
                    type="text"
                    value={config.buyAmount}
                    placeholder="0.1"
                    onChange={(e) => onChange("buyAmount", e.nativeEvent.target.value)}
                    sx={({ typography: { size } }) => ({
                      fontSize: size.sm,
                    })}
                  />
                </GradientBorder>
              </VuiBox>
              <MiniStatisticsCard
                note="Note: SA Bot might make many DCA until Max Budget"
                title={{ text: "Budget per order (including leverage)", fontWeight: "regular" }}
                count={["$", pricePerOrderLeverage].join("")}
                percentage={{
                  color: "success",
                  text: ["(or $", pricePerOrder, " exclude leverage)"].join(""),
                }}
              />

              <VuiBox mt={2} justifyContent="space-between" display="flex" alignItems="center">
                <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                  Max Budget ($)
                </VuiTypography>
                <GradientBorder
                  borderRadius={borders.borderRadius.lg}
                  padding="1px"
                  style={{ maxWidth: "50%" }}
                  backgroundImage={radialGradient(
                    palette.gradients.borderLight.main,
                    palette.gradients.borderLight.state,
                    palette.gradients.borderLight.angle
                  )}
                >
                  <VuiInput
                    type="text"
                    value={config.maxBudget}
                    onChange={(e) => onChange("maxBudget", e.nativeEvent.target.value)}
                    placeholder="500 USDT"
                    sx={({ typography: { size } }) => ({
                      fontSize: size.sm,
                    })}
                  />
                </GradientBorder>
              </VuiBox>
              <VuiBox display="flex" mt={1}>
                <VuiTypography
                  variant="button"
                  color={config.maxBudget < pricePerOrderLeverage ? "warning" : "text"}
                  fontWeight="light"
                >
                  {config.maxBudget < pricePerOrderLeverage
                    ? [
                        "Max Budget should be greater than Budget per order ",
                        "$",
                        pricePerOrderLeverage,
                      ].join("")
                    : "Including leverage, maximum DCA budget for the symbol"}
                </VuiTypography>
              </VuiBox>

              <VuiBox mt={4}>
                <VuiButton
                  onClick={() => setCurrentStep(1)}
                  disabled={buttonStepSymbolDisabled}
                  color={"info"}
                  fullWidth
                >
                  NEXT
                </VuiButton>
              </VuiBox>
            </VuiBox>
          ) : null}

          {currentStep === 1 ? (
            <VuiBox>
              <VuiBox mb={2}>
                <VuiBox mb={1}>
                  <VuiTypography
                    component="label"
                    variant="button"
                    color="white"
                    fontWeight="medium"
                  >
                    Trading Frame
                    <VuiTypography
                      component="label"
                      variant="button"
                      color="text"
                      fontWeight="light"
                    >
                      {" "}
                      (Main frame for trading)
                    </VuiTypography>
                  </VuiTypography>
                </VuiBox>
                <ButtonGroup variant="contained" aria-label="Basic button group">
                  {tradeChartFrameButtons}
                </ButtonGroup>
              </VuiBox>

              <VuiBox mb={2}>
                <VuiBox mb={1} justifyContent="space-between" display="flex" alignItems="center">
                  <VuiBox>
                    <VuiTypography
                      component="label"
                      variant="button"
                      color="white"
                      fontWeight="medium"
                    >
                      Require Matching Histogram{" "}
                    </VuiTypography>
                    <VuiTypography
                      component="label"
                      variant="button"
                      color="text"
                      fontWeight="light"
                    >
                      (Optional)
                    </VuiTypography>
                  </VuiBox>
                </VuiBox>
                <VuiBox
                  display="flex"
                  sx={({ breakpoints }) => ({
                    [breakpoints.up("sm")]: {
                      flexDirection: "column",
                    },
                    [breakpoints.up("md")]: {
                      flexDirection: "column",
                    },
                    [breakpoints.only("xl")]: {
                      flexDirection: "column",
                    },
                  })}
                >
                  {buyRequireChartFrameCheckbox}
                </VuiBox>
              </VuiBox>

              {config.buyRequireHistogram.length > 0 ? (
                <VuiBox mb={2}>
                  <VuiBox display="flex" justifyContent="space-between" alignItems="center">
                    <VuiBox display="vertical">
                      <VuiTypography
                        component="label"
                        variant="button"
                        color="white"
                        fontWeight="medium"
                      >
                        Histogram Condition{" "}
                      </VuiTypography>
                    </VuiBox>
                    <ButtonGroup variant="contained" aria-label="Basic button group">
                      <VuiButton
                        onClick={() => onChange("requireHistogramCondition", "AND")}
                        color={config.requireHistogramCondition === "AND" ? "orange" : "light"}
                      >
                        AND
                      </VuiButton>
                      <VuiButton
                        onClick={() => onChange("requireHistogramCondition", "OR")}
                        color={config.requireHistogramCondition === "OR" ? "dribbble" : "light"}
                      >
                        OR
                      </VuiButton>
                    </ButtonGroup>
                  </VuiBox>
                </VuiBox>
              ) : null}
              <MiniStatisticsCard
                title={{
                  text: [config.side === "BUY" ? "Buy" : "Sell", "Strategy"].join(" "),
                  fontWeight: "regular",
                }}
                percentage={{
                  color: config.side === "BUY" ? "success" : "error",
                  text: [
                    "When histogram of Trading Frame is in",
                    config.side === "BUY" ? "bottom" : "top",
                    config.buyRequireHistogram.length > 0
                      ? [
                          "and",
                          config.requireHistogramCondition === "AND"
                            ? "All of Require frames"
                            : "One of Require frame",
                          config.requireHistogramCondition === "AND" ? "are in" : "is in",
                          config.side === "BUY" ? "bottom" : "top",
                        ].join(" ")
                      : "",
                    `then Bot will open a ${config.side} Limit Order at`,
                    config.side === "BUY" ? "bottom" : "top",
                    "of Bollinger Band of Trading Frame and cancel the Order if it not filled after",
                    config.frame,
                  ].join(" "),
                }}
              />
              <VuiBox mt={3} mb={2}>
                <VuiBox alignItems="center" justifyContent="space-between" display="flex">
                  <VuiTypography
                    component="label"
                    variant="button"
                    color="white"
                    fontWeight="medium"
                  >
                    Bot takes profit for you?
                  </VuiTypography>
                  <VuiSwitch
                    color="success"
                    checked={config.autoTakeProfit}
                    onChange={(e, switched) => {
                      onChange("autoTakeProfit", switched);
                    }}
                  />
                </VuiBox>

                <VuiBox display="flex">
                  <VuiTypography component="label" variant="button" color="text" fontWeight="light">
                    {config.autoTakeProfit
                      ? "Yes, Bot helps me to take profit"
                      : "No, I take profit manually"}
                  </VuiTypography>
                </VuiBox>
              </VuiBox>
              <VuiBox mt={4} justifyContent="space-between" display="flex" alignItems="center">
                <VuiBox minWidth="46%">
                  <VuiButton onClick={() => setCurrentStep(0)} color={"light"} fullWidth>
                    BACK
                  </VuiButton>
                </VuiBox>
                <VuiBox minWidth="46%">
                  <VuiButton
                    onClick={() => setCurrentStep(2)}
                    color={!config.frame || !config.requireHistogramCondition ? "dark" : "info"}
                    fullWidth
                  >
                    NEXT
                  </VuiButton>
                </VuiBox>
              </VuiBox>
            </VuiBox>
          ) : null}

          {currentStep === 2 ? (
            <VuiBox>
              <VuiBox mb={2}>
                <VuiBox mb={1} alignItems="center" justifyContent="space-between" display="flex">
                  <VuiTypography
                    component="label"
                    variant="button"
                    color="white"
                    fontWeight="medium"
                  >
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
                  <VuiButton onClick={() => setCurrentStep(1)} color={"light"} fullWidth>
                    BACK
                  </VuiButton>
                </VuiBox>
                <VuiBox minWidth="46%">
                  <VuiButton
                    onClick={() => setCurrentStep(3)}
                    color={!config.enableRSIStrategy ? "dark" : "info"}
                    fullWidth
                  >
                    NEXT
                  </VuiButton>
                </VuiBox>
              </VuiBox>
            </VuiBox>
          ) : null}

          {currentStep === 3 ? (
            <VuiBox>
              <VuiBox mb={2}>
                <VuiBox mb={1} alignItems="center" justifyContent="space-between" display="flex">
                  <VuiTypography
                    component="label"
                    variant="button"
                    color="white"
                    fontWeight="medium"
                  >
                    Optimize Entry Position
                  </VuiTypography>
                  <VuiSwitch
                    color="success"
                    checked={config.optimizeEntry}
                    onChange={(e, switched) => {
                      onChange("optimizeEntry", switched);
                    }}
                  />
                </VuiBox>

                <VuiBox display="flex">
                  <VuiTypography component="label" variant="button" color="text" fontWeight="light">
                    When position size in USDT (including leverage) reach Maximum Budget. By cutting
                    off P% to release USDT so that BOT can do a new DCA.
                  </VuiTypography>
                </VuiBox>
                <VuiBox mt={2}>
                  <GradientBorder
                    borderRadius={borders.borderRadius.lg}
                    padding="1px"
                    backgroundImage={radialGradient(
                      palette.gradients.borderLight.main,
                      palette.gradients.borderLight.state,
                      palette.gradients.borderLight.angle
                    )}
                  >
                    <VuiInput
                      placeholder="5%"
                      disabled={!config.optimizeEntry}
                      value={config.optimizeEntryPercent}
                      onChange={(e) => onChange("optimizeEntryPercent", e.nativeEvent.target.value)}
                      sx={({ typography: { size } }) => ({
                        fontSize: size.sm,
                      })}
                    />
                  </GradientBorder>
                </VuiBox>
              </VuiBox>
              <VuiBox mt={4} justifyContent="space-between" display="flex" alignItems="center">
                <VuiBox minWidth="46%">
                  <VuiButton onClick={() => setCurrentStep(2)} color={"light"} fullWidth>
                    BACK
                  </VuiButton>
                </VuiBox>
                <VuiBox minWidth="46%">
                  <VuiButton
                    onClick={onSubmit}
                    color={!config.frame || !config.requireHistogramCondition ? "dark" : "info"}
                    fullWidth
                  >
                    CREATE
                  </VuiButton>
                </VuiBox>
              </VuiBox>
            </VuiBox>
          ) : null}
          <VuiBox mt={3} textAlign="center">
            <VuiTypography variant="button" color="text" fontWeight="regular">
              View setup guide
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </GradientBorder>
    </Dialog>
  );
}
