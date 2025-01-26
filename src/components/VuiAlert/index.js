import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../redux/futures/messageSlice";
import VuiTypography from "components/VuiTypography";
import { Alert } from "@mui/material";
import PropTypes from "prop-types";

function VuiAlert() {
  const dispatch = useDispatch();
  const errorMessage = useSelector((e) => e.message);

  useEffect(() => {
    if (errorMessage.message) {
      setTimeout(() => {
        dispatch(setMessage({ message: "", type: "" }));
      }, 3000);
    }
  }, [errorMessage.message]);

  // The base template for the alert
  const alertTemplate = () => (
    <Alert
      variant="outlined"
      severity={errorMessage.type || "success"}
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        backgroundColor: "white",
        alignItems: "center",
        zIndex: 10000,
      }}
      dismissible
      onClose={() => dispatch(setMessage(""))}
    >
      <VuiTypography color={errorMessage.type || "success"} variant="button">
        {errorMessage.message}
      </VuiTypography>
    </Alert>
  );

  if (errorMessage.message) {
    return alertTemplate();
  }

  return null;
}

// Setting default values for the props of VuiAlert
VuiAlert.defaultProps = {
  color: "info",
  dismissible: false,
};

// Typechecking props of the VuiAlert
VuiAlert.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  dismissible: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default VuiAlert;
