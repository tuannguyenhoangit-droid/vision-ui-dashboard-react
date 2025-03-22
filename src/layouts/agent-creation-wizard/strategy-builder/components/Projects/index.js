import { useMemo, useState } from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { BsCheckCircleFill, BsPencilSquare } from "react-icons/bs";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import Lottie from "lottie-react";
import Table from "examples/Tables/Table";
import { useDispatch, useSelector } from "react-redux";
import VuiSwitch from "components/VuiSwitch";
import { timeDifference } from "utils";
import { FaTrashAlt } from "react-icons/fa";
import colors from "assets/theme/base/colors";
import VuiButton from "components/VuiButton";
import { isMobile } from "react-device-detect";
import { createSymbolConfig, getSymbolConfig, quickChangeFrame } from "services/api";
import { setMessage } from "app-redux/futures/messageSlice";
import { setSymbolConfigData } from "app-redux/futures/symbolConfigSlice";
import { Chip, Menu, MenuItem } from "@mui/material";
import { AddCircle, TrendingUp } from "@mui/icons-material";
import lottieLiveSignal from "assets/jsons/live-signal.json";
const TradingFrameList = [
  {
    label: "5m:15m",
    value: "5m",
    depends: ["15m"],
  },
  {
    label: "15m:30m",
    value: "15m",
    depends: ["30m"],
  },
  {
    label: "15m:1h",
    value: "15m",
    depends: ["1h"],
  },
  {
    label: "15m:2h",
    value: "15m",
    depends: ["2h"],
  },
  {
    label: "30m:1h",
    value: "30m",
    depends: ["1h"],
  },
  {
    label: "30m:2h",
    value: "30m",
    depends: ["2h"],
  },
  {
    label: "30m:4h",
    value: "30m",
    depends: ["4h"],
  },
  {
    label: "1h:2h",
    value: "1h",
    depends: ["2h"],
  },
  {
    label: "1h:4h",
    value: "1h",
    depends: ["4h"],
  },
  {
    label: "2h:6h",
    value: "2h",
    depends: ["6h"],
  },
  {
    label: "4h:12h",
    value: "4h",
    depends: ["12h"],
  },
  {
    label: "4h:1d",
    value: "4h",
    depends: ["1d"],
  },
  {
    label: "12h:3d",
    value: "12h",
    depends: ["3d"],
  },
  {
    label: "1d:1w",
    value: "1d",
    depends: ["1w"],
  },
];

const TradingFrameMenu = ({ open, onClose, handleQuickChangeFrame }) => {
  return (
    <Menu
      anchorEl={open}
      open={Boolean(open)}
      onClose={onClose}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <VuiBox p={1}>
        <VuiBox ml={1} mb={1}>
          <VuiTypography variant="button" color="white" fontWeight="bold">
            Trading Frame
          </VuiTypography>
        </VuiBox>
        {TradingFrameList.map((frame) => (
          <MenuItem key={frame.value}>
            <VuiBox display="flex" alignItems="center">
              <Chip
                clickable
                onClick={() => handleQuickChangeFrame(frame.value, frame.depends)}
                label={["Frame", frame.label].join(": ")}
                color="warning"
                size={isMobile ? "small" : "medium"}
              />
            </VuiBox>
          </MenuItem>
        ))}
      </VuiBox>
    </Menu>
  );
};

const SymbolConfigItem = ({
  row,
  onEditItem = () => null,
  onEditRSIItem = () => null,
  onDeleteItem = () => null,
  onAutoTakeProfit = () => null,
  currentPosition = undefined,
}) => {
  const onEdit = () => onEditItem(row);
  const onDelete = () => onDeleteItem(row);
  const onEditRSI = () => onEditRSIItem(row);
  const onAutoTakeProfitChange = (row, status) => onAutoTakeProfit(row, status);

  return {
    "": (
      <Lottie
        style={{
          width: 16,
          height: 16,
        }}
        animationData={lottieLiveSignal}
        loop={true}
      />
    ),
    symbol: (
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
    ),
    side: (
      <VuiTypography
        variant="button"
        color={row.side === "BOTH" ? "warning" : row.side === "BUY" ? "success" : "error"}
        fontWeight="bold"
      >
        {row.side === "BOTH" && row.autoTradeStatus
          ? [row.side, row.autoTradeSide].join("-")
          : row.side}
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
    // "rsi frame": (
    //   <VuiBox display="flex" flexDirection="row" gap={0.5}>
    //     {row?.rsiRequireValues?.length > 0 ? (
    //       <VuiBox display="flex" flexDirection="column">
    //         <VuiBox>
    //           {row.rsiStrategy["BUY"] ? (
    //             <VuiTypography variant="caption" color="white">
    //               {["B", row.rsiStrategy["BUY"]].join(": ")}
    //             </VuiTypography>
    //           ) : (
    //             row.rsiRequireValues
    //               .filter((rsi) => rsi.side === "BUY" || rsi.side == undefined)
    //               .map((rsi) => (
    //                 <VuiTypography variant="caption" color="white">
    //                   {["[", rsi.frame, ":", rsi.value, "]"]}
    //                 </VuiTypography>
    //               ))
    //           )}
    //         </VuiBox>
    //         <VuiBox>
    //           {row.rsiStrategy["SELL"] ? (
    //             <VuiTypography variant="caption" color="white">
    //               {["S", row.rsiStrategy["SELL"]].join(": ")}
    //             </VuiTypography>
    //           ) : (
    //             row.rsiRequireValues
    //               .filter((rsi) => rsi.side === "SELL")
    //               .map((rsi) => (
    //                 <VuiTypography variant="caption" color="white">
    //                   {["[", rsi.frame, ":", rsi.value, "]"]}
    //                 </VuiTypography>
    //               ))
    //           )}
    //         </VuiBox>
    //       </VuiBox>
    //     ) : (
    //       <VuiTypography variant="caption" color="white">
    //         -
    //       </VuiTypography>
    //     )}
    //     <BsPencilSquare onClick={onEditRSI} color={colors.warning.main} cursor="pointer" />
    //   </VuiBox>
    // ),
    "auto take profit": (
      <VuiTypography variant="caption" color="white">
        <VuiSwitch
          color="success"
          checked={row.autoTakeProfit || false}
          onChange={(_, status) => onAutoTakeProfitChange(row, status)}
        />
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
        <BsPencilSquare onClick={onEdit} color={colors.warning.main} cursor="pointer" />
        <VuiBox ml={1}>
          <FaTrashAlt onClick={onDelete} color={colors.error.focus} cursor="pointer" />
        </VuiBox>
      </VuiBox>
    ),
  };
};

const SymbolConfigItemMobile = ({
  row,
  position,
  onAutoTakeProfitChange,
  onEditItem,
  onDeleteItem,
}) => {
  const currentPosition = position.find((e) => e.symbol.includes(row.symbol));
  const onEdit = () => onEditItem(row);
  const onDelete = () => onDeleteItem(row);
  return (
    <VuiBox
      key={row.symbol}
      sx={{
        marginTop: 1,
        marginBottom: 1,
      }}
    >
      <Card sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
        <VuiBox>
          <VuiBox width="100%" display="flex" flexDirection="row" justifyContent="space-between">
            <VuiBox display="flex" flexDirection="row" alignItems="center">
              <Lottie
                style={{
                  width: 24,
                  height: 24,
                }}
                animationData={lottieLiveSignal}
                loop={true}
              />
              <VuiTypography
                color={
                  currentPosition
                    ? parseFloat(currentPosition?.unRealizedProfit) > 0
                      ? "success"
                      : "error"
                    : "white"
                }
                variant="h6"
              >
                {row.symbol}
              </VuiTypography>
            </VuiBox>
            <Chip
              color={row.side === "BOTH" ? "warning" : row.side === "BUY" ? "success" : "error"}
              label={
                <VuiTypography variant="caption" color="white">
                  {row.side === "BOTH" && row.autoTradeStatus
                    ? [row.side, row.autoTradeSide].join("-")
                    : row.side}
                </VuiTypography>
              }
              size="small"
            />
          </VuiBox>

          <VuiBox
            mt={1}
            width="100%"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <VuiTypography variant="caption" color="white">
              Trading Frame: {row.frame}
            </VuiTypography>
            <VuiTypography variant="caption" color="white">
              R.Frames:
              {row?.buyRequireHistogram?.map?.((frame) => frame)}
            </VuiTypography>
          </VuiBox>

          <VuiBox
            mt={1}
            width="100%"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <VuiTypography variant="caption" color="white">
              Amount: {row.buyAmount}
            </VuiTypography>
            <VuiTypography variant="caption" color="white">
              Max Budget: {row.maxBudget}
            </VuiTypography>
          </VuiBox>

          <VuiBox
            width="100%"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <VuiBox>
              <VuiTypography variant="caption" color="white">
                Auto T.Profit
                <VuiSwitch
                  sx={{ marginLeft: 1 }}
                  color="success"
                  checked={row.autoTakeProfit || false}
                  onChange={(_, status) => onAutoTakeProfitChange(row, status)}
                />
              </VuiTypography>
            </VuiBox>
            <VuiTypography variant="caption" color="white">
              Optimized Entry: {row.optimizeEntry ? "Yes" : "No"}
            </VuiTypography>
          </VuiBox>

          <VuiBox
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            display="flex"
            flexDirection="row"
          >
            <VuiTypography variant="caption" color="white">
              Uptime: {timeDifference(row.createdAt)}
            </VuiTypography>
            <VuiBox
              alignItems="center"
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
            >
              <BsPencilSquare
                size={isMobile ? 16 : 20}
                onClick={onEdit}
                color={colors.warning.main}
                cursor="pointer"
              />
              <VuiBox ml={2}>
                <FaTrashAlt
                  size={isMobile ? 16 : 20}
                  onClick={onDelete}
                  color={colors.error.focus}
                  cursor="pointer"
                />
              </VuiBox>
            </VuiBox>
          </VuiBox>
        </VuiBox>
      </Card>
    </VuiBox>
  );
};

function Projects({
  onMenuClick = () => null,
  onEditItem = () => null,
  onDeleteItem = () => null,
  onEditRSIItem = () => null,
}) {
  const symbolConfig = useSelector((e) => e.symbolConfig.data);
  const position = useSelector((e) => e.positions.data);
  const dispatch = useDispatch();
  const [openTradingFrameMenu, setOpenTradingFrameMenu] = useState(false);
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
        config.rsiRequireValues,
        config.rsiStrategy,
        config.maxDCAPerWave
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
      return SymbolConfigItem({
        row,
        onEditItem,
        onDeleteItem,
        currentPosition,
        onAutoTakeProfit,
        onEditRSIItem,
      });
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
            {TradingFrameList.map((frame) => (
              <VuiBox
                ml={1}
                sx={({ breakpoints }) => ({
                  [breakpoints.down("md")]: {
                    display: "none",
                  },
                })}
              >
                <Chip
                  clickable
                  onClick={() => handleQuickChangeFrame(frame.value, frame.depends)}
                  label={frame.label}
                  color="warning"
                  size={isMobile ? "small" : "medium"}
                />
              </VuiBox>
            ))}
            <VuiBox
              ml={1}
              sx={({ breakpoints }) => ({
                [breakpoints.up("md")]: {
                  display: "none",
                },
              })}
            >
              <Chip
                clickable
                size={isMobile ? "small" : "medium"}
                onClick={(event) => setOpenTradingFrameMenu(event.currentTarget)}
                color="warning"
                label={
                  <VuiBox display="flex" alignItems="center">
                    <TrendingUp style={{ marginRight: 4, width: 20, height: 20 }} />
                    Frame
                  </VuiBox>
                }
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
        <VuiBox
          sx={({ breakpoints }) => ({
            [breakpoints.down("md")]: {
              display: "none",
            },
          })}
        >
          <Table
            columns={[
              { name: "", align: "left" },
              { name: "symbol", align: "left" },
              { name: "side", align: "left" },
              { name: "frame", align: "left" },
              { name: "amount", align: "left" },
              { name: "max budget", align: "left" },
              { name: "require frames", align: "left" },
              // { name: "rsi frame", align: "left" },
              { name: "auto take profit", align: "left" },
              { name: "optimized entry", align: "left" },
              { name: "uptime", align: "left" },
              { name: "action", align: "center" },
            ]}
            rows={renderRow}
          />
        </VuiBox>
        <VuiBox
          sx={({ breakpoints }) => ({
            display: "none",
            [breakpoints.down("md")]: {
              display: "block",
            },
          })}
        >
          {symbolConfig.map((row) => (
            <SymbolConfigItemMobile
              key={row.symbol}
              row={row}
              position={position}
              onAutoTakeProfitChange={onAutoTakeProfit}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </VuiBox>
      </VuiBox>
      <TradingFrameMenu
        open={openTradingFrameMenu}
        onClose={() => setOpenTradingFrameMenu(false)}
        handleQuickChangeFrame={handleQuickChangeFrame}
      />
    </Card>
  );
}

export default Projects;
