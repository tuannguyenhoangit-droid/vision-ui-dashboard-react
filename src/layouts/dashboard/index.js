/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
import Grid from "@mui/material/Grid";

import VuiBox from "components/VuiBox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";

// Dashboard layout components
import SatisfactionRate from "layouts/dashboard/components/SatisfactionRate";
import ReferralTracking from "layouts/dashboard/components/ReferralTracking";

// React icons
import { IoWallet } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";

// Data

import { useEffect, useMemo, useState } from "react";
import {
  getAccountSubscriptionInfo,
  getBalance,
  getCurrentPositions,
  getIncomePnL,
  getOpenOrders,
  getTradeList,
} from "services/api";
import FuturePositionList from "./components/FuturePositionList";
import { useDispatch, useSelector } from "react-redux";

import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { setUserSubscription } from "app-redux/futures/userSlice";
import Card from "@mui/material/Card";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import { setPositions } from "app-redux/futures/positions";
import { ProfitShare } from "./components/ProfitShare";
import shield from "assets/images/shield.png";
import { isMobile } from "react-device-detect";
const auth = getAuth(firebaseApp);

const startOrDay = new Date();
startOrDay.setDate(startOrDay.getDate() - 1);
startOrDay.setHours(7);
startOrDay.setMinutes(0);
startOrDay.setSeconds(0);

function Dashboard() {
  const user = useSelector((e) => e.user.user);
  const position = useSelector((e) => e.positions.data);

  // modal handler

  const [openOrders, setOpenOrders] = useState([]);
  const [tradeList, setTradeList] = useState([]);
  const [balance, setBalance] = useState([]);
  const [incomePnL, setIncomePnL] = useState({});
  const [profitShareData, setProfitShareData] = useState(null);
  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      if (history.location.pathname == "/future") {
        auth.currentUser?.getIdToken?.().then((token) => {
          getCurrentPositions().then((position) => dispatch(setPositions(position)));
          getOpenOrders().then(setOpenOrders);
          getTradeList().then(setTradeList);
          getBalance().then(setBalance);
          getIncomePnL().then(setIncomePnL);
          getAccountSubscriptionInfo().then((subscription) => {
            dispatch(setUserSubscription(subscription.data));
          });
        });
      }
    }, 1000);
  }, [history.location.pathname]);

  const todayTrade = useMemo(() => {
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        {user?.apiKeyHidden?.length === 0 ? (
          <VuiBox mb={3}>
            <Card sx={{ backgroundColor: "primary.main" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} xl={6} display="flex" flexDirection="row">
                  <VuiBox
                    mr={3}
                    component="img"
                    style={{ maxHeight: isMobile ? "60px" : "80px" }}
                    src={shield}
                    alt="Binance"
                  />
                  <VuiBox>
                    <VuiTypography variant="h6" color="white">
                      Setup Binance API Key
                    </VuiTypography>
                    <VuiTypography variant="button" color="warning" fontWeight="regular">
                      To start trading, you need to setup your Binance API Key. We dont require
                      withdraw permission.
                    </VuiTypography>
                  </VuiBox>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  xl={6}
                  display="flex"
                  justifyContent={"flex-end"}
                  alignItems="center"
                >
                  <VuiButton
                    onClick={() => history.push("/profile")}
                    size="small"
                    color="info"
                    variant="gradient"
                  >
                    Setup API Key
                  </VuiButton>
                </Grid>
              </Grid>
            </Card>
          </VuiBox>
        ) : null}
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
                  color: todayProfitPercent < 0 ? "error" : "success",
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
                  color: balance?.[0]?.crossUnPnl < 0 ? "error" : "success",
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
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6} xl={6}>
              <SatisfactionRate data={openOrders} />
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <ReferralTracking
                profit={balance?.[0]?.crossUnPnl}
                position={position}
                balance={balance?.[0]?.balance}
              />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12} xl={12}>
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
              <FuturePositionList data={position} onShareProfit={setProfitShareData} />
            </Grid>
          </Grid>
        </VuiBox>
      </VuiBox>
      <ProfitShare
        open={profitShareData !== null}
        onClose={() => setProfitShareData(null)}
        data={profitShareData}
      />
    </DashboardLayout>
  );
}

export default Dashboard;
