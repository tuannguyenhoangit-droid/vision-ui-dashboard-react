/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";

// Vision UI Dashboard Materail-UI example components
import Table from "examples/Tables/Table";

const FuturePositionItem = ({ row }) => {
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
    size: (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {[Math.round(row.notional * 1000) / 1000, "USDT"].join(" ")}
      </VuiTypography>
    ),
    entry: (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {[Math.round(row.entryPrice * 1000) / 1000].join(" ")}
      </VuiTypography>
    ),
    price: (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {Math.round(row.markPrice * 1000) / 1000}
      </VuiTypography>
    ),
    margin: (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {["$", Math.round(row.initialMargin * 1000) / 1000].join(" ")}
      </VuiTypography>
    ),

    PnL: (
      <VuiBox width="8rem" textAlign="left">
        <VuiTypography
          color={row.unRealizedProfit > 0 ? "success" : "error"}
          variant="button"
          fontWeight="bold"
        >
          {[
            "$",
            Math.round(row.unRealizedProfit * 100) / 100,
            " (",
            Math.round((row.unRealizedProfit / row.initialMargin) * 100 * 100) / 100,
            "%) ",
          ].join(" ")}
        </VuiTypography>
        <VuiProgress
          value={Math.round(row.diff)}
          color="info"
          label={false}
          sx={{ background: "#2D2E5F" }}
        />
      </VuiBox>
    ),
    liquid: (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {Math.round(row.liquidationPrice * 1000) / 1000}
      </VuiTypography>
    ),
  };
};

function FuturePositionList(props) {
  const [menu, setMenu] = useState(null);
  const { data = [] } = props;

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderRow = () => {
    return data
      ?.filter((row) => parseFloat(row.notional) > 0)
      .map((row) => FuturePositionItem({ row }));
  };

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
      <MenuItem onClick={closeMenu}>Action</MenuItem>
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
            Current Future Position
          </VuiTypography>
          <VuiBox display="flex" alignItems="center" lineHeight={0}>
            {/* <BsCheckCircleFill color="green" size="15px" /> */}
            <VuiTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>Active position</strong> from Best Performance Volume
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
            { name: "size", align: "left" },
            { name: "entry", align: "left" },
            { name: "price", align: "left" },
            { name: "margin", align: "left" },
            { name: "PnL", align: "left" },
            { name: "liquid", align: "left" },
          ]}
          rows={renderRow()}
        />
      </VuiBox>
    </Card>
  );
}

export default FuturePositionList;
