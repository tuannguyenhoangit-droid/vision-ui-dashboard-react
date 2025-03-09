import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import GradientBorder from "examples/GradientBorder";
import VuiInput from "components/VuiInput";
import { useState } from "react";
import { Dialog } from "@mui/material";
import VuiButton from "components/VuiButton";
import { getAccountSubscriptionInfo, validateTransaction } from "services/api";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "app-redux/futures/messageSlice";
import { setPendingTransaction } from "app-redux/futures/transaction";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { setUserSubscription } from "app-redux/futures/userSlice";

function VerifyTransactionHashModal({ open, onClose }) {
  const [transactionHash, setTransactionHash] = useState("");
  const { pendingTransaction } = useSelector((e) => e.transaction);
  const [emptyTransactionHash, setEmptyTransactionHash] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const onChangeTransactionHash = (e) => {
    if (emptyTransactionHash) {
      setEmptyTransactionHash(false);
    }
    setTransactionHash(e.nativeEvent.target.value);
  };

  const onVerify = () => {
    if (pendingTransaction?.id && transactionHash) {
      validateTransaction(pendingTransaction.id, transactionHash)
        .then(({ status, message }) => {
          if (status === -1) {
            // show error
            dispatch(
              setMessage({
                message: message,
                type: "error",
              })
            );
            onClose();
          } else {
            dispatch(
              setMessage({
                message: message,
                type: "success",
              })
            );
            dispatch(setPendingTransaction(null));
            getAccountSubscriptionInfo().then((subscription) => {
              dispatch(setUserSubscription(subscription.data));
            });

            onClose();
            setTimeout(() => {
              history.push("/future");
            }, 1500);
          }
        })
        .catch((err) => {
          onClose();
          dispatch(
            setMessage({
              message: err.message,
              type: "error",
            })
          );
        });
    } else {
      setEmptyTransactionHash(true);
    }
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth>
      <GradientBorder borderRadius={"6"} fullWidth="100%">
        <VuiBox
          component="form"
          role="form"
          borderRadius="inherit"
          p="24px"
          width="420px"
          sx={({ palette: { secondary } }) => ({
            backgroundColor: secondary.focus,
          })}
        >
          <VuiBox justifyContent="center" alignItems="center">
            <VuiTypography textAlign="center" variant="h6" color="white" fontWeight="medium">
              Verify Your Transaction
            </VuiTypography>
            <VuiTypography textAlign="center" variant="caption" color="white" fontWeight="medium">
              Please enter the transaction hash to verify your transaction
            </VuiTypography>
          </VuiBox>
          <VuiTypography textAlign="center" variant="caption" color="white" fontWeight="medium">
            Transaction Hash
          </VuiTypography>
          <VuiBox mt={0.5} mb={2}>
            <GradientBorder
              borderRadius={borders.borderRadius.lg}
              padding="1px"
              backgroundImage={radialGradient(
                palette.gradients.borderLight.main,
                palette.gradients.borderLight.state,
                palette.gradients.borderLight.angle
              )}
            >
              <VuiInput
                placeholder="Enter your transaction hash"
                onChange={onChangeTransactionHash}
                sx={({ typography: { size } }) => ({
                  fontSize: size.sm,
                })}
              />
              {emptyTransactionHash && (
                <VuiTypography variant="caption" color="error">
                  Please enter the transaction hash
                </VuiTypography>
              )}
            </GradientBorder>
          </VuiBox>

          <VuiButton onClick={onVerify} variant="gradient" color="info" fullWidth>
            Verify Transaction
          </VuiButton>
        </VuiBox>
      </GradientBorder>
    </Dialog>
  );
}

export default VerifyTransactionHashModal;
