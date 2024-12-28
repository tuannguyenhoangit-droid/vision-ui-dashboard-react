/*!

=========================================================
* SA BOT - v1.0.0
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
import { BsCheckCircleFill, BsPencilSquare, BsTrash2Fill } from "react-icons/bs";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard Materail-UI example components
import Table from "examples/Tables/Table";
import { useSelector } from "react-redux";
import VuiSwitch from "components/VuiSwitch";
import { timeDifference } from "utils";
import { FaTrashAlt } from "react-icons/fa";
import colors from "assets/theme/base/colors";

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
        {row.buyRequireHistogram.map((frame) => (
          <VuiTypography variant="button" color="white" fontWeight="bold">
            {frame}
          </VuiTypography>
        ))}
      </VuiBox>
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

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = (action) => {
    setMenu(null);
    onMenuClick?.(action);
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
      <MenuItem onClick={() => closeMenu("add")}>Add Config</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

  return (
    <Card
      sx={{
        height: "100% !important",
      }}
    >
      <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="32px">
        <VuiBox mb="auto">
          <VuiTypography color="white" variant="lg" mb="6px" gutterBottom>
            Running Symbol Configs
          </VuiTypography>
          <VuiBox display="flex" alignItems="center" lineHeight={0}>
            <BsCheckCircleFill color="green" size="15px" />
            <VuiTypography variant="button" fontWeight="regular" color="text" ml="5px">
              Active configs
            </VuiTypography>
          </VuiBox>
        </VuiBox>
        <VuiBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
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
