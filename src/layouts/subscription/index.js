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
import team1 from "assets/images/avatar1.png";
import team2 from "assets/images/avatar2.png";
import team3 from "assets/images/avatar3.png";
import team4 from "assets/images/avatar4.png";
// Images
import profile1 from "assets/images/profile-1.png";
import profile3 from "assets/images/profile-3.png";
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Overview page components
import Header from "layouts/subscription/components/Header";
import { useEffect, useState } from "react";
import { getSubscription } from "../../services/api";
import { useSelector } from "react-redux";
import { Tab, Tabs } from "@mui/material";
import colors from "assets/theme/base/colors";
const { dark } = colors;

function Subscription() {
  const [subscription, setSubscription] = useState({
    current: "",
    data: [],
  });

  const [tabValue, setTabValue] = useState(0);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const user = useSelector((e) => e.user.user);
  useEffect(() => {
    getSubscription().then(setSubscription);
  }, []);

  console.log("user", user);

  return (
    <DashboardLayout>
      <VuiBox mb={2}>
        <Header />
      </VuiBox>

      <Grid container spacing={3} mb="30px">
        <Grid item>
          <Card>
            <VuiBox display="flex" flexDirection="column" height="100%">
              <VuiBox display="flex" justifyContent="space-between">
                <VuiBox display="flex" flexDirection="column" mb="24px">
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    Subscription
                  </VuiTypography>
                  <VuiTypography color="text" variant="button" fontWeight="regular">
                    Architects design houses
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
                    <Tab label="Monthly Price" />
                    <Tab label="Quarterly price" />
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
                          active={subscription.current === sub.id}
                          image={profile1}
                          label={sub.description}
                          title={sub.name}
                          monthlyPrice={sub.monthlyPrice}
                          quarterlyPrice={sub.quarterlyPrice}
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
                          authors={[
                            { image: team1, name: "Elena Morison" },
                            { image: team2, name: "Ryan Milly" },
                            { image: team3, name: "Nick Daniel" },
                            { image: team4, name: "Peterson" },
                          ]}
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
