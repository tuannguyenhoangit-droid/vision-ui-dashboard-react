import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import VuiBox from "components/VuiBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import VuiTypography from "components/VuiTypography";
import BarChart from "examples/Charts/BarCharts/BarChart";
import { barChartOptionsDashboard } from "layouts/dashboard/data/barChartOptions";
import linearGradient from "assets/theme/functions/linearGradient";
import colors from "assets/theme/base/colors";
import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getIncomePnL, getTradeList } from "../../../services/api";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../../firebase";
import OrdersOverview from "layouts/dashboard/components/OrderOverview";
const auth = getAuth(firebaseApp);

const startOrDay = new Date();
startOrDay.setDate(startOrDay.getDate() - 1);
startOrDay.setHours(7);
startOrDay.setMinutes(0);
startOrDay.setSeconds(0);

function Performance() {
  const [incomePnL, setIncomePnL] = useState({});
  const [tradeList, setTradeList] = useState([]);
  const history = useHistory();

  const { gradients } = colors;
  const { cardContent } = gradients;

  useEffect(() => {
    setTimeout(() => {
      auth.currentUser?.getIdToken?.().then((token) => {
        getIncomePnL().then(setIncomePnL);
        getTradeList().then(setTradeList);
      });
    }, 1000);
  }, [history.location.pathname]);

  console.log(incomePnL);

  const incomeBarChart = useMemo(() => {
    const chart = {
      option: {
        ...barChartOptionsDashboard,
        xaxis: {
          ...barChartOptionsDashboard.xaxis,
          categories: (incomePnL?.data || [])
            .map((ic) => {
              const m = ic.d.split("-")[1];
              return [ic.d.split("-")[0], parseInt(m) + 1].join("-");
            })
            .reverse(),
        },
      },
      data: {
        name: "PnL",
        data: (incomePnL.data || []).map(({ income }) => income).reverse(),
      },
    };

    return chart;
  }, [incomePnL]);

  const todayTrade = useMemo(() => {
    const trade = tradeList.filter(({ time }) => time > startOrDay.getTime());
    return {
      count: trade.length,
      trade: trade.filter((item) => item.realizedPnl !== "0").slice(0, 10),
    };
  }, [tradeList]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8} xl={8}>
          <Card>
            <VuiBox>
              <VuiTypography variant="lg" color="white" fontWeight="bold" mb="5px">
                Profit and Loss
              </VuiTypography>
              <VuiBox display="flex" alignItems="center" mb="40px">
                <VuiTypography
                  variant="button"
                  color={incomePnL.totalIncomeLast7Days > 0 ? "success" : "error"}
                  fontWeight="bold"
                >
                  {[
                    incomePnL.totalIncomeLast7Days > 0 ? "+" : "-",
                    "$",
                    Math.round(incomePnL.totalIncomeLast7Days * 100) / 100,
                  ]}
                  <VuiTypography variant="button" color="text" fontWeight="regular">
                    {" this week"}
                  </VuiTypography>
                </VuiTypography>
              </VuiBox>
              <VuiBox
                mb="24px"
                height="640px"
                sx={{
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  borderRadius: "20px",
                }}
              >
                <BarChart chartData={[incomeBarChart.data]} chartOptions={incomeBarChart.option} />
              </VuiBox>
            </VuiBox>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <OrdersOverview data={todayTrade.trade} />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default Performance;
