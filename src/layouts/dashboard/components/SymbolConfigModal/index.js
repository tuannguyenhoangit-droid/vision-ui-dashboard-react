import { ButtonGroup, Checkbox, Dialog } from "@mui/material";

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
import SyncIcon from "@mui/icons-material/Sync";
import { useDispatch } from "react-redux";
import { createSymbolConfig, getSymbolConfig } from "../../../../services/api";
import { setSymbolConfigData } from "../../../../redux/futures/symbolConfigSlice";

const SUPPORT_CHART_FRAME = ["3m", "5m", "15m", "30m"];

const BUY_REQUIRE_CHART_FRAME = [
  { id: "5m", label: "5m", pro: false },
  { id: "15m", label: "15m", pro: false },
  {
    id: "30m",
    label: "30m",
    pro: false,
  },
  {
    id: "1h",
    label: "1h (Pro version)",
    pro: true,
  },
  {
    id: "2h",
    label: "2h (Pro version)",
    pro: true,
  },
  {
    id: "4h",
    label: "4h (Pro version)",
    pro: true,
  },
];
const initConfig = {
  symbol: "",
  frame: "",
  buyAmount: 0,
  maxBudget: 0,
  side: "BUY",
  buyRequireHistogram: [],
  optimizeEntry: false,
};
export function SymbolConfigModal({ open, onClose = () => null, item = null }) {
  const [loading, setLoading] = useState(false);
  const [requireFrame, setRequireFrame] = useState({});
  const [config, setConfig] = useState(initConfig);
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
    return BUY_REQUIRE_CHART_FRAME.map((it) => {
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
            disabled={it.pro}
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
    });
  }, [requireFrame, config]);

  const onChange = (key, value) => {
    setConfig({ ...config, [key]: value });
  };

  const onSubmit = async () => {
    if (config.symbol && config.frame && config.buyAmount) {
      setLoading(true);
      try {
        const result = await createSymbolConfig(
          config.symbol,
          config.frame,
          parseFloat(config.buyAmount),
          parseInt(config.maxBudget),
          config.optimizeEntry,
          config.side,
          config.buyRequireHistogram
        );
        console.log("result", result);
        setLoading(false);
        onClose();

        const userSymbolConfig = await getSymbolConfig();
        dispatch(setSymbolConfigData(userSymbolConfig));
        setConfig({
          ...initConfig,
        });
      } catch (e) {
        setLoading(false);
        console.log("e", e);
      }
    } else {
      console.log("Params missing");
    }
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <GradientBorder borderRadius={"6"} maxWidth="100%">
        <VuiBox
          component="form"
          role="form"
          borderRadius="inherit"
          p="45px"
          sx={({ palette: { secondary } }) => ({
            backgroundColor: secondary.focus,
          })}
        >
          <VuiTypography
            color="white"
            fontWeight="bold"
            textAlign="center"
            mb="24px"
            sx={({ typography: { size } }) => ({
              fontSize: size.lg,
            })}
          >
            Add Symbol Config
          </VuiTypography>
          <VuiBox
            display="flex"
            sx={({ breakpoints }) => ({
              [breakpoints.up("sm")]: {
                flexDirection: "column",
              },
              [breakpoints.up("md")]: {
                flexDirection: "row",
              },
              [breakpoints.only("xl")]: {
                flexDirection: "row",
              },
            })}
          >
            <VuiBox mb={2}>
              <VuiBox mb={1} ml={0.5}>
                <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                  Symbol
                </VuiTypography>
              </VuiBox>
              <GradientBorder
                minWidth="100%"
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
                  value={config.symbol}
                  onChange={(e) => onChange("symbol", e.nativeEvent.target.value)}
                  sx={({ typography: { size } }) => ({
                    fontSize: size.sm,
                  })}
                />
              </GradientBorder>
            </VuiBox>
            <VuiBox mb={2} ml={2}>
              <VuiBox mb={1} ml={0.5}>
                <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                  Buy Amount
                </VuiTypography>
              </VuiBox>
              <GradientBorder
                minWidth="100%"
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
          </VuiBox>
          <VuiBox mb={2}>
            <VuiBox mb={1} ml={0.5}>
              <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                Trade Chart Frame
              </VuiTypography>
            </VuiBox>
            <ButtonGroup variant="contained" aria-label="Basic button group">
              {tradeChartFrameButtons}
            </ButtonGroup>
          </VuiBox>

          <VuiBox mb={2}>
            <VuiBox mb={1} ml={0.5}>
              <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                Require Matching All Histogram in Frame
              </VuiTypography>
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
          <VuiBox mb={2}>
            <VuiBox mb={1} ml={0.5}>
              <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                Max Budget
              </VuiTypography>
            </VuiBox>
            <GradientBorder
              minWidth="100%"
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
          <VuiBox mb={2}>
            <VuiBox mb={1} ml={0.5}>
              <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                Optimize Entry Position
              </VuiTypography>
            </VuiBox>
            <VuiBox display="flex" alignItems="center">
              <VuiSwitch
                color="success"
                checked={config.optimizeEntry}
                onChange={(e, switched) => {
                  onChange("optimizeEntry", switched);
                }}
              />
              <VuiTypography
                ml={1}
                variant="caption"
                color="white"
                fontWeight="normal"
                onClick={() => onChange("optimizeEntry", !config.optimizeEntry)}
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                When position size in USDT reach Maximum Budget
              </VuiTypography>
            </VuiBox>
          </VuiBox>
          <VuiBox mt={4} mb={1}>
            <VuiButton
              loading={loading}
              disabled={loading}
              onClick={onSubmit}
              color="info"
              fullWidth
            >
              <SyncIcon size="22px" color="white" />
              CREATE CONFIG
            </VuiButton>
          </VuiBox>
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
