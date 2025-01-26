/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useEffect, useState } from "react";

// @mui material components
import { IoCalendar, IoTime, IoWallet } from "react-icons/io5";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Card, Stack } from "@mui/material";

import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";

// Vision UI Dashboard Materail-UI example components
import Table from "examples/Tables/Table";
import { BsRocketFill } from "react-icons/bs";
import VuiButton from "components/VuiButton";
import { useSelector } from "react-redux";

const BestPerformanceVolumeItem = ({ row, onItemClick = () => null, currentPosition = undefined }) => {
  const handleOnClick = () => onItemClick(row)
  return {
    symbol: (
      <VuiBox display="flex" alignItems="center">
        {/* <AdobeXD size="20px" /> */}
        <VuiTypography
          // pl="16px"
          color={currentPosition ? parseFloat(currentPosition?.unRealizedProfit) > 0 ? "success" : "error" : "white"}
          variant="button"
          fontWeight="medium"
        >
          {row.symbol}
        </VuiTypography>
      </VuiBox>
    ),
    totalNetInflow: (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {Math.round(row.totalNetInflow)}
      </VuiTypography>
    ),
    diff: (
      <VuiBox width="8rem" textAlign="left">
        <VuiTypography color="white" variant="button" fontWeight="bold">
          {[Math.round(row.diff), "%"].join("")}
        </VuiTypography>
        <VuiProgress
          value={Math.round(row.diff)}
          color="info"
          label={false}
          sx={{ background: "#2D2E5F" }}
        />
      </VuiBox>
    ),
    action: (
      <VuiBox display="flex" alignItems="center">
        <VuiButton size="small" onClick={handleOnClick} color="vimeo" variant="gradient">
          <BsRocketFill style={{ marginRight: 4 }} />
          Strategy
        </VuiButton>
      </VuiBox>
    ),
  };
};

function BestPerformanceVolumeList(props) {
  const { title, description, data = [], onItemClick = () => null } = props;

  const position = useSelector((e) => e.positions.data);

  const renderRow = () => {
    return data.map((row) => {
      const currentPosition = position.find(e => e.symbol.includes(row.symbol));
      return BestPerformanceVolumeItem({ row, onItemClick, currentPosition })
    });
  };

  return (
    <Card
      sx={{
        height: "100% !important",
      }}
    >
      <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="32px">
        <VuiBox mb="auto">
          <VuiTypography color="white" variant="lg" mb="6px" gutterBottom>
            {title}
          </VuiTypography>
          <VuiBox display="flex" alignItems="center" lineHeight={0}>
            {/* <BsCheckCircleFill color="green" size="15px" /> */}
            <VuiTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>Top token</strong> {description}
            </VuiTypography>
          </VuiBox>
        </VuiBox>
        <VuiBox display="flex" justifyContent="space-between" mb="auto">
          {/* <Stack direction="row" spacing={{ sm: "10px", xl: "4px", xxl: "10px" }}>
            <VuiBox
              onClick={openFrameMenu}
              bgColor="info"
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ borderRadius: "6px", width: "25px", height: "25px" }}
            >
              <IoTime color="#fff" size="12px" />
            </VuiBox>
            <VuiTypography color="text" variant="button" fontWeight="medium">
              {frame}
            </VuiTypography>
          </Stack>
          
          <Stack direction="row" spacing={{ sm: "10px", xl: "4px", xxl: "10px" }} ml="16px">
            <VuiBox
              onClick={openDayAgoMenu}
              bgColor="info"
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ borderRadius: "6px", width: "25px", height: "25px" }}
            >
              <IoCalendar color="#fff" size="12px" />
            </VuiBox>
            <VuiTypography color="text" variant="button" fontWeight="medium">
              {[dayAgo, "Days"].join(" ")}
            </VuiTypography>
          </Stack> */}

          {/* {renderMenuDayRange} */}
          <VuiTypography color="text" variant="button" fontWeight="medium">
            Data record by 5 days
          </VuiTypography>
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
            { name: "totalNetInflow", align: "left" },
            { name: "diff", align: "left" },
            { name: "action", align: "left" },
          ]}
          rows={renderRow()}
        />
      </VuiBox>
    </Card>
  );
}

export default BestPerformanceVolumeList;
