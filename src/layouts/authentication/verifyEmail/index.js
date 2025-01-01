import VuiBox from "components/VuiBox";
import { firebaseApp } from "../../../firebase";
import { getAuth, applyActionCode } from "firebase/auth";
import { useEffect, useState } from "react";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import GradientBorder from "examples/GradientBorder";
import bgSignIn from "assets/images/signUpImage.png";

import borders from "assets/theme/base/borders";
import VuiTypography from "components/VuiTypography";

function VerifyEmail() {
  const [message, setMessage] = useState("Verifying...");

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
        } catch (error) {
          console.error("Error verifying email:", error.message);
          setMessage("Invalid or expired verification link.");
        }
      } else {
        setMessage("Invalid request.");
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
      premotto="INSPIRED BY THE FUTURE:"
      motto="THE SA TRADING BOT DASHBOARD"
      cardContent
    >
      <GradientBorder borderRadius={borders.borderRadius.form} minWidth="100%" maxWidth="100%">
        <VuiBox
          component="form"
          role="form"
          borderRadius="inherit"
          p="45px"
          sx={({ palette: { secondary } }) => ({
            backgroundColor: secondary.focus,
          })}
        >
          <VuiTypography>{message}</VuiTypography>
        </VuiBox>
      </GradientBorder>
    </CoverLayout>
  );
}

export default VerifyEmail;
