/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
// @mui icons
import Grid from "@mui/material/Grid";


import VuiBox from "components/VuiBox";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Overview page components
import Header from "layouts/subscription/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";
import CarInformations from "./components/CarInformations";

function Overview() {

  return (
    <DashboardLayout>
      <Header />
      <VuiBox mt={5} mb={3}>
        <Grid
          container
          spacing={3}
          sx={({ breakpoints }) => ({
            [breakpoints.only("xl")]: {
              gridTemplateColumns: "repeat(2, 1fr)",
            },
          })}
        >
          <Grid
            item
            xs={12}
            xl={3}
            xxl={3}
            sx={({ breakpoints }) => ({
              minHeight: "400px",
              [breakpoints.only("xl")]: {
                gridArea: "1 / 1 / 2 / 2",
              },
            })}
          >
            <PlatformSettings />
          </Grid>
          <Grid
            item
            xs={12}
            xl={4}
            xxl={4}
            sx={({ breakpoints }) => ({
              [breakpoints.only("xl")]: {
                gridArea: "2 / 1 / 3 / 3",
              },
            })}
          >

            <ProfileInfoCard
              title="Binance API Key"
              description="Please note that we dont ask user to grant withdraw permission"
              info={{
                Permisions: "Allow Read, Allow Future Order",
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            xl={5}
            xxl={5}
            sx={({ breakpoints }) => ({
              [breakpoints.only("xl")]: {
                gridArea: "1 / 2 / 2 / 3",
              },
            })}
          >
            <CarInformations />
          </Grid>
        </Grid>
      </VuiBox>


      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Overview;
