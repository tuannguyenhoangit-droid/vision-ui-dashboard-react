import { useMemo } from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { BsCheckCircleFill, BsPencilSquare } from "react-icons/bs";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

import Table from "examples/Tables/Table";
import { useDispatch, useSelector } from "react-redux";
import VuiSwitch from "components/VuiSwitch";
import { timeDifference } from "utils";
import { FaTrashAlt } from "react-icons/fa";
import colors from "assets/theme/base/colors";
import VuiButton from "components/VuiButton";
import { isMobile } from "react-device-detect";
import { createSymbolConfig, getSymbolConfig, quickChangeFrame } from "../../../../../services/api";
import { setMessage } from "../../../../../redux/futures/messageSlice";
import { setSymbolConfigData } from "../../../../../redux/futures/symbolConfigSlice";
import { Chip } from "@mui/material";
import { AddCircle } from "@mui/icons-material";

const SymbolConfigItem = ({
  row,
  onEditItem = () => null,
  onDeleteItem = () => null,
  onAutoTakeProfit = () => null,
  currentPosition = undefined,
}) => {
  const onEdit = () => onEditItem(row);
  const onDelete = () => onDeleteItem(row);
  const onAutoTakeProfitChange = (row, status) => onAutoTakeProfit(row, status);
  return {
    symbol: (
      <VuiBox display="flex" alignItems="center">
        {/* <AdobeXD size="20px" /> */}
        <VuiTypography
          // pl="16px"
          color={
            currentPosition
              ? parseFloat(currentPosition?.unRealizedProfit) > 0
                ? "success"
                : "error"
              : "white"
          }
          variant="button"
          fontWeight="medium"
        >
          {row.symbol}
        </VuiTypography>
      </VuiBox>
    ),
    side: (
      <VuiTypography
        variant="button"
        color={row.side === "BUY" ? "success" : "error"}
        fontWeight="bold"
      >
        {row.side}
      </VuiTypography>
    ),
    frame: (
      <VuiTypography variant="caption" color="white">
        {row.frame}
      </VuiTypography>
    ),
    amount: (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {row.buyAmount}
      </VuiTypography>
    ),
    "max budget": (
      <VuiTypography variant="caption" color="white">
        {["$", row.maxBudget].join("")}
      </VuiTypography>
    ),
    "require frames": (
      <VuiBox textAlign="left">
        {row?.buyRequireHistogram?.map?.((frame) => (
          <VuiTypography variant="caption" color="white">
            {frame}
          </VuiTypography>
        ))}
      </VuiBox>
    ),
    "rsi frame": (
      <VuiBox display="flex" flexDirection="row" gap={0.5}>
        {row?.rsiRequireValues?.length > 0 ? (
          row.rsiRequireValues.map((rsi) => (
            <VuiTypography variant="caption" color="white">
              {[rsi.frame, rsi.value].join(":")}
            </VuiTypography>
          ))
        ) : (
          <VuiTypography variant="caption" color="white">
            -
          </VuiTypography>
        )}
      </VuiBox>
    ),
    "auto take profit": (
      <VuiTypography variant="caption" color="white">
        <VuiSwitch
          color="success"
          checked={row.autoTakeProfit || false}
          onChange={(_, status) => onAutoTakeProfitChange(row, status)}
        ></VuiSwitch>
      </VuiTypography>
    ),
    "optimized entry": (
      <VuiTypography variant="caption" color="white">
        <VuiSwitch color="success" checked={row.optimizeEntry}></VuiSwitch>
      </VuiTypography>
    ),
    uptime: (
      <VuiTypography variant="caption" color="white">
        {timeDifference(row.createdAt)}
      </VuiTypography>
    ),
    action: (
      <VuiBox display="flex" alignItems="center">
        <BsPencilSquare onClick={onEdit} color="white" cursor="pointer" />
        <VuiBox ml={1}>
          <FaTrashAlt onClick={onDelete} color={colors.error.focus} cursor="pointer" />
        </VuiBox>
      </VuiBox>
    ),
  };
};

function Projects({
  onMenuClick = () => null,
  onEditItem = () => null,
  onDeleteItem = () => null,
}) {
  const symbolConfig = useSelector((e) => e.symbolConfig.data);
  const position = useSelector((e) => e.positions.data);
  const dispatch = useDispatch();

  const closeMenu = (action) => {
    onMenuClick?.(action);
  };

  const handleQuickChangeFrame = async (frame, buyRequireHistogram) => {
    quickChangeFrame(frame, buyRequireHistogram)
      .then(async ({ status }) => {
        if (status === 1) {
          dispatch(
            setMessage({
              message: "Change frame success",
              type: "success",
            })
          );
          const userSymbolConfig = await getSymbolConfig();
          dispatch(setSymbolConfigData(userSymbolConfig));
        } else {
          dispatch(
            setMessage({
              message: "Change frame error",
              type: "error",
            })
          );
        }
      })
      .catch((e) => {
        dispatch(
          setMessage({
            message: "Change frame error",
            type: "error",
          })
        );
      });
  };

  const onAutoTakeProfit = async (config, autoTakeProfit) => {
    try {
      const result = await createSymbolConfig(
        config.side,
        config.symbol,
        parseFloat(config.buyAmount),
        parseInt(config.maxBudget),
        config.frame,
        config.requireHistogramCondition,
        config.buyRequireHistogram,
        autoTakeProfit,
        config.optimizeEntry,
        parseFloat(config.optimizeEntryPercent),
        config.enableRSIStrategy,
        config.rsiRequireValues
      );
      if (result.status === 1) {
        dispatch(
          setMessage({
            message: "Change auto take profit success",
            type: "success",
          })
        );
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

  const renderRow = useMemo(() => {
    return symbolConfig.map((row) => {
      const currentPosition = position.find((e) => e.symbol.includes(row.symbol));
      return SymbolConfigItem({ row, onEditItem, onDeleteItem, currentPosition, onAutoTakeProfit });
    });
  }, [symbolConfig]);

  return (
    <Card
      sx={({ breakpoints }) => ({
        [breakpoints.down("sm")]: {
          height: "100% !important",
          padding: 1,
        },
        [breakpoints.up("sm")]: {
          height: "100% !important",
          padding: 1,
        },
        [breakpoints.up("md")]: {
          height: "100% !important",
          padding: 3,
        },
        [breakpoints.up("xl")]: {
          height: "100% !important",
          padding: 3,
        },
      })}
    >
      <VuiBox mb={2}>
        <VuiBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <VuiBox mb="auto">
            <VuiTypography color="white" variant="lg" mb="6px" gutterBottom>
              Strategies
            </VuiTypography>
            <VuiBox display="flex" alignItems="center" lineHeight={0}>
              <BsCheckCircleFill color="green" size="15px" />
              <VuiTypography variant="button" fontWeight="regular" color="text" ml="5px">
                {["Active strategies", `(${symbolConfig.length})`].join(" ")}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
          <VuiBox ml={1} display="flex" alignItems="center" flexDirection="row">
            <VuiButton
              size="small"
              variant="gradient"
              onClick={() => closeMenu("add")}
              color="info"
            >
              <AddCircle style={{ marginRight: 4 }} />
              Strategy
            </VuiButton>
          </VuiBox>
        </VuiBox>
        <VuiBox display="flex" alignItems="center" justifyContent="space-between">
          <VuiTypography variant="button" color="white" fontWeight="bold">
            Trading Frame
          </VuiTypography>
          <VuiBox display="flex" alignItems="center">
            <VuiBox ml={1}>
              <Chip
                clickable
                onClick={() => handleQuickChangeFrame("5m", ["15m"])}
                label="5m-15m"
                color="warning"
                size={isMobile ? "small" : "medium"}
              />
            </VuiBox>
            <VuiBox ml={1}>
              <Chip
                clickable
                onClick={() => handleQuickChangeFrame("15m", ["30m"])}
                color="warning"
                label="15m-30m"
                size={isMobile ? "small" : "medium"}
              />
            </VuiBox>
            <VuiBox ml={1}>
              <Chip
                clickable
                onClick={() => handleQuickChangeFrame("30m", ["1h"])}
                color="warning"
                label="30m-1h"
                size={isMobile ? "small" : "medium"}
              />
            </VuiBox>
            <VuiBox ml={1}>
              <Chip
                clickable
                onClick={() => handleQuickChangeFrame("1h", ["2h"])}
                color="warning"
                label="1h-2h"
                size={isMobile ? "small" : "medium"}
              />
            </VuiBox>
            <VuiBox ml={1}>
              <Chip
                clickable
                onClick={() => handleQuickChangeFrame("2h", ["4h"])}
                color="warning"
                label="2h-4h"
                size={isMobile ? "small" : "medium"}
              />
            </VuiBox>
            <VuiBox ml={1}>
              <Chip
                clickable
                onClick={() => handleQuickChangeFrame("4h", ["12h"])}
                color="warning"
                label="4h-12h"
                size={isMobile ? "small" : "medium"}
              />
            </VuiBox>
            <VuiBox ml={1}>
              <Chip
                clickable
                onClick={() => handleQuickChangeFrame("12h", ["1d"])}
                color="warning"
                label="12h-1d"
                size={isMobile ? "small" : "medium"}
              />
            </VuiBox>
          </VuiBox>
        </VuiBox>
      </VuiBox>
      <VuiBox
        sx={{
          "& th": {
            borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
              `${borderWidth[1]} solid ${grey[700]}`,
          },
          "& .MuiTableRow-root:not(:last-child)": {
            "& td": {
              borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                `${borderWidth[1]} solid ${grey[700]}`,
            },
          },
        }}
      >
        <Table
          columns={[
            { name: "symbol", align: "left" },
            { name: "side", align: "left" },
            { name: "frame", align: "left" },
            { name: "amount", align: "left" },
            { name: "max budget", align: "left" },
            { name: "require frames", align: "left" },
            { name: "rsi frame", align: "left" },
            { name: "auto take profit", align: "left" },
            { name: "optimized entry", align: "left" },
            { name: "uptime", align: "left" },
            { name: "action", align: "center" },
          ]}
          rows={renderRow}
        />
      </VuiBox>
    </Card>
  );
}

export default Projects;
