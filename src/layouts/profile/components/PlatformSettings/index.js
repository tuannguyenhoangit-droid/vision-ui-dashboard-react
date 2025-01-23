/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiSwitch from "components/VuiSwitch";
import { changeFutureActive } from "services/api";
import { useSelector } from "react-redux";

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
      <VuiBox mb="26px">
        <VuiTypography variant="lg" fontWeight="bold" color="white" textTransform="capitalize">
          Account Settings
        </VuiTypography>
      </VuiBox>
      <VuiBox lineHeight={1.25}>
        <VuiTypography
          variant="xxs"
          fontWeight="medium"
          mb="20px"
          color="text"
          textTransform="uppercase"
        >
          Spot
        </VuiTypography>
        <VuiBox display="flex" mb="14px">
          <VuiBox mt={0.25}>
            <VuiSwitch color="success" checked={followsMe} onChange={() => setFollowsMe(!followsMe)} />
          </VuiBox>
          <VuiBox width="80%" ml={2}>
            <VuiTypography variant="button" fontWeight="regular" color="text">
              Active Accumulation
            </VuiTypography>
          </VuiBox>
        </VuiBox>

        <VuiBox mb="6px">
          <VuiTypography variant="xxs" fontWeight="medium" color="text" textTransform="uppercase">
            Futures
          </VuiTypography>
        </VuiBox>
        <VuiBox display="flex" mb="14px">
          <VuiBox mt={0.25}>
            <VuiSwitch
              color="success"
              checked={futureActive}
              onChange={(e, switched) => {
                handleChangeFutureActive(switched);
              }}
            />
          </VuiBox>
          <VuiBox width="80%" ml={2}>
            <VuiTypography variant="button" fontWeight="regular" color="text">
              Active Futures
            </VuiTypography>
          </VuiBox>
        </VuiBox>


      </VuiBox>
    </Card>
  );
}

export default PlatformSettings;
