/*!

=========================================================
* SA BOT - v1.0.0
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
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";

// Vision UI Dashboard Materail-UI example components
import Table from "examples/Tables/Table";

const BestPerformanceVolumeItem = ({ row }) => {
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
  };
};

function BestPerformanceVolumeList(props) {
  // const { columns, rows } = data();
  const [frameMenuOpen, setFrameMenuOpen] = useState(null);
  const [dayAgoMenuOpen, setDayAgoMenuOpen] = useState(null);
  const { data = [], onFilterChange = () => null } = props;
  const [frame, setFrame] = useState("HOUR_4");
  const [dayAgo, setDayAgo] = useState("5");

  const openFrameMenu = ({ currentTarget }) => setFrameMenuOpen(currentTarget);
  const closeFrameMenu = (ref) => {
    setFrameMenuOpen(null);
    setFrame(ref.nativeEvent.target.id);
  };

  const openDayAgoMenu = ({ currentTarget }) => setDayAgoMenuOpen(currentTarget);
  const closeDayAgoMenu = (ref) => {
    setDayAgoMenuOpen(null);
    setDayAgo(ref.nativeEvent.target.id);
  };

  useEffect(() => {
    onFilterChange(frame, dayAgo);
  }, []);

  useEffect(() => {
    onFilterChange(frame, dayAgo);
  }, [frame, dayAgo]);

  const renderRow = () => {
    return data.map((row) => BestPerformanceVolumeItem({ row }));
  };

  const renderMenuFrame = (
    <Menu
      id="simple-menu"
      anchorEl={frameMenuOpen}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(frameMenuOpen)}
      onClose={closeFrameMenu}
    >
      <MenuItem id="HOUR_4" onClick={closeFrameMenu}>
        HOUR_4
      </MenuItem>
      <MenuItem id="DAY_1" onClick={closeFrameMenu}>
        DAY_1
      </MenuItem>
    </Menu>
  );

  const renderMenuDayRange = (
    <Menu
      id="simple-menu"
      anchorEl={dayAgoMenuOpen}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(dayAgoMenuOpen)}
      onClose={closeDayAgoMenu}
    >
      <MenuItem id="3" onClick={closeDayAgoMenu}>
        3 Days Ago
      </MenuItem>
      <MenuItem id="5" onClick={closeDayAgoMenu}>
        5 Days Ago
      </MenuItem>
      <MenuItem id="7" onClick={closeDayAgoMenu}>
        7 Days Ago
      </MenuItem>
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
            Best Volume Performance
          </VuiTypography>
          <VuiBox display="flex" alignItems="center" lineHeight={0}>
            {/* <BsCheckCircleFill color="green" size="15px" /> */}
            <VuiTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>Top token</strong> has best volume by 7 days
            </VuiTypography>
          </VuiBox>
        </VuiBox>
        <VuiBox display="flex" justifyContent="space-between" mb="auto">
          <Stack direction="row" spacing={{ sm: "10px", xl: "4px", xxl: "10px" }}>
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
          {renderMenuFrame}
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
          </Stack>

          {renderMenuDayRange}
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
          ]}
          rows={renderRow()}
        />
      </VuiBox>
    </Card>
  );
}

export default BestPerformanceVolumeList;
