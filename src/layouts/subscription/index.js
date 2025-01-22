/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
// @mui icons

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// Images
import profile1 from "assets/images/profile-1.png";
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Overview page components
import Header from "layouts/subscription/components/Header";
import { useEffect, useState } from "react";
import { getPendingTransaction, getSubscription } from "../../services/api";
import { Tab, Tabs } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPendingTransaction } from "../../redux/futures/transaction";
import { checkoutSubscription, setSubscription } from "../../redux/futures/subscription";

function Subscription() {
  const history = useHistory();
  const dispatch = useDispatch();
  const subscription = useSelector((e) => e.subscription)



  const [tabValue, setTabValue] = useState("quarterly");

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  useEffect(() => {

    // get current pending transaction
    getPendingTransaction().then((res) => {
      const pendingTransaction = res.data?.[0];
      if (pendingTransaction) {
        dispatch(setPendingTransaction(pendingTransaction))
        history.push("/subscription/checkout");
      } else {
        // no transaction, then display subscription
        getSubscription().then((subscription) => {
          dispatch(setSubscription(subscription))
        });
      }
    })
  }, []);


  return (
    <DashboardLayout>
      <VuiBox mb={2}>
        <Header />
      </VuiBox>

      <Grid container spacing={3} mb="30px" alignItems="center" alignSelf="center">
        <Grid item alignContent="center" alignItems="center">
          <Card>
            <VuiBox display="flex" flexDirection="column" height="100%">
              <VuiBox display="flex" justifyContent="space-between">
                <VuiBox display="flex" flexDirection="column" mb="24px">
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    Good Pricing, Great Profit
                  </VuiTypography>
                  <VuiTypography color="text" variant="button" fontWeight="regular">
                    Choose the best deal for you below
                  </VuiTypography>
                </VuiBox>
                <VuiBox>
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                    sx={{
                      background: "transparent",
                      display: "flex",
                      justifyContent: "flex-end",
                      maxHeight: 100,
                    }}
                  >
                    <Tab value="monthly" label="Monthly Price" />
                    <Tab value="quarterly" label="Quarterly price" />
                  </Tabs>
                </VuiBox>
              </VuiBox>
              <Grid container spacing={3}>
                {subscription.data?.map((sub) => {
                  return (
                    <Grid key={sub.id} item xs={12} md={4} xl={4}>
                      <Card
                        sx={{
                          background: subscription.current === sub.id ? "#00669c" : null,
                        }}
                      >
                        <DefaultProjectCard
                          onClick={() => {
                            dispatch(checkoutSubscription(sub))
                            history.push("/subscription/checkout");
                          }}
                          active={subscription.current === sub.id}
                          image={profile1}
                          label={sub.description}
                          title={sub.name}
                          monthlyPrice={sub.prices.find((s) => s.type === tabValue && tabValue === "monthly")?.price}
                          quarterlyPrice={sub.prices.find((s) => s.type === tabValue && tabValue === "quarterly")?.price}
                          features={[
                            ["Spot symbol configs", sub.maxSpotSymbol].join(": "),
                            ["Futures symbol configs", sub.maxSymbol].join(": "),
                            ["Max signal perday", sub.maxTradePerday].join(": "),
                            ["Recommend symbol", sub.autoSymbol ? "YES" : "NO"].join(": "),
                            ["Optimized entry", sub.entryOptimized ? "YES" : "NO"].join(": "),
                            ["Ema order backup", sub.emaBackup ? "YES" : "NO"].join(": "),
                          ]}
                          action={{
                            type: "internal",
                            route: "/pages/profile/profile-overview",
                            color: "white",
                            label: "VIEW ALL",
                          }}
                        />
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </VuiBox>
          </Card>
        </Grid>
      </Grid>

      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Subscription;
