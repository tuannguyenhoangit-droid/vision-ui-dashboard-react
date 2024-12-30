/*!

=========================================================
* SA BOT - v1.0.0
=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
import Card from "@mui/material/Card";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// React icons
import { BsCheckCircleFill } from "react-icons/bs";
import { FaDollarSign } from "react-icons/fa";

// Vision UI Dashboard React example components
import TimelineItem from "examples/Timeline/TimelineItem";

// Vision UI Dashboard theme imports
import palette from "assets/theme/base/colors";
import { useMemo } from "react";
import { RiMoneyDollarCircleFill } from "react-icons/ri";

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
            <TimelineItem
              key={item.id}
              realizedPnl={parseFloat(item.realizedPnl) - parseFloat(item.commission)}
              icon={<RiMoneyDollarCircleFill size="16px" color={palette.info.main} />}
              title={[item.side, item.symbol].join(" ")}
              dateTime={new Date(item.time).toLocaleString()}
            />
          );
        })}
      </VuiBox>
    </Card>
  );
}

export default OrdersOverview;
