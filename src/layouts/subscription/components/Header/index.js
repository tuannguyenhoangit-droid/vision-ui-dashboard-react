/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { Chip } from "@mui/material";
import AppBar from "@mui/material/AppBar";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// Images

import VuiAvatar from "components/VuiAvatar";

import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";


import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { dayDifference } from "utils";

function Header() {
  const user = useSelector((e) => e.user.user);

  return (
    <VuiBox position="relative">
      <DashboardNavbar light />
      <Card
        sx={{
          px: 3,
          mt: 2,
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={({ breakpoints }) => ({
            [breakpoints.up("xs")]: {
              gap: "16px",
            },
            [breakpoints.up("xs")]: {
              gap: "0px",
            },
            [breakpoints.up("xl")]: {
              gap: "0px",
            },
          })}
        >
          <Grid
            item
            xs={12}
            md={1.7}
            lg={1.5}
            xl={1.2}
            xxl={0.8}
            display="flex"
            sx={({ breakpoints }) => ({
              [breakpoints.only("sm")]: {
                justifyContent: "center",
                alignItems: "center",
              },
            })}
          >
            <VuiAvatar
              src={user?.photoURL}
              alt="profile-image"
              variant="circle"
              size="xl"
              shadow="sm"
            />
          </Grid>
          <Grid item xs={12} md={4.3} lg={4} xl={3.8} xxl={7}>
            <VuiBox
              height="100%"
              mt={0.5}
              lineHeight={1}
              display="flex"
              flexDirection="column"
              sx={({ breakpoints }) => ({
                [breakpoints.only("sm")]: {
                  justifyContent: "center",
                  alignItems: "center",
                },
              })}
            >
              <VuiTypography variant="lg" color="white" fontWeight="bold">
                {user?.displayName || ""}
              </VuiTypography>
              <VuiTypography variant="button" color="text" fontWeight="regular">
                {user?.email || ""}
              </VuiTypography>
            </VuiBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6.5} xl={6} xxl={4} sx={{ margin: "auto" }}>
            <AppBar position="static">
              <VuiBox justifyContent="flex-end" display="flex" alignItems={isMobile ? "center" : "flex-end"} flexDirection="column">
                <VuiBox>
                  <VuiTypography variant="xxs" color="white" fontWeight="bold">
                    Subscription
                  </VuiTypography>
                </VuiBox>
                <VuiBox>
                  <VuiTypography variant="lg" color="primary" fontWeight="bold">
                    {user?.subscription?.data?.name || ""}
                  </VuiTypography>
                  <Chip style={{ marginLeft: 8 }} size="small" color={user?.subscription?.status === "active" ? "success" : "warning"} label={user?.subscription?.status || ""} />
                </VuiBox>
                <VuiBox>
                  <VuiTypography variant="button" color="white" fontWeight="bold">
                    {["Expired in", dayDifference(user?.subscription?.endAt || 0), "day(s)"].join(
                      " "
                    )}
                  </VuiTypography>
                </VuiBox>
              </VuiBox>
            </AppBar>
          </Grid>
        </Grid>
      </Card>
    </VuiBox>
  );
}

export default Header;
