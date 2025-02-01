import { Card } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";
import Table from "examples/Tables/Table";
import VuiButton from "components/VuiButton";
import { useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import { AddCircle } from "@mui/icons-material";

const BestPerformanceVolumeItem = ({
  row,
  onItemClick = () => null,
  currentPosition = undefined,
}) => {
  const handleOnClick = () => onItemClick(row);
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
    netInflow: (
      <VuiTypography variant="caption" color="white">
        {Math.round(row.totalNetInflow)}
      </VuiTypography>
    ),
    diff: (
      <VuiBox width="3rem" textAlign="left">
        <VuiTypography color="white" variant="button" fontWeight="bold">
          {[Math.round(row.diff), "%"].join("")}
        </VuiTypography>
        {!isMobile ? (
          <VuiProgress
            value={Math.round(row.diff)}
            color="info"
            label={false}
            sx={{ background: "#2D2E5F" }}
          />
        ) : null}
      </VuiBox>
    ),
    action: (
      <VuiBox display="flex" alignItems="center">
        <VuiButton size="small" onClick={handleOnClick} color="vimeo" variant="gradient">
          <AddCircle style={{ marginRight: 4 }} />
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
      const currentPosition = position.find((e) => e.symbol.includes(row.symbol));
      return BestPerformanceVolumeItem({ row, onItemClick, currentPosition });
    });
  };

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
        },
        [breakpoints.up("xl")]: {
          height: "100% !important",
        },
      })}
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
            { name: "netInflow", align: "left" },
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
