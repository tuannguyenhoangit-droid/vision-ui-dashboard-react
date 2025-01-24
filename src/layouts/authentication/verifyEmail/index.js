import { firebaseApp } from "../../../firebase";
import { getAuth, applyActionCode } from "firebase/auth";
import { useEffect, useState } from "react";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgSignIn from "assets/images/signUpImage.png";
import { Alert } from "@mui/material";
import VuiButton from "components/VuiButton";
import VuiBox from "components/VuiBox";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

function VerifyEmail() {
  const [message, setMessage] = useState("Verifying...");
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode");
      const oobCode = params.get("oobCode");

      if (mode === "verifyEmail" && oobCode) {
        try {
          const auth = getAuth(firebaseApp);
          await applyActionCode(auth, oobCode); // Verify the oobCode
          setMessage("Email verified successfully! You can now log in.");
          setSuccess(true);
        } catch (error) {
          setMessage("Invalid or expired verification link.");
          setSuccess(false);
        }
      } else {
        setMessage("Invalid request.");
        setSuccess(false);
      }
    };
    verifyEmail();
  }, []);

  return (
    <CoverLayout
      title="Verify Email"
      color="white"
      description={"The email need to be verified before access SA Trading Bot"}
      image={bgSignIn}
      premotto="AGENT AI FOR TRADING"
      motto="THE SA TRADING BOT DASHBOARD"
      cardContent
    >
      <Alert
        sx={{
          borderColor: success ? "#0075ff" : "#f6ad55",
          borderRadius: 4,
          fontSize: 14,
          fontWeight: "medium",
          alignItems: "center",
        }}
        variant="outlined"
        severity={success ? "success" : "warning"}
      >
        {message}
      </Alert>
      {!success && <VuiBox mt={3} textAlign="center">
        <VuiButton circular variant="gradient" onClick={() => history.push("/authentication/sign-in")} color="info" fullWidth>
          SIGN IN NOW
        </VuiButton>
      </VuiBox>}
    </CoverLayout>
  );
}

export default VerifyEmail;
