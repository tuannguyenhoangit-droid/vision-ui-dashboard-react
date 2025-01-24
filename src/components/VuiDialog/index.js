import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";


import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import VuiSwitch from "components/VuiSwitch";
import GradientBorder from "examples/GradientBorder";

// Vision UI Dashboard assets
import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import { useEffect, useMemo, useState } from "react";

function VuiDialog({
  openItem,
  title,
  description,
  cancelTitle,
  confirmTitle,
  onConfirm = () => null,
  onClose = () => null,
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(openItem !== null);
  }, [openItem]);

  const handleConfirm = () => {
    setIsOpen(false);
    onConfirm(openItem);
  };

  const handleCancel = () => {
    setIsOpen(false);
    onClose();
  };
  return (
    <Dialog onClose={onClose} open={isOpen}>
      <GradientBorder borderRadius={"6"} maxWidth="100%">
        <VuiBox
          borderRadius="inherit"
          p="32px"
          sx={({ palette: { secondary } }) => ({
            backgroundColor: secondary.focus,
          })}
        >
          <VuiTypography
            color="white"
            fontWeight="bold"
            mb="12px"
            sx={({ typography: { size } }) => ({
              fontSize: size.lg,
            })}
          >
            {title}
          </VuiTypography>
          <VuiTypography
            color="white"
            fontWeight="medium"
            mb="24px"
            sx={({ typography: { size } }) => ({
              fontSize: size.sm,
            })}
          >
            {description}
          </VuiTypography>

          <VuiBox display="flex" mt={2} justifyContent="flex-end" alignItems="center">
            <VuiButton onClick={handleCancel} color="dark">
              {cancelTitle}
            </VuiButton>
            <VuiBox ml={2}>
              <VuiButton onClick={handleConfirm} color="info">
                {confirmTitle}
              </VuiButton>
            </VuiBox>
          </VuiBox>
        </VuiBox>
      </GradientBorder>
    </Dialog>
  );
}

VuiDialog.propTypes = {
  open: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  cancelTitle: PropTypes.string,
  confirmTitle: PropTypes.string,
};

export default VuiDialog;
