
import { useEffect } from "react";

// react-router-dom components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";


import VuiBox from "components/VuiBox";


import { useVisionUIController, setLayout } from "context";
import { useDispatch, useSelector } from "react-redux";
import VuiTypography from "components/VuiTypography";
import { setMessage } from "../../../redux/futures/messageSlice";
import { Alert } from "@mui/material";
import VuiAlert from "components/VuiAlert";
import Footer from "examples/Footer";

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
      <Footer />
      <VuiAlert />
    </VuiBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
