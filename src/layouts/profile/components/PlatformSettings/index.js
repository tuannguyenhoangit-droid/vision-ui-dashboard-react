/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";


import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiSwitch from "components/VuiSwitch";
import { changeFutureActive } from "services/api";
import { useSelector } from "react-redux";
import { Chip } from "@mui/material";

function PlatformSettings() {
  const [followsMe, setFollowsMe] = useState(true);


  const user = useSelector((state) => state.user);
  const [futureActive, setFutureActive] = useState(user?.user?.futureActive);

  const handleChangeFutureActive = async (switched) => {
    await changeFutureActive(switched).then((res) => {
      setFutureActive(res.futureActive);
    });
  };

  return (
    <Card sx={{ minHeight: "490px", height: "100%" }}>
      <VuiBox mb={1} display="flex" alignItems="center" justifyContent="space-between">
        <VuiTypography variant="lg" fontWeight="bold" color="white" textTransform="capitalize">
          Account
        </VuiTypography>
        <Chip style={{ marginLeft: 12 }} label={user?.user?.active ? "Active" : "Inactive"} color={user?.user?.active ? "success" : "error"} size="small" />
      </VuiBox>

      <VuiBox display="flex" mb={2}>
        <VuiTypography variant="button" fontWeight="regular" color="warning">
          {!user?.user?.active ? "Please contact admin to activate your account" : ""}
        </VuiTypography>
      </VuiBox>

      <VuiBox>
        <VuiTypography
          variant="xxs"
          fontWeight="medium"
          color="text"
          textTransform="uppercase"
        >
          Spot
        </VuiTypography>
        <VuiBox display="flex" mb={2}>
          <VuiBox width="80%" mb={1}>
            <VuiTypography variant="button" fontWeight="regular" color="text">
              Active Accumulation
            </VuiTypography>
          </VuiBox>
          <VuiBox mt={0.25}>
            <VuiSwitch color="success" checked={followsMe} onChange={() => setFollowsMe(!followsMe)} />
          </VuiBox>

        </VuiBox>

        <VuiBox>
          <VuiTypography variant="xxs" fontWeight="medium" color="text" textTransform="uppercase">
            Futures
          </VuiTypography>
        </VuiBox>
        <VuiBox display="flex" mb="14px">
          <VuiBox width="80%">
            <VuiTypography variant="button" fontWeight="regular" color="text">
              Active Accumulation
            </VuiTypography>
          </VuiBox>
          <VuiBox mt={0.25}>
            <VuiSwitch
              color="success"
              checked={futureActive}
              onChange={(e, switched) => {
                handleChangeFutureActive(switched);
              }}
            />
          </VuiBox>

        </VuiBox>


      </VuiBox>
    </Card>
  );
}

export default PlatformSettings;
