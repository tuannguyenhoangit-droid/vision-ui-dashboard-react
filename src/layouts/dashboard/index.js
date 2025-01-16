/*!

=========================================================

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

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";

import colors from "assets/theme/base/colors";

// Dashboard layout components
import SatisfactionRate from "layouts/dashboard/components/SatisfactionRate";
import ReferralTracking from "layouts/dashboard/components/ReferralTracking";

// React icons
import { IoWallet } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";

// Data

import { barChartOptionsDashboard } from "layouts/dashboard/data/barChartOptions";
import { useEffect, useMemo, useState } from "react";
import {
  deleteSymbolConfig,
  getBalance,
  getCurrentPositions,
  getIncomePnL,
  getOpenOrders,
  getSymbolConfig,
  getTradeList,
} from "../../services/api";
import FuturePositionList from "./components/FuturePositionList";
import { useDispatch, useSelector } from "react-redux";
import { SymbolConfigModal } from "./components/SymbolConfigModal";
import { setSymbolConfigData } from "../../redux/futures/symbolConfigSlice";

import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import VuiDialog from "components/VuiDialog";
import { RiMoneyDollarCircleFill } from "react-icons/ri";

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
  const [position, setPosition] = useState([]);
  const [tradeList, setTradeList] = useState([]);
  const [balance, setBalance] = useState([]);
  const [incomePnL, setIncomePnL] = useState({});
  const [symbolDeleteItem, setSymbolDeleteItem] = useState(null);
  const history = useHistory();

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
            <Grid item xs={12} lg={6} xl={6}>
              <SatisfactionRate data={openOrders} />
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <ReferralTracking position={position} balance={balance?.[0]?.balance} />
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
              <FuturePositionList data={position} />
            </Grid>
          </Grid>
        </VuiBox>
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
