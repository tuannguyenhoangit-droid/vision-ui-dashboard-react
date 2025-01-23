/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
import Card from "@mui/material/Card";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard React example components
import TimelineItem from "examples/Timeline/TimelineItem";

// Vision UI Dashboard theme imports
import { useMemo } from "react";
import Transaction from "layouts/billing/components/Transaction";

function OrdersOverview({ data = [] }) {
  const sumRealizedPnl = useMemo(() => {
    return (
      Math.round(
        data.map(({ realizedPnl }) => parseFloat(realizedPnl)).reduce((pre, cur) => pre + cur, 0) *
        100
      ) / 100
    );
  }, [data]);

  return (
    <Card className="h-100">
      <VuiBox mb="16px">
        <VuiTypography variant="lg" fontWeight="bold" mb="5px" color="white">
          Last 10 Positions History
        </VuiTypography>
      </VuiBox>
      <VuiBox>
        {data.map((item) => {
          return (
            <Transaction
              color={parseFloat(item.realizedPnl) - parseFloat(item.commission) > 0 ? "success" : "error"}
              icon={parseFloat(item.realizedPnl) - parseFloat(item.commission) > 0 ? "arrow_upward" : "arrow_downward"}
              name={[item.side, item.symbol].join(" ")}
              description={new Date(item.time).toLocaleString()}
              value={`$${Math.max(parseFloat(item.realizedPnl) - parseFloat(item.commission), 0).toFixed(2)}`}
            />
          );
        })}
      </VuiBox>
    </Card>
  );
}

export default OrdersOverview;
