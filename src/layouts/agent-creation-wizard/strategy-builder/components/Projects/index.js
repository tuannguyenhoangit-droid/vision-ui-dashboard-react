/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useMemo, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { BsCheckCircleFill, BsPencilSquare } from "react-icons/bs";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard Materail-UI example components
import Table from "examples/Tables/Table";
import { useDispatch, useSelector } from "react-redux";
import VuiSwitch from "components/VuiSwitch";
import { timeDifference } from "utils";
import { FaTrashAlt } from "react-icons/fa";
import colors from "assets/theme/base/colors";
import VuiButton from "components/VuiButton";
import { isMobile } from "react-device-detect";
import { getSymbolConfig, quickChangeFrame } from "../../../../../services/api";
import { setMessage } from "../../../../../redux/futures/messageSlice";
import { setSymbolConfigData } from "../../../../../redux/futures/symbolConfigSlice";
import { Chip } from "@mui/material";

const SymbolConfigItem = ({ row, onEditItem = () => null, onDeleteItem = () => null }) => {
  const onEdit = () => onEditItem(row);
  const onDelete = () => onDeleteItem(row);
  return {
    symbol: (
      <VuiBox display="flex" alignItems="center">
        {/* <AdobeXD size="20px" /> */}
        <VuiTypography
          // pl="16px"
          color="white"
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
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {row.frame}
      </VuiTypography>
    ),
    amount: (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {row.buyAmount}
      </VuiTypography>
    ),
    "max budget": (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {["$", row.maxBudget].join("")}
      </VuiTypography>
    ),
    "require frames": (
      <VuiBox width="8rem" textAlign="left">
        {row?.buyRequireHistogram?.map?.((frame) => (
          <VuiTypography variant="button" color="white" fontWeight="bold">
            {frame}
          </VuiTypography>
        ))}
      </VuiBox>
    ),
    "auto take profit": (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        <VuiSwitch color="success" checked={row.autoTakeProfit || false}></VuiSwitch>
      </VuiTypography>
    ),
    "optimized entry": (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        <VuiSwitch color="success" checked={row.optimizeEntry}></VuiSwitch>
      </VuiTypography>
    ),
    uptime: (
      <VuiTypography variant="button" color="white" fontWeight="medium">
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
  const [menu, setMenu] = useState(null);
  const dispatch = useDispatch();

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = (action) => {
    setMenu(null);
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

  const renderRow = useMemo(() => {
    return symbolConfig.map((row) => SymbolConfigItem({ row, onEditItem, onDeleteItem }));
  }, [symbolConfig]);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={() => closeMenu("add")}>Add Strategy</MenuItem>
    </Menu>
  );

  return (
    <Card
      sx={{
        height: "100% !important",
      }}
    >
      <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="32px">
        {isMobile ? null : (
          <VuiBox mb="auto">
            <VuiTypography color="white" variant="lg" mb="6px" gutterBottom>
              Accumulation Strategies
            </VuiTypography>
            <VuiBox display="flex" alignItems="center" lineHeight={0}>
              <BsCheckCircleFill color="green" size="15px" />
              <VuiTypography variant="button" fontWeight="regular" color="text" ml="5px">
                Active strategies
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        )}
        <VuiBox display="flex" alignItems="center" justifyContent="flex-end">
          <VuiBox display="flex" alignItems="center">
            <Chip
              clickable
              onClick={() => handleQuickChangeFrame("3m", ["5m"])}
              color="warning"
              label="3m-5m"
            />
            <VuiBox ml={1}>
              <Chip
                clickable
                onClick={() => handleQuickChangeFrame("5m", ["15m"])}
                label="5m-15m"
                color="warning"
              />
            </VuiBox>
            <VuiBox ml={1}>
              <Chip
                clickable
                onClick={() => handleQuickChangeFrame("15m", ["30m"])}
                color="warning"
                label="15m-30m"
              />
            </VuiBox>
          </VuiBox>
          <VuiBox color="text" px={2}>
            <Icon
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              fontSize="small"
              onClick={openMenu}
            >
              add
            </Icon>
          </VuiBox>
        </VuiBox>
        {renderMenu}
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
            { name: "auto take profit", align: "left" },
            { name: "optimized entry", align: "left" },
            { name: "uptime", align: "left" },
            { name: "action", align: "center" },
          ]}
          rows={renderRow}
        />
      </VuiBox>
    </Card >
  );
}

export default Projects;
