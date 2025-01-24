
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
import { setMessage } from "../../../redux/futures/messageSlice";
import { Alert } from "@mui/material";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();
  const errorMessage = useSelector((e) => e.message);

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
        <Alert
          variant="outlined"
          severity={errorMessage.type || "success"}
          style={{
            position: "fixed",
            top: 12,
            right: 12,
          }}
          dismissible
          onClose={() => dispatch(setMessage(""))}
        >
          <VuiTypography color="white" variant="button">
            {errorMessage.message}
          </VuiTypography>
        </Alert>
      ) : null}
    </VuiBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
