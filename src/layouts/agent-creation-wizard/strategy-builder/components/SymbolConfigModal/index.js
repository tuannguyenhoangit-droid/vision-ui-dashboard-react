import { Alert, ButtonGroup, Checkbox, Dialog, Step, StepLabel, Stepper } from "@mui/material";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
// Vision UI Dashboard React components
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
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
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

const SUPPORT_CHART_FRAME = ["3m", "5m", "15m", "30m"];

const BUY_REQUIRE_CHART_FRAME = [
  { id: "5m", label: "5m", pro: false },
  { id: "15m", label: "15m", pro: false },
  {
    id: "30m",
    label: "30m",
    pro: false,
  },
];
const BUY_REQUIRE_CHART_FRAME_P2 = [
  {
    id: "1h",
    label: "1h",
    pro: true,
  },
  {
    id: "2h",
    label: "2h",
    pro: true,
  },
  {
    id: "4h",
    label: "4h",
    pro: true,
  },
];
const initConfig = {
  side: "BUY",
  symbol: "",
  buyAmount: 0,
  maxBudget: 0,
  autoTakeProfit: true,
  frame: "3m",
  buyRequireHistogram: [],
  requireHistogramCondition: "AND",
  optimizeEntry: false,
  optimizeEntryPercent: 0,
};
export function SymbolConfigModal({ open, onClose = () => null, item = null }) {
  const [loading, setLoading] = useState(false);
  const [requireFrame, setRequireFrame] = useState({});
  const [config, setConfig] = useState(initConfig);
  const [tickerPrice, setTickerPrice] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  const dispatch = useDispatch();

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

  useEffect(() => {
    if (item) {
      const requireFrame = {};
      item.buyRequireHistogram.forEach((frame) => {
        requireFrame[frame] = true;
      });

      setRequireFrame({ ...requireFrame });
      setConfig(item);
    }
    return () => {
      setConfig({
        ...initConfig,
      });
      setRequireFrame({});
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

  const buyRequireChartFrameCheckbox = useMemo(() => {
    const renderFrames = (it) => {
      const currentChecked = requireFrame[it.id] || false;
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
            sx={{ "& .MuiSvgIcon-root": { fontSize: 28, fill: it.pro ? "gray" : "#d6e6e6" } }}
            disabled={it.pro || !["AND", "OR"].includes(config.requireHistogramCondition)}
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
      <VuiBox display="flex" justifyContent="flex-start">
        <VuiBox width="35%">{BUY_REQUIRE_CHART_FRAME.map((it) => renderFrames(it))}</VuiBox>
        <VuiBox>{BUY_REQUIRE_CHART_FRAME_P2.map((it) => renderFrames(it))}</VuiBox>
      </VuiBox>
    );
  }, [requireFrame, config]);

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
            if (item === null) {
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

        const userSymbolConfig = await getSymbolConfig();
        dispatch(setSymbolConfigData(userSymbolConfig));
        setConfig({
          ...initConfig,
        });
        setRequireFrame({});
        setCurrentStep(0);
        setTickerPrice({});
      } catch (e) {
        setLoading(false);
      }
    } else {
      console.log("Params missing");
    }
  };

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
    return false;
  }, [loading, tickerPrice, config]);

  const steps = ["Symbol", "Strategy", "Optimize"];

  const pricePerOrderLeverage =
    Math.round((tickerPrice?.data?.price || 0) * config.buyAmount * 100) / 100;
  const pricePerOrder = Math.round((pricePerOrderLeverage / 20) * 100) / 100;

  return (
    <Dialog onClose={onClose} open={open} maxWidth>
      <GradientBorder borderRadius={"6"} fullWidth="100%">
        <VuiBox
          component="form"
          role="form"
          borderRadius="inherit"
          p="24px"
          width="420px"
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
                title={{ text: "Per order (including leverage)", fontWeight: "regular" }}
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
                <VuiTypography component="label" variant="button" color="text" fontWeight="light">
                  Maximum DCA budget for the symbol (including leverage)
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
                title={{ text: "Strategy", fontWeight: "regular" }}
                percentage={{
                  color: "success",
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
                  <VuiButton onClick={() => setCurrentStep(1)} color={"light"} fullWidth>
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
