/*!

=========================================================
* SA BOT - v1.0.0
=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useState } from "react";
import JSEncrypt from "jsencrypt";
// react-router-dom components
import { Link } from "react-router-dom";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import VuiSwitch from "components/VuiSwitch";
import GradientBorder from "examples/GradientBorder";

// Vision UI Dashboard assets
import radialGradient from "assets/theme/functions/radialGradient";
import rgba from "assets/theme/functions/rgba";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgSignIn from "assets/images/signUpImage.png";
import { PUBLIC_KEY } from "../../../utils/key";
import { accountSignUp } from "../../../services/api";
import { firebaseApp } from "../../../firebase";
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const [data, setData] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const onChange = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const onSubmit = async () => {
    console.log("data", data);

    try {
      if (data.displayName && data.email && data.password) {
        setLoading(true);
        const publicKeyPEM = PUBLIC_KEY.trim();
        // Khởi tạo JSEncrypt với Public Key
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(publicKeyPEM);

        // Mã hóa dữ liệu
        const passwordEncrypted = encryptor.encrypt(data.password);

        const result = await accountSignUp(data.displayName, data.email, passwordEncrypted);
        const auth = getAuth(firebaseApp);
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user, {
          url: "https://sa-bot.web.app/dashboard",
        });
        setLoading(false);
      } else {
        // TODO
        console.log("Params missing");
      }
    } catch (e) {
      console.log("sign up submit", e);
    }
  };

  return (
    <CoverLayout
      title="Welcome!"
      color="white"
      description="Use these awesome forms to login or create new account in your project for free."
      image={bgSignIn}
      premotto="INSPIRED BY THE FUTURE:"
      motto="THE SA BOT DASHBOARD"
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
          <VuiBox mb={2}>
            <VuiBox mb={1} ml={0.5}>
              <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                Name
              </VuiTypography>
            </VuiBox>
            <GradientBorder
              minWidth="100%"
              borderRadius={borders.borderRadius.lg}
              padding="1px"
              backgroundImage={radialGradient(
                palette.gradients.borderLight.main,
                palette.gradients.borderLight.state,
                palette.gradients.borderLight.angle
              )}
            >
              <VuiInput
                placeholder="Your full name..."
                value={data.displayName}
                onChange={(e) => onChange("displayName", e.nativeEvent.target.value)}
                sx={({ typography: { size } }) => ({
                  fontSize: size.sm,
                })}
              />
            </GradientBorder>
          </VuiBox>
          <VuiBox mb={2}>
            <VuiBox mb={1} ml={0.5}>
              <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                Email
              </VuiTypography>
            </VuiBox>
            <GradientBorder
              minWidth="100%"
              borderRadius={borders.borderRadius.lg}
              padding="1px"
              backgroundImage={radialGradient(
                palette.gradients.borderLight.main,
                palette.gradients.borderLight.state,
                palette.gradients.borderLight.angle
              )}
            >
              <VuiInput
                type="email"
                placeholder="Your email..."
                value={data.email}
                onChange={(e) => onChange("email", e.nativeEvent.target.value)}
                sx={({ typography: { size } }) => ({
                  fontSize: size.sm,
                })}
              />
            </GradientBorder>
          </VuiBox>
          <VuiBox mb={2}>
            <VuiBox mb={1} ml={0.5}>
              <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                Password
              </VuiTypography>
            </VuiBox>
            <GradientBorder
              minWidth="100%"
              borderRadius={borders.borderRadius.lg}
              padding="1px"
              backgroundImage={radialGradient(
                palette.gradients.borderLight.main,
                palette.gradients.borderLight.state,
                palette.gradients.borderLight.angle
              )}
            >
              <VuiInput
                type="password"
                placeholder="Your password..."
                value={data.password}
                onChange={(e) => onChange("password", e.nativeEvent.target.value)}
                sx={({ typography: { size } }) => ({
                  fontSize: size.sm,
                })}
              />
            </GradientBorder>
          </VuiBox>
          <VuiBox display="flex" alignItems="center">
            <VuiSwitch color="info" checked={rememberMe} onChange={handleSetRememberMe} />
            <VuiTypography
              variant="caption"
              color="white"
              fontWeight="medium"
              onClick={handleSetRememberMe}
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;Remember me
            </VuiTypography>
          </VuiBox>
          <VuiBox mt={4} mb={1}>
            <VuiButton onClick={onSubmit} color="info" fullWidth>
              SIGN UP
            </VuiButton>
          </VuiBox>
          <VuiBox mt={3} textAlign="center">
            <VuiTypography variant="button" color="text" fontWeight="regular">
              Already have an account?{" "}
              <VuiTypography
                component={Link}
                to="/authentication/sign-in"
                variant="button"
                color="white"
                fontWeight="medium"
              >
                Sign in
              </VuiTypography>
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </GradientBorder>
    </CoverLayout>
  );
}

export default SignIn;
