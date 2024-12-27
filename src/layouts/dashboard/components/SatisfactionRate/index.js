import React from "react";

import { Card } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
// import { IoHappy } from "react-icons/io5";
// import colors from "assets/theme/base/colors";
// import linearGradient from "assets/theme/functions/linearGradient";
// import CircularProgress from "@mui/material/CircularProgress";
import Table from "examples/Tables/Table";

const RecentOrderItem = ({ row }) => {
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
    type: (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {[row.side, row.type].join(" ")}
      </VuiTypography>
    ),
    price: (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {["$", Math.round((parseFloat(row.stopPrice) || parseFloat(row.price)) * 1000) / 1000].join(
          ""
        )}
      </VuiTypography>
    ),
    quantity: (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {row.origQty}
      </VuiTypography>
    ),
    total: (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {["$", Math.round(parseFloat(row.price) * parseFloat(row.origQty) * 1000) / 1000].join("")}
      </VuiTypography>
    ),
  };
};

const SatisfactionRate = ({ data = [] }) => {
  const renderRow = () => {
    return data.map((row) => RecentOrderItem({ row }));
  };

  return (
    <Card sx={{ height: "100%" }}>
      <VuiBox display="flex" flexDirection="column">
        <VuiTypography variant="lg" color="white" fontWeight="bold" mb="4px">
          Open Orders
        </VuiTypography>
        <VuiTypography variant="button" color="text" fontWeight="regular" mb="20px">
          {["Current Open Orders (", data.length, ")"]}
        </VuiTypography>
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
              { name: "type", align: "left" },
              { name: "price", align: "left" },
              { name: "quantity", align: "left" },
              { name: "total", align: "left" },
            ]}
            rows={renderRow()}
          />
        </VuiBox>
      </VuiBox>
    </Card>
  );
};

export default SatisfactionRate;
