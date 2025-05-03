import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import Grid from "@mui/material/Grid";
import aiTradingBot from "assets/images/landing_image3.png";
import botFeatures from "assets/images/bot_features.png";
import botFAQ from "assets/images/faq.png";
import DashboardNavbar from "./components/DashboardNavbar";
import { isMobile } from "react-device-detect";
import Footer from "examples/Footer";
import VuiButton from "components/VuiButton";
import Card from "@mui/material/Card";
import StrategyCard from "./components/StrategyCard";

import profile1 from "assets/images/sub_beginer.png";
import profile2 from "assets/images/sub_beginer.png";
import profile3 from "assets/images/sub_beginer.png";
import { Email, Telegram } from "@mui/icons-material";
import Binance from "assets/images/shapes/binance.svg";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Sidenav from "examples/Sidenav";
import { getRecommandedSymbols } from "services/api";
import { useEffect, useState, useCallback, useMemo } from "react";
import SymbolSignal from "./components/SymbolSignal";

import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Background,
  Controls,
  Panel,
} from "reactflow";

import "reactflow/dist/style.css";

// Trading Strategy Flow Diagram nodes
const initialNodes = [
  // Main flow nodes
  {
    id: "start",
    type: "input",
    data: { label: "Start Trading Strategy" },
    position: { x: 415, y: 0 },
    style: { background: "#0075FF", color: "white", borderRadius: "30px", width: 200 },
  },
  {
    id: "multiTimeframe",
    data: { label: "Analyze Multiple Timeframes" },
    position: { x: 440, y: 80 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },
  {
    id: "signalAnalysis",
    data: { label: "Signal Analysis" },
    position: { x: 440, y: 160 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },

  // Core Signal Analysis nodes
  {
    id: "macd",
    data: { label: "MACD Analysis" },
    position: { x: 150, y: 240 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },
  {
    id: "ema",
    data: { label: "EMA Crossover Analysis" },
    position: { x: 350, y: 240 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },
  {
    id: "stochRSI",
    data: { label: "StochRSI Analysis" },
    position: { x: 550, y: 240 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },
  {
    id: "bBands",
    data: { label: "Bollinger Bands Analysis" },
    position: { x: 750, y: 240 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },

  // Signal Computation nodes
  {
    id: "histogramEvaluation",
    data: { label: "Histogram Evaluation" },
    position: { x: 0, y: 320 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },
  {
    id: "emaCrossover",
    data: { label: "EMA Crossover Detection" },
    position: { x: 300, y: 320 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },
  {
    id: "stochRSIRange",
    data: { label: "StochRSI Range Analysis" },
    position: { x: 600, y: 320 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },
  {
    id: "pricePosition",
    data: { label: "Price Position in Bands" },
    position: { x: 900, y: 320 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },

  // Signal details
  {
    id: "histogramTop",
    data: { label: "Top of Histogram" },
    position: { x: -100, y: 400 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },
  {
    id: "histogramBottom",
    data: { label: "Bottom of Histogram" },
    position: { x: 60, y: 400 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },

  {
    id: "emaCrossUp",
    data: { label: "EMA Cross Up = Bullish" },
    position: { x: 220, y: 400 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },
  {
    id: "emaCrossDown",
    data: { label: "EMA Cross Down = Bearish" },
    position: { x: 380, y: 400 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },

  {
    id: "overBought",
    data: { label: "Overbought Zone" },
    position: { x: 540, y: 400 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },
  {
    id: "overSold",
    data: { label: "Oversold Zone" },
    position: { x: 700, y: 400 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },

  {
    id: "upperBand",
    data: { label: "Upper Band = Resistance" },
    position: { x: 860, y: 400 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },
  {
    id: "lowerBand",
    data: { label: "Lower Band = Support" },
    position: { x: 1020, y: 400 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },

  // Signal Weighting
  {
    id: "signalWeighting",
    data: { label: "Signal Weighting & Combination" },
    position: { x: 440, y: 480 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },
  {
    id: "confidenceCalculation",
    data: { label: "Calculate Signal Confidence" },
    position: { x: 440, y: 560 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },
  {
    id: "finalSignal",
    data: { label: "Final Trading Signal" },
    position: { x: 440, y: 640 },
    style: { background: "#0C1E4E", color: "white", border: "1px solid #0075FF" },
  },

  // Signal Types
  {
    id: "buySignal",
    data: { label: "BUY Signal" },
    position: { x: 280, y: 720 },
    style: { background: "#0C1E4E", color: "#1acd7c", border: "1px solid #1acd7c" },
  },
  {
    id: "sellSignal",
    data: { label: "SELL Signal" },
    position: { x: 600, y: 720 },
    style: { background: "#0C1E4E", color: "#f53535", border: "1px solid #f53535" },
  },
  {
    id: "neutralSignal",
    data: { label: "NEUTRAL Signal" },
    position: { x: 440, y: 720 },
    style: { background: "#0C1E4E", color: "#FFD700", border: "1px solid #FFD700" },
  },

  // Trading Actions
  {
    id: "histogramPosition",
    data: { label: "Histogram Position?" },
    position: { x: 440, y: 800 },
    style: {
      background: "#0C1E4E",
      color: "white",
      border: "1px solid #0075FF",
      borderRadius: "15px",
    },
  },

  // Bottom Histogram Actions
  {
    id: "buyOpportunity",
    data: { label: "BUY Opportunity" },
    position: { x: 200, y: 880 },
    style: { background: "#0C1E4E", color: "#1acd7c", border: "1px solid #1acd7c" },
  },
  {
    id: "enterLong",
    data: { label: "Enter Long Position" },
    position: { x: 200, y: 960 },
    style: { background: "#0C1E4E", color: "#1acd7c", border: "1px solid #1acd7c" },
  },
  {
    id: "sellTP",
    data: { label: "Take Profit for Short" },
    position: { x: 680, y: 880 },
    style: { background: "#0C1E4E", color: "#f53535", border: "1px solid #f53535" },
  },

  // Top Histogram Actions
  {
    id: "sellOpportunity",
    data: { label: "SELL Opportunity" },
    position: { x: 520, y: 880 },
    style: { background: "#0C1E4E", color: "#f53535", border: "1px solid #f53535" },
  },
  {
    id: "enterShort",
    data: { label: "Enter Short Position" },
    position: { x: 520, y: 960 },
    style: { background: "#0C1E4E", color: "#f53535", border: "1px solid #f53535" },
  },
  {
    id: "buyTP",
    data: { label: "Take Profit for Long" },
    position: { x: 360, y: 880 },
    style: { background: "#0C1E4E", color: "#1acd7c", border: "1px solid #1acd7c" },
  },
];

// Trading Strategy Flow Diagram edges
const initialEdges = [
  // Main flow - primary path animated
  {
    id: "e1",
    source: "start",
    target: "multiTimeframe",
    animated: true,
    style: { stroke: "#0075FF", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e2",
    source: "multiTimeframe",
    target: "signalAnalysis",
    animated: true,
    style: { stroke: "#0075FF", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },

  // Signal Analysis to Core components - alternate animation for different paths
  {
    id: "e3",
    source: "signalAnalysis",
    target: "macd",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e4",
    source: "signalAnalysis",
    target: "ema",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e5",
    source: "signalAnalysis",
    target: "stochRSI",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e6",
    source: "signalAnalysis",
    target: "bBands",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },

  // Core to computation - animated main paths
  {
    id: "e7",
    source: "macd",
    target: "histogramEvaluation",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e8",
    source: "ema",
    target: "emaCrossover",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e9",
    source: "stochRSI",
    target: "stochRSIRange",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e10",
    source: "bBands",
    target: "pricePosition",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },

  // Computation to details
  {
    id: "e11",
    source: "histogramEvaluation",
    target: "histogramTop",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e12",
    source: "histogramEvaluation",
    target: "histogramBottom",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },

  {
    id: "e13",
    source: "emaCrossover",
    target: "emaCrossUp",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e14",
    source: "emaCrossover",
    target: "emaCrossDown",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },

  {
    id: "e15",
    source: "stochRSIRange",
    target: "overBought",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e16",
    source: "stochRSIRange",
    target: "overSold",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },

  {
    id: "e17",
    source: "pricePosition",
    target: "upperBand",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e18",
    source: "pricePosition",
    target: "lowerBand",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },

  // Details to weighting - some animated to show active signal flows
  {
    id: "e19",
    source: "histogramTop",
    target: "signalWeighting",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e20",
    source: "histogramBottom",
    target: "signalWeighting",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e21",
    source: "emaCrossUp",
    target: "signalWeighting",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e22",
    source: "emaCrossDown",
    target: "signalWeighting",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e23",
    source: "overBought",
    target: "signalWeighting",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e24",
    source: "overSold",
    target: "signalWeighting",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e25",
    source: "upperBand",
    target: "signalWeighting",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e26",
    source: "lowerBand",
    target: "signalWeighting",
    animated: true,
    style: { stroke: "#0075FF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },

  // Main signal flow path - animated
  {
    id: "e27",
    source: "signalWeighting",
    target: "confidenceCalculation",
    animated: true,
    style: { stroke: "#0075FF", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },
  {
    id: "e28",
    source: "confidenceCalculation",
    target: "finalSignal",
    animated: true,
    style: { stroke: "#0075FF", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0075FF" },
  },

  // Final signals - animated with color-coding
  {
    id: "e29",
    source: "finalSignal",
    target: "buySignal",
    animated: true,
    style: { stroke: "#1acd7c", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#1acd7c" },
  },
  {
    id: "e30",
    source: "finalSignal",
    target: "sellSignal",
    animated: true,
    style: { stroke: "#f53535", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f53535" },
  },
  {
    id: "e31",
    source: "finalSignal",
    target: "neutralSignal",
    animated: true,
    style: { stroke: "#FFD700" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#FFD700" },
  },

  // Trading Actions - animated decision paths
  {
    id: "e32",
    source: "buySignal",
    target: "histogramPosition",
    animated: true,
    style: { stroke: "#1acd7c" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#1acd7c" },
  },
  {
    id: "e33",
    source: "sellSignal",
    target: "histogramPosition",
    animated: true,
    style: { stroke: "#f53535" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f53535" },
  },

  // Histogram position decisions - active trading paths
  {
    id: "e34",
    source: "histogramPosition",
    target: "buyOpportunity",
    label: "Bottom",
    animated: true,
    style: { stroke: "#1acd7c" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#1acd7c" },
  },
  {
    id: "e35",
    source: "histogramPosition",
    target: "sellTP",
    label: "Top",
    animated: true,
    style: { stroke: "#f53535" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f53535" },
  },

  {
    id: "e36",
    source: "histogramPosition",
    target: "sellOpportunity",
    label: "Top",
    animated: true,
    style: { stroke: "#f53535" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f53535" },
  },
  {
    id: "e37",
    source: "histogramPosition",
    target: "buyTP",
    label: "Bottom",
    animated: true,
    style: { stroke: "#1acd7c" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#1acd7c" },
  },

  // Final actions - primary trading decisions animated
  {
    id: "e38",
    source: "buyOpportunity",
    target: "enterLong",
    animated: true,
    style: { stroke: "#1acd7c", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#1acd7c" },
  },
  {
    id: "e39",
    source: "sellOpportunity",
    target: "enterShort",
    animated: true,
    style: { stroke: "#f53535", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f53535" },
  },
];
function Landing() {
  const history = useHistory();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const [recommandedSymbols, setRecommandedSymbols] = useState([]);

  useEffect(() => {
    const fetchSymbolSignal = async () => {
      const response = await getRecommandedSymbols();
      setRecommandedSymbols(response);
    };
    setTimeout(() => {
      fetchSymbolSignal();
    }, 1000);
  }, []);

  return (
    <VuiBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: isMobile ? 1.5 : 3,
        position: "relative",
        [breakpoints.up("xxxxl")]: {
          marginLeft: pxToRem(240),
          marginRight: pxToRem(240),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
        [breakpoints.up("xxxl")]: {
          marginLeft: pxToRem(180),
          marginRight: pxToRem(180),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
        [breakpoints.up("xxl")]: {
          marginLeft: pxToRem(120),
          marginRight: pxToRem(120),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
        [breakpoints.up("xl")]: {
          marginLeft: pxToRem(80),
          marginRight: pxToRem(80),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
        [breakpoints.up("lg")]: {
          marginLeft: pxToRem(50),
          marginRight: pxToRem(50),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
        [breakpoints.up("md")]: {
          marginLeft: pxToRem(isMobile ? 15 : 30),
          marginRight: pxToRem(isMobile ? 15 : 30),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
        [breakpoints.up("sm")]: {
          marginLeft: pxToRem(isMobile ? 10 : 20),
          marginRight: pxToRem(isMobile ? 10 : 20),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
        [breakpoints.up("sm")]: {
          marginLeft: pxToRem(isMobile ? 5 : 10),
          marginRight: pxToRem(isMobile ? 5 : 10),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      <DashboardNavbar />
      <Sidenav
        sx={({ breakpoints }) => ({
          display: "none",
          [breakpoints.down("xl")]: {
            display: "block",
          },
        })}
        color="info"
        brand=""
        brandName="SA Trading Bot"
        routes={[
          // sign in and sign up
          {
            type: "collapse",
            name: "Sign In",
            icon: "bot",
            route: "/authentication/sign-in",
          },
          {
            type: "collapse",
            name: "Sign Up",
            icon: "bot",
            route: "/authentication/sign-up",
          },
          {
            type: "collapse",
            name: "Bot Strategies",
            icon: "bot",
            route: "/bot-strategies",
          },
          {
            type: "collapse",
            name: "Learn Strategies",
            icon: "bot",
            route: "/learn-strategies",
          },
        ]} // bot strategies and learn strategies
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
      />
      <VuiBox>
        <Grid
          container
          paddingTop={isMobile ? 1 : 6}
          paddingBottom={isMobile ? 1 : 6}
          alignItems="center"
        >
          <Grid
            item
            xs={12}
            md={isMobile ? 8 : 7}
            lg={isMobile ? 8 : 7}
            xl={isMobile ? 6 : 5}
            pl={2}
          >
            <VuiBox mb={isMobile ? 1 : 0}>
              <VuiTypography
                sx={({ breakpoints }) => ({
                  [breakpoints.up("sm")]: {
                    fontSize: isMobile ? "20px" : "24px",
                  },
                })}
                color="primary"
                variant="h4"
              >
                Automated Trading Platform
              </VuiTypography>
            </VuiBox>
            <VuiTypography
              color="white"
              sx={({ breakpoints }) => ({
                [breakpoints.up("xl")]: {
                  fontSize: "40px",
                },
                [breakpoints.up("lg")]: {
                  fontSize: "32px",
                },
                [breakpoints.down("lg")]: {
                  fontSize: isMobile ? "22px" : "28px",
                },
                [breakpoints.down("xs")]: {
                  fontSize: isMobile ? "20px" : "24px",
                },
              })}
            >
              Not a Grid Bot!
              <br />
              SA Bot follows trendlines and makes trades
            </VuiTypography>
            <VuiBox mt={2} display="flex" flexDirection="row" gap={2}>
              <VuiBox
                display="flex"
                flexDirection="row"
                gap={2}
                justifyContent="flex-start"
                alignItems="center"
              >
                <VuiButton
                  color="primary"
                  variant="gradient"
                  onClick={() => history.push("/future")}
                >
                  Try Now
                </VuiButton>
                <VuiButton color="primary" variant="gradient" href="#bot-strategies">
                  Get Started
                </VuiButton>
              </VuiBox>
            </VuiBox>
          </Grid>
          <Grid item xs={12} md={isMobile ? 4 : 5} lg={isMobile ? 4 : 5} xl={isMobile ? 6 : 7}>
            <VuiBox
              display="flex"
              flexDirection="row"
              sx={({ breakpoints }) => {
                return {
                  [breakpoints.up("xl")]: {
                    height: "320px",
                    justifyContent: "flex-end",
                    paddingRight: 10,
                  },
                  [breakpoints.only("lg")]: {
                    height: "280px",
                    justifyContent: "flex-end",
                    paddingRight: 4,
                  },
                  [breakpoints.only("md")]: {
                    height: "240px",
                    justifyContent: "flex-end",
                  },
                  [breakpoints.only("sm")]: {
                    height: "200px",
                    justifyContent: "center",
                    marginTop: "32px",
                  },
                  [breakpoints.down("sm")]: {
                    height: "160px",
                    marginTop: "32px",
                    justifyContent: "center",
                  },
                };
              }}
            >
              <VuiBox component="img" height="100%" src={aiTradingBot} alt="AI Trading Bot" />
            </VuiBox>
          </Grid>
        </Grid>
        {/* Recommanded Symbols Signal */}
        <Grid mt={isMobile ? 4 : 8} item xs={12} md={12} lg={12} xl={12} id="recommanded-symbols">
          <SymbolSignal
            type="long-term"
            title="Long Term Signals by AI"
            description="Base on 1d 3d 1w data analytics"
            profitIn="Profit in 3-7 days"
            data={recommandedSymbols.longTermSignals}
          />
        </Grid>

        <Grid item xs={12} md={12} lg={12} xl={12} id="recommanded-symbols">
          <SymbolSignal
            type="mid-term"
            title="Mid Term Signals by AI"
            description="Base on 4h 6h 12h data analytics"
            profitIn="Profit in 2 days less"
            data={recommandedSymbols.midTermSignals}
          />
        </Grid>

        <Grid item xs={12} mt={4} id="trading-strategy">
          <VuiBox
            mb={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <VuiTypography textAlign="center" color="white" variant="h4" fontWeight="bold">
              Trading Strategy Flow Diagram
            </VuiTypography>
            <VuiTypography color="text" variant="body2" fontWeight="regular" textAlign="center">
              Visual representation of our AI trading decision process
            </VuiTypography>
          </VuiBox>
          <Card
            sx={{
              backgroundColor: "#0C1E4E",
              padding: 2,
              boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
            }}
          >
            <VuiBox sx={{ width: "100%", height: 800 }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                proOptions={{ hideAttribution: true }}
                onlyRenderVisibleElements
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={true}
                edgesUpdatable={false}
                minZoom={0.5}
                maxZoom={2}
                defaultZoom={0.8}
                fitView
                snapToGrid
                snapGrid={[10, 10]}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
              >
                <Background color="#304878" gap={16} size={1} />
                <Controls position="bottom-right" showInteractive={false} />
              </ReactFlow>
              <VuiBox
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  padding: "8px",
                  borderRadius: "4px",
                  zIndex: 5,
                }}
              >
                <VuiBox display="flex" alignItems="center" gap={1}>
                  <VuiBox
                    sx={{ width: 12, height: 12, backgroundColor: "#1acd7c", borderRadius: "50%" }}
                  />
                  <VuiTypography variant="caption" color="white">
                    Buy Signal
                  </VuiTypography>
                </VuiBox>
                <VuiBox display="flex" alignItems="center" gap={1}>
                  <VuiBox
                    sx={{ width: 12, height: 12, backgroundColor: "#f53535", borderRadius: "50%" }}
                  />
                  <VuiTypography variant="caption" color="white">
                    Sell Signal
                  </VuiTypography>
                </VuiBox>
                <VuiBox display="flex" alignItems="center" gap={1}>
                  <VuiBox
                    sx={{ width: 12, height: 12, backgroundColor: "#FFD700", borderRadius: "50%" }}
                  />
                  <VuiTypography variant="caption" color="white">
                    Neutral
                  </VuiTypography>
                </VuiBox>
              </VuiBox>
            </VuiBox>
          </Card>
        </Grid>

        {/* About Bot Strategies */}
        <Grid mt={isMobile ? 4 : 8} item xs={12} md={12} lg={12} xl={12} id="bot-strategies">
          <VuiBox
            mb={isMobile ? 1 : 4}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <VuiTypography textAlign="center" color="white" variant="h4" fontWeight="bold">
              Bot Strategies
            </VuiTypography>
            <VuiTypography color="text" variant="body2" fontWeight="regular" textAlign="center">
              Bot combines those strategies to make trading decisions
            </VuiTypography>
          </VuiBox>
          <Card sx={{ backgroundColor: "#6927FF" }}>
            <VuiBox display="flex" flexDirection="column" height="100%">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4} xl={3} xxxl={2.4}>
                  <StrategyCard
                    image={profile1}
                    label="Base on MACD"
                    title="MACD Analysis"
                    description="Base on MACD and Signal Line to make trading decisions"
                    action={{
                      type: "internal",
                      route: undefined,
                      color: "white",
                      label: "LEARN MORE",
                    }}
                    authors={[]}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} xl={3} xxxl={2.4}>
                  <StrategyCard
                    image={profile3}
                    label="Base on EMA"
                    title="EMA Crossover Analysis"
                    description="Base on EMA Crossover to make trading decisions"
                    action={{
                      type: "internal",
                      route: undefined,
                      color: "white",
                      label: "LEARN MORE",
                    }}
                    authors={
                      [
                        // { image: team4, name: "Peterson" },
                        // { image: team3, name: "Nick Daniel" },
                        // { image: team2, name: "Ryan Milly" },
                        // { image: team1, name: "Elena Morison" },
                      ]
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} xl={3} xxxl={2.4}>
                  <StrategyCard
                    image={profile3}
                    label="Base on StochRSI"
                    title="StochRSI Analysis"
                    description="Base on StochRSI to make trading decisions"
                    action={{
                      type: "internal",
                      route: undefined,
                      color: "white",
                      label: "LEARN MORE",
                    }}
                    authors={
                      [
                        // { image: team4, name: "Peterson" },
                        // { image: team3, name: "Nick Daniel" },
                        // { image: team2, name: "Ryan Milly" },
                        // { image: team1, name: "Elena Morison" },
                      ]
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} xl={3} xxxl={2.4}>
                  <StrategyCard
                    image={profile2}
                    label="Base on Bollinger Bands"
                    title="Bollinger Bands Analysis"
                    description="Base on Bollinger Bands to make trading decisions"
                    action={{
                      type: "internal",
                      route: undefined,
                      color: "white",
                      label: "LEARN MORE",
                    }}
                    authors={[]}
                  />
                </Grid>
              </Grid>
            </VuiBox>
          </Card>
        </Grid>
        {/* About Bot Features */}
        <Grid item xs={12} md={12} lg={12} xl={12} mt={isMobile ? 4 : 12}>
          <VuiBox
            mb={isMobile ? 1 : 3}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <VuiTypography textAlign="center" color="white" variant="h4" fontWeight="bold">
              Bot Features
            </VuiTypography>
            <VuiTypography color="text" variant="body2" fontWeight="regular" textAlign="center">
              Bot combines those strategies to make trading decisions
            </VuiTypography>
          </VuiBox>

          <Grid
            container
            spacing={3}
            justifyContent="space-between"
            display="flex"
            flexDirection="row"
          >
            <Grid item xs={12} md={8} xl={6}>
              <Card sx={{ backgroundColor: "#35125c" }}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    Unlimited Trading Frame
                  </VuiTypography>
                  <VuiTypography color="text" variant="body2" fontWeight="regular">
                    Support unlimited trading frame, from 15m, 30m, ... to 1D, 3D, 1W
                  </VuiTypography>
                </VuiBox>
              </Card>
              <VuiBox mt={2} />
              <Card sx={{ backgroundColor: "#35125c" }}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    Future Trading
                  </VuiTypography>
                  <VuiTypography color="text" variant="body2" fontWeight="regular">
                    Help traders navigate Futures Trading with precision, automation, and
                    trend-based strategies
                  </VuiTypography>
                </VuiBox>
              </Card>
              <VuiBox mt={2} />
              <Card sx={{ backgroundColor: "#35125c" }}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    Spot - Accumulative Trading
                  </VuiTypography>
                  <VuiTypography color="text" variant="body2" fontWeight="regular">
                    Designed for traders who want to accumulate assets over time and hold them for
                    the long term
                  </VuiTypography>
                </VuiBox>
              </Card>
              <VuiBox mt={2} />

              <Card sx={{ backgroundColor: "#35125c" }}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    Long Term Signals
                  </VuiTypography>
                  <VuiTypography color="text" variant="body2" fontWeight="regular">
                    AI-powered long-term signals to help traders make informed buy and sell
                    decisions based on deep market analysis
                  </VuiTypography>
                </VuiBox>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              xl={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <VuiBox
                component="img"
                style={{ maxWidth: "80%", width: isMobile ? "240px" : "420px" }}
                src={botFeatures}
                alt="Bot Features"
              />
            </Grid>
          </Grid>
        </Grid>
        {/* If you cant hold, you cant be rich If you cant DCA, you cant be win */}
        <Grid item xs={12} md={12} lg={12} xl={12} mt={isMobile ? 4 : 12}>
          <VuiBox mb={isMobile ? 1 : 3} display="flex" justifyContent="center" alignItems="center">
            <VuiTypography
              textAlign="center"
              color="white"
              variant={isMobile ? "h4" : "h3"}
              fontWeight="bold"
            >
              If you cant <span style={{ color: "#FFD700" }}>HOLD</span>, you cant be{" "}
              <span style={{ color: "#FFD700" }}>RICH</span>. If you cant{" "}
              <span style={{ color: "#982176" }}>DCA</span>, you cant{" "}
              <span style={{ color: "#982176" }}>WIN</span>.
            </VuiTypography>
          </VuiBox>
        </Grid>

        {/* Cons and Pros */}
        <Grid item xs={12} md={12} lg={12} xl={12} mt={isMobile ? 4 : 12}>
          <VuiBox mb={isMobile ? 1 : 3} display="flex" justifyContent="center" alignItems="center">
            <VuiTypography textAlign="center" color="white" variant="h4" fontWeight="bold">
              Pros and Cons
            </VuiTypography>
          </VuiBox>
          <Card sx={{ backgroundColor: "#3f1b9c" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} xl={6}>
                <VuiBox
                  mb={isMobile ? 0 : 2}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    Props
                  </VuiTypography>
                </VuiBox>
                <Card sx={{ backgroundColor: "#110838" }}>
                  <VuiBox>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                      ✅ Low-Cost Entry
                    </VuiTypography>
                    <VuiTypography color="text" variant="body2" fontWeight="regular">
                      Starts trading with as little as $0.3 per trade, making it accessible to all
                      traders.
                    </VuiTypography>
                  </VuiBox>
                </Card>
                <VuiBox mt={isMobile ? 0.5 : 1} />
                <Card sx={{ backgroundColor: "#35125c" }}>
                  <VuiBox>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                      ✅ Trend-Based Trading (Not Grid-Based)
                    </VuiTypography>
                    <VuiTypography color="text" variant="body2" fontWeight="regular">
                      Unlike traditional grid bots, this bot follows token trendlines using
                      Bollinger Bands for smarter trade execution.
                    </VuiTypography>
                  </VuiBox>
                </Card>
                <VuiBox mt={isMobile ? 0.5 : 1} />
                <Card sx={{ backgroundColor: "#110838" }}>
                  <VuiBox>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                      ✅ Smart Entry Strategy
                    </VuiTypography>
                    <VuiTypography color="text" variant="body2" fontWeight="regular">
                      Combines EMA, MACD Histogram, and Bollinger Bands to identify optimal trade
                      entry points and avoid bad signals.
                    </VuiTypography>
                  </VuiBox>
                </Card>
                <VuiBox mt={isMobile ? 0.5 : 1} />
                <Card variant="elevation" sx={{ backgroundColor: "#35125c" }}>
                  <VuiBox>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                      ✅ Avoids Fake Pumps & Dumps
                    </VuiTypography>
                    <VuiTypography color="text" variant="body2" fontWeight="regular">
                      Uses EMA crosslines and MACD Histogram averages to filter out false market
                      movements and prevent poor trades.
                    </VuiTypography>
                  </VuiBox>
                </Card>
                <VuiBox mt={isMobile ? 0.5 : 1} />
                <Card sx={{ backgroundColor: "#110838" }}>
                  <VuiBox>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                      ✅ Dynamic DCA Strategy
                    </VuiTypography>
                    <VuiTypography color="text" variant="body2" fontWeight="regular">
                      Allows configurable Dollar-Cost Averaging (DCA) within a single MACD Histogram
                      wave, adjusting to market conditions.
                    </VuiTypography>
                  </VuiBox>
                </Card>
                <VuiBox mt={isMobile ? 0.5 : 1} />
                <Card sx={{ backgroundColor: "#35125c" }}>
                  <VuiBox>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                      ✅ AI-Powered Long-Term Signals
                    </VuiTypography>
                    <VuiTypography color="text" variant="body2" fontWeight="regular">
                      Recommends strategic buy and sell signals based on AI analysis, assisting
                      traders with long-term decision-making.
                    </VuiTypography>
                  </VuiBox>
                </Card>
                <VuiBox mt={isMobile ? 0.5 : 1} />
                <Card sx={{ backgroundColor: "#110838" }}>
                  <VuiBox>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                      ✅ Advanced RSI Customization
                    </VuiTypography>
                    <VuiTypography color="text" variant="body2" fontWeight="regular">
                      Fine-tune RSI settings to detect ideal market conditions for entering and
                      exiting trades.
                    </VuiTypography>
                  </VuiBox>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} xl={6}>
                <VuiBox
                  mb={isMobile ? 0 : 2}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    Cons
                  </VuiTypography>
                </VuiBox>
                <Card sx={{ backgroundColor: "#35125c" }}>
                  <VuiBox>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                      ❌ Requires Market Experience
                    </VuiTypography>
                    <VuiTypography color="text" variant="body2" fontWeight="regular">
                      Traders must correctly identify long-term up or down trends when setting up
                      strategies.
                    </VuiTypography>
                  </VuiBox>
                </Card>
                <VuiBox mt={isMobile ? 0.5 : 1} />
                <Card sx={{ backgroundColor: "#110838" }}>
                  <VuiBox>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                      ❌ Struggles in Continuous Pumps/Dumps
                    </VuiTypography>
                    <VuiTypography color="text" variant="body2" fontWeight="regular">
                      If a token experiences sustained, extreme price movement without recovery, the
                      bot may fail.
                    </VuiTypography>
                  </VuiBox>
                </Card>
                <VuiBox mt={isMobile ? 0.5 : 1} />
                <Card sx={{ backgroundColor: "#35125c" }}>
                  <VuiBox>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                      ❌ DCA Strategy Can Take Time
                    </VuiTypography>
                    <VuiTypography color="text" variant="body2" fontWeight="regular">
                      Multiple DCA cycles may be required before a trade turns profitable,
                      especially in sideways markets.
                    </VuiTypography>
                  </VuiBox>
                </Card>
                <VuiBox mt={isMobile ? 0.5 : 1} />
                <Card sx={{ backgroundColor: "#110838" }}>
                  <VuiBox>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                      ❌ Misses Human Intuition
                    </VuiTypography>
                    <VuiTypography color="text" variant="body2" fontWeight="regular">
                      The bot follows strict indicator-based logic and may not recognize unique
                      market opportunities that experienced traders can see.
                    </VuiTypography>
                  </VuiBox>
                </Card>
                <VuiBox mt={isMobile ? 0.5 : 1} />
                <Card sx={{ backgroundColor: "#35125c" }}>
                  <VuiBox>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                      ❌ Choppy Markets Reduce Accuracy
                    </VuiTypography>
                    <VuiTypography color="text" variant="body2" fontWeight="regular">
                      If a token is moving sideways without a clear trend, the bot may struggle to
                      execute profitable trades.
                    </VuiTypography>
                  </VuiBox>
                </Card>
                <VuiBox mt={isMobile ? 0.5 : 1} />
                <Card sx={{ backgroundColor: "#110838" }}>
                  <VuiBox>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                      ❌ Indicator Lag & False Signals
                    </VuiTypography>
                    <VuiTypography color="text" variant="body2" fontWeight="regular">
                      MACD, EMA, and RSI are lagging indicators, which may cause delayed entries or
                      false reversals.
                    </VuiTypography>
                  </VuiBox>
                </Card>
                <VuiBox mt={isMobile ? 0.5 : 1} />
                <Card sx={{ backgroundColor: "#35125c" }}>
                  <VuiBox>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                      ❌ Slippage & Liquidity Risks
                    </VuiTypography>
                    <VuiTypography color="text" variant="body2" fontWeight="regular">
                      Low-liquidity tokens can lead to price slippage, affecting trade execution and
                      profitability.
                    </VuiTypography>
                  </VuiBox>
                </Card>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        {/* About Bot Pricing */}
        <Grid item xs={12} md={12} lg={12} xl={12} mt={isMobile ? 4 : 12}>
          <VuiBox
            mb={isMobile ? 1 : 3}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <VuiBox>
              <VuiTypography textAlign="center" color="white" variant="h4" fontWeight="bold">
                Bot Pricing
              </VuiTypography>
            </VuiBox>
            <VuiBox>
              <VuiTypography
                sx={({ breakpoints }) => ({
                  color: "#69247C",
                  textAlign: "center",
                  [breakpoints.up("sm")]: {
                    fontSize: isMobile ? "20px" : "24px",
                  },
                })}
                variant="h4"
              >
                We offer a free trial for 30 days, so you can try it out before you buy.
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </Grid>
        {/* How to use the bot */}
        <Grid item xs={12} md={12} lg={12} xl={12} mt={isMobile ? 4 : 12}>
          <VuiBox
            mb={isMobile ? 1 : 3}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <VuiTypography textAlign="center" color="white" variant="h4" fontWeight="bold">
              How to use SA Bot
            </VuiTypography>
            <VuiTypography color="text" variant="body2" fontWeight="regular" textAlign="center">
              The following steps will guide you through the process of using SA Bot.
            </VuiTypography>
          </VuiBox>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3} xl={3}>
              <Card sx={{ backgroundColor: "#7928ca" }}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    Step 1: Join SA Bot Platform
                  </VuiTypography>
                  <VuiTypography color="text" variant="body2" fontWeight="regular">
                    Sign-Up and Sign-In to the SA Bot Dashboard
                  </VuiTypography>
                </VuiBox>
              </Card>
            </Grid>
            <Grid item xs={6} md={3} xl={3}>
              <Card sx={{ backgroundColor: "#7928ca" }}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    Step 2: Setup Binance API Keys
                  </VuiTypography>
                  <VuiTypography color="text" variant="body2" fontWeight="regular">
                    Setup Binance API Keys in the SA Bot Dashboard
                  </VuiTypography>
                </VuiBox>
              </Card>
            </Grid>
            <Grid item xs={6} md={3} xl={3}>
              <Card sx={{ backgroundColor: "#7928ca" }}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    Step 3: Setup Trading Strategy
                  </VuiTypography>
                  <VuiTypography color="text" variant="body2" fontWeight="regular">
                    Setup Trading Strategy in the SA Bot Dashboard
                  </VuiTypography>
                </VuiBox>
              </Card>
            </Grid>
            <Grid item xs={6} md={3} xl={3}>
              <Card sx={{ backgroundColor: "#7928ca" }}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    Step 4: Monitor Trading Results
                  </VuiTypography>
                  <VuiTypography color="text" variant="body2" fontWeight="regular">
                    Monitor Trading Results in the SA Bot Dashboard
                  </VuiTypography>
                </VuiBox>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        {/* About Bot FAQ */}
        <Grid item xs={12} md={12} lg={12} xl={12} mt={isMobile ? 4 : 12}>
          <VuiBox
            mb={isMobile ? 1 : 3}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <VuiTypography textAlign="center" color="white" variant="h4" fontWeight="bold">
              Bot FAQs
            </VuiTypography>
            <VuiTypography color="text" variant="body2" fontWeight="regular">
              Some questions you might have about the bot
            </VuiTypography>
          </VuiBox>
          <Grid
            container
            spacing={3}
            justifyContent="space-between"
            display="flex"
            flexDirection="row"
          >
            <Grid
              item
              xs={12}
              md={12}
              xl={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <VuiBox
                component="img"
                style={{ maxWidth: "80%", width: isMobile ? "240px" : "420px" }}
                src={botFAQ}
                alt="Bot FAQ"
              />
            </Grid>
            <Grid item xs={12} md={12} xl={6}>
              <Card sx={{ backgroundColor: "#35125c" }}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    1. How does this trading bot work?
                  </VuiTypography>
                  <VuiTypography color="text" variant="body2" fontWeight="regular">
                    The bot follows token trendlines using Bollinger Bands, EMA, MACD Histogram, and
                    RSI to determine safe entry points. It avoids false signals and dynamically
                    adjusts trades using a Dollar-Cost Averaging (DCA) strategy within a MACD wave.
                    AI-powered signals also help with long-term buy/sell decisions.
                  </VuiTypography>
                </VuiBox>
              </Card>
              <VuiBox mt={2} />
              <Card sx={{ backgroundColor: "#3f1b9c" }}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    2. What makes this bot different from grid trading bots?
                  </VuiTypography>
                  <VuiTypography color="text" variant="body2" fontWeight="regular">
                    Unlike grid bots that place trades at fixed price intervals, this bot follows
                    the market trend and only trades when indicators confirm a strong signal. This
                    helps reduce unnecessary trades and increases efficiency.
                  </VuiTypography>
                </VuiBox>
              </Card>
              <VuiBox mt={2} />
              <Card sx={{ backgroundColor: "#35125c" }}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    3. What are the minimum funds required to start trading?
                  </VuiTypography>
                  <VuiTypography color="text" variant="body2" fontWeight="regular">
                    You can start trading with as little as $0.3 per trade, making it accessible for
                    all types of traders. However, having more capital allows for better DCA and
                    risk management.
                  </VuiTypography>
                </VuiBox>
              </Card>
              <VuiBox mt={2} />
              <Card sx={{ backgroundColor: "#3f1b9c" }}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    4. Do I need to set up Binance API Keys?
                  </VuiTypography>
                  <VuiTypography color="text" variant="body2" fontWeight="regular">
                    Yes, you need to generate and connect your Binance API Keys to allow the bot to
                    execute trades on your behalf. The API keys should have Read and Futures Order
                    permissions but must NOT have withdrawal permissions for security reasons.
                  </VuiTypography>
                </VuiBox>
              </Card>
              <VuiBox mt={2} />
              <Card sx={{ backgroundColor: "#35125c" }}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    5. Is my Binance account safe when using the bot?
                  </VuiTypography>
                  <VuiTypography color="text" variant="body2" fontWeight="regular">
                    Yes, the bot only requires Read and Futures Order permissions, meaning it cannot
                    withdraw funds from your Binance account. Additionally, Binance API Key security
                    features allow you to restrict access by IP address for added protection. Your
                    API keys also encrypted end-to-end in our database.
                  </VuiTypography>
                </VuiBox>
              </Card>
              {/* <Card sx={{ backgroundColor: "#982176" }}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    6. Can I customize the bot’s trading strategy?
                  </VuiTypography>
                  <VuiTypography color="text" variant="body2" fontWeight="regular">
                    Yes, you can configure settings such as trading frame, DCA trade limits, max
                    budget, RSI thresholds, auto take profit, and auto stop loss to match your
                    trading style.
                  </VuiTypography>
                </VuiBox>
              </Card> */}
            </Grid>
          </Grid>
        </Grid>
        {/* About Bot Contact */}
        <Grid item xs={12} md={12} lg={12} xl={12} mt={isMobile ? 4 : 12} mb={isMobile ? 4 : 12}>
          <VuiBox
            mb={isMobile ? 1 : 3}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <VuiTypography textAlign="center" color="white" variant="h4" fontWeight="bold">
              Contact Us
            </VuiTypography>
            <VuiTypography color="text" variant="body2" fontWeight="regular" textAlign="center">
              If you have any questions or feedback, please contact us.
            </VuiTypography>
          </VuiBox>
          <Card sx={{ backgroundColor: "#35125c" }}>
            <Grid container spacing={0}>
              <Grid item xs={12} md={12} xl={4}>
                <VuiButton
                  sx={{ width: "100%" }}
                  variant="text"
                  onClick={() => window.open("mailto:tuannguyehoangit@gmail.com", "_blank")}
                >
                  <Card sx={{ backgroundColor: "#35125c", width: "100%" }}>
                    <VuiBox display="flex" flexDirection="row" alignItems="center">
                      <Email
                        sx={({ breakpoints }) => ({
                          width: isMobile ? 16 : 32,
                          height: isMobile ? 16 : 32,
                          marginRight: isMobile ? 1 : 2,
                          color: "white",
                          [breakpoints.down("md")]: {
                            width: 24,
                            height: 24,
                          },
                        })}
                      />
                      <VuiBox display="flex" flexDirection="column" alignItems="flex-start" ml={2}>
                        <VuiTypography color="white" variant="lg" fontWeight="bold">
                          Email
                        </VuiTypography>
                        <VuiTypography color="text" variant="body2" fontWeight="regular">
                          tuannguyehoangit@gmail.com
                        </VuiTypography>
                      </VuiBox>
                    </VuiBox>
                  </Card>
                </VuiButton>
              </Grid>
              <Grid item xs={12} md={12} xl={4}>
                <VuiButton
                  sx={{ width: "100%" }}
                  variant="text"
                  onClick={() => window.open("https://t.me/sabot_official", "_blank")}
                >
                  <Card sx={{ backgroundColor: "#35125c", width: "100%" }}>
                    <VuiBox display="flex" flexDirection="row" alignItems="center">
                      <Telegram
                        sx={({ breakpoints }) => ({
                          width: isMobile ? 16 : 32,
                          height: isMobile ? 16 : 32,
                          marginRight: isMobile ? 1 : 2,
                          color: "white",
                          [breakpoints.down("md")]: {
                            width: 24,
                            height: 24,
                            marginRight: 1,
                            color: "white",
                          },
                        })}
                      />
                      <VuiBox display="flex" flexDirection="column" alignItems="flex-start" ml={2}>
                        <VuiTypography color="white" variant="lg" fontWeight="bold">
                          Telegram
                        </VuiTypography>
                        <VuiTypography color="text" variant="body2" fontWeight="regular">
                          SA Bot Official
                        </VuiTypography>
                      </VuiBox>
                    </VuiBox>
                  </Card>
                </VuiButton>
              </Grid>
              <Grid item xs={12} md={12} xl={4}>
                <VuiButton
                  sx={{ width: "100%" }}
                  onClick={() =>
                    window.open("https://www.binance.com/vi/square/profile/arkham-teller", "_blank")
                  }
                  variant="text"
                >
                  <Card sx={{ backgroundColor: "#35125c", width: "100%" }}>
                    <VuiBox display="flex" flexDirection="row" alignItems="center">
                      <VuiBox
                        component="img"
                        src={Binance}
                        sx={({ breakpoints }) => ({
                          width: isMobile ? 16 : 32,
                          height: isMobile ? 16 : 32,
                          marginRight: isMobile ? 1 : 2,
                          [breakpoints.down("md")]: {
                            width: 24,
                            height: 24,
                          },
                        })}
                      />
                      <VuiBox display="flex" flexDirection="column" alignItems="flex-start" ml={2}>
                        <VuiTypography color="white" variant="lg" fontWeight="bold">
                          Binance Square
                        </VuiTypography>
                        <VuiTypography color="text" variant="body2" fontWeight="regular">
                          Binance Square Official
                        </VuiTypography>
                      </VuiBox>
                    </VuiBox>
                  </Card>
                </VuiButton>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </VuiBox>
      <Footer />
    </VuiBox>
  );
}

export default Landing;
