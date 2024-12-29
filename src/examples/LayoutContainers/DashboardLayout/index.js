/*!

=========================================================
* SA BOT - v1.0.0
=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useEffect } from "react";

// react-router-dom components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";

// Vision UI Dashboard React context
import { useVisionUIController, setLayout } from "context";
import { useDispatch, useSelector } from "react-redux";
import VuiTypography from "components/VuiTypography";
import VuiAlert from "components/VuiAlert";
import { setMessage } from "../../../redux/futures/messageSlice";
import zIndex from "@mui/material/styles/zIndex";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();
  const errorMessage = useSelector((e) => e.message);
  const reduxDispatch = useDispatch();

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  return (
    <VuiBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: "relative",

        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      {children}
      {errorMessage.message ? (
        <VuiAlert
          color={errorMessage.type || "success"}
          style={{
            position: "absolute",
            top: 100,
            right: 24,
            zIndex: 999,
          }}
          dismissible
          onClose={() => reduxDispatch(setMessage(""))}
        >
          <VuiTypography color="white" variant="button">
            {errorMessage.message}
          </VuiTypography>
        </VuiAlert>
      ) : null}
    </VuiBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
