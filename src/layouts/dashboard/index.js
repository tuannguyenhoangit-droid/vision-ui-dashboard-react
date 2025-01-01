/*!

=========================================================
* SA BOT - v1.0.0
=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Card } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import linearGradient from "assets/theme/functions/linearGradient";

import colors from "assets/theme/base/colors";

// Dashboard layout components
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";
import SatisfactionRate from "layouts/dashboard/components/SatisfactionRate";
import ReferralTracking from "layouts/dashboard/components/ReferralTracking";

// React icons
import { IoGlobe } from "react-icons/io5";
import { IoWallet } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";
import { FaFileInvoiceDollar, FaShoppingCart } from "react-icons/fa";

// Data
import BarChart from "examples/Charts/BarCharts/BarChart";
import { barChartOptionsDashboard } from "layouts/dashboard/data/barChartOptions";
import { useEffect, useMemo, useState } from "react";
import {
  deleteSymbolConfig,
  getBalance,
  getBestPerformanceVolume,
  getCurrentPositions,
  getExchangeInfo,
  getIncomePnL,
  getOpenOrders,
  getSymbolConfig,
  getTradeList,
} from "../../services/api";
import BestPerformanceVolumeList from "./components/BestPerformanceVolumeList";
import FuturePositionList from "./components/FuturePositionList";
import { useDispatch, useSelector } from "react-redux";
import { SymbolConfigModal } from "./components/SymbolConfigModal";
import { setSymbolConfigData } from "../../redux/futures/symbolConfigSlice";

import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import VuiDialog from "components/VuiDialog";
import { RiFile2Fill, RiMoneyDollarCircleFill } from "react-icons/ri";
import { PowerOffOutlined } from "@mui/icons-material";

const auth = getAuth(firebaseApp);

const startOrDay = new Date();
startOrDay.setDate(startOrDay.getDate() - 1);
startOrDay.setHours(7);
startOrDay.setMinutes(0);
startOrDay.setSeconds(0);

function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;

  // modal handler

  const [isOpenSymbolConfigModal, openSymbolConfigModal] = useState(false);
  const [symbolEditItem, setSymbolEditItem] = useState(null);

  const [openOrders, setOpenOrders] = useState([]);
  const [bestPerformanceVolume, setBestPerformanceVolume] = useState([]);
  const [position, setPosition] = useState([]);
  const [tradeList, setTradeList] = useState([]);
  const [balance, setBalance] = useState([]);
  const [incomePnL, setIncomePnL] = useState({});
  const [symbolDeleteItem, setSymbolDeleteItem] = useState(null);
  const history = useHistory();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      if (history.location.pathname == "/dashboard") {
        auth.currentUser?.getIdToken?.().then((token) => {
          getCurrentPositions().then(setPosition);
          getOpenOrders().then(setOpenOrders);
          getTradeList().then(setTradeList);
          getBalance().then(setBalance);
          getIncomePnL().then(setIncomePnL);
          getSymbolConfig().then((data) => dispatch(setSymbolConfigData(data)));
        });
      }
    }, 1000);
  }, [history.location.pathname]);

  const incomeBarChart = useMemo(() => {
    const chart = {
      option: {
        ...barChartOptionsDashboard,
        xaxis: {
          ...barChartOptionsDashboard.xaxis,
          categories: (incomePnL?.data || []).map((ic) => ic.d),
        },
      },
      data: {
        name: "PnL",
        data: (incomePnL.data || []).map(({ income }) => income),
      },
    };

    return chart;
  }, [incomePnL]);

  const onFilterChangeBestPerformanceVolume = (frame, dayAgo) => {
    getBestPerformanceVolume(frame, dayAgo).then(setBestPerformanceVolume);
  };

  const todayTrade = useMemo(() => {
    console.log("tradeList", tradeList);

    const trade = tradeList.filter(({ time }) => time > startOrDay.getTime());
    return {
      count: trade.length,
      trade: trade.filter((item) => item.realizedPnl !== "0").slice(0, 10),
    };
  }, [tradeList]);

  const accountBalance = useMemo(() => {
    return Math.round((balance?.[0]?.balance || 0) * 100) / 100;
  }, [balance]);

  const todayProfitPercent =
    Math.round(((incomePnL?.data?.[0]?.income || 0) / accountBalance) * 100 * 100) / 100;

  const unRealizedProfitPercent =
    Math.round(((balance?.[0]?.crossUnPnl || 0) / accountBalance) * 100 * 100) / 100;

  const confirmDeleteSymbol = (item) => {
    deleteSymbolConfig(item.symbol).then((response) => {
      getSymbolConfig().then((data) => dispatch(setSymbolConfigData(data)));
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Account Balance", fontWeight: "regular" }}
                count={["$", accountBalance].join("")}
                percentage={{ color: "success", text: "" }}
                icon={{ color: "info", component: <IoWallet size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Today Profit" }}
                count={["$", incomePnL?.data?.[0]?.income || 0].join("")}
                percentage={{
                  color: todayProfitPercent >= 0 ? "success" : "error",
                  text: [
                    "(",
                    todayProfitPercent >= 0 ? "+" : "",
                    todayProfitPercent || 0,
                    "%)",
                  ].join(""),
                }}
                icon={{
                  color: "info",
                  component: <RiMoneyDollarCircleFill size="22px" color="white" />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Unrelease PnL" }}
                count={["$", Math.round((balance?.[0]?.crossUnPnl || 0) * 100) / 100].join("")}
                percentage={{
                  color: balance?.[0]?.crossUnPnl > 0 ? "success" : "error",
                  text: [
                    "(",
                    unRealizedProfitPercent > 0 ? "+" : "",
                    unRealizedProfitPercent || 0,
                    "%)",
                  ].join(""),
                }}
                icon={{
                  color: "info",
                  component: <RiMoneyDollarCircleFill size="22px" color="white" />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Today trades" }}
                count={todayTrade.count}
                icon={{ color: "info", component: <IoDocumentText size="20px" color="white" /> }}
              />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing="18px">
            <Grid item xs={12} lg={12} xl={4}>
              <BestPerformanceVolumeList
                onFilterChange={onFilterChangeBestPerformanceVolume}
                data={bestPerformanceVolume}
              />
              {/* <WelcomeMark /> */}
            </Grid>
            <Grid item xs={12} lg={6} xl={4}>
              <SatisfactionRate data={openOrders} />
            </Grid>
            <Grid item xs={12} lg={6} xl={4}>
              <ReferralTracking position={position} balance={balance?.[0]?.balance} />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6} xl={7}>
              {/* <Card>
                <VuiBox sx={{ height: "100%" }}>
                  <VuiTypography variant="lg" color="white" fontWeight="bold" mb="5px">
                    Sales Overview
                  </VuiTypography>
                  <VuiBox display="flex" alignItems="center" mb="40px">
                    <VuiTypography variant="button" color="success" fontWeight="bold">
                      +5% more{" "}
                      <VuiTypography variant="button" color="text" fontWeight="regular">
                        in 2021
                      </VuiTypography>
                    </VuiTypography>
                  </VuiBox>
                  <VuiBox sx={{ height: "310px" }}>
                    <LineChart
                      lineChartData={lineChartDataDashboard}
                      lineChartOptions={lineChartOptionsDashboard}
                    />
                  </VuiBox>
                </VuiBox>
              </Card> */}
              <FuturePositionList data={position} />
            </Grid>
            <Grid item xs={12} lg={6} xl={5}>
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
                    height="340px"
                    sx={{
                      background: linearGradient(
                        cardContent.main,
                        cardContent.state,
                        cardContent.deg
                      ),
                      borderRadius: "20px",
                    }}
                  >
                    <BarChart
                      chartData={[incomeBarChart.data]}
                      chartOptions={incomeBarChart.option}
                    />
                  </VuiBox>
                </VuiBox>
              </Card>
            </Grid>
          </Grid>
        </VuiBox>
        <Grid container spacing={3} direction="row" justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={6} lg={8}>
            <Projects
              onEditItem={(item) => {
                setSymbolEditItem(item);
              }}
              onDeleteItem={(item) => {
                setSymbolDeleteItem(item);
              }}
              onMenuClick={(action) => {
                if (action === "add") openSymbolConfigModal(true);
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <OrderOverview data={todayTrade.trade} />
          </Grid>
        </Grid>
      </VuiBox>
      {/* <Footer /> */}
      <SymbolConfigModal
        item={symbolEditItem}
        onClose={() => {
          openSymbolConfigModal(false);
          setSymbolEditItem(null);
        }}
        open={isOpenSymbolConfigModal || symbolEditItem !== null}
      />
      <VuiDialog
        onConfirm={confirmDeleteSymbol}
        cancelTitle="Cancel"
        confirmTitle="Confirm"
        description={`Confirm to delete symbol config: ${
          symbolDeleteItem?.symbol || ""
        }.\nYou will handle exist symbol position!`}
        title="Delete symbol config"
        onClose={() => setSymbolDeleteItem(null)}
        openItem={symbolDeleteItem}
      />
    </DashboardLayout>
  );
}

export default Dashboard;
