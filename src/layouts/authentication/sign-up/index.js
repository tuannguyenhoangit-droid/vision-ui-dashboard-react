/*!

=========================================================

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
import GradientBorder from "examples/GradientBorder";

// Vision UI Dashboard assets
import radialGradient from "assets/theme/functions/radialGradient";
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
import { Checkbox } from "@mui/material";
import { setMessage } from "../../../redux/futures/messageSlice";
import { useDispatch } from "react-redux";

function SignUp() {
  const [data, setData] = useState({
    displayName: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const onChange = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const onSubmit = async () => {
    try {
      if (data.displayName && data.email && data.password) {
        setLoading(true);
        const publicKeyPEM = PUBLIC_KEY.trim();
        // Khởi tạo JSEncrypt với Public Key
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(publicKeyPEM);

        // Mã hóa dữ liệu
        const passwordEncrypted = encryptor.encrypt(data.password);

        const { status, message } = await accountSignUp(data.displayName, data.email, passwordEncrypted);
        const auth = getAuth(firebaseApp);
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;

        if (status === 1) {
          // Send verification email
          await sendEmailVerification(user, {
            url: "https://sa-bot.web.app/dashboard",
          });
        }


        dispatch(setMessage({
          message: message,
          type: status === 1 ? "success" : "warning",
        }));
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
      description="Complete below form to be user of SA Trading Bot Platform"
      image={bgSignIn}
      premotto="INSPIRED BY THE FUTURE:"
      motto="THE SA TRADING BOT DASHBOARD"
      cardContent
      top={3}
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

          <VuiBox mt={4} mb={1}>
            <VuiButton onClick={onSubmit} color="info" fullWidth>
              SIGN UP
            </VuiButton>
          </VuiBox>
          <VuiBox mt={3} textAlign="center">
            <Checkbox
              sx={{ "& .MuiSvgIcon-root": { fontSize: 24, fill: "#d6e6e6" } }}
              color="success"
              defaultChecked={true}
              checked={true}
            />
            <VuiTypography variant="button" color="text" fontWeight="regular">
              By signing-up to SA Trading Bot platform, I agree with the{" "}
              <VuiTypography
                component={Link}
                to="/terms-and-conditions"
                variant="button"
                color="white"
                fontWeight="medium"
              >
                Terms and Conditions
              </VuiTypography>
              {" and "}
              <VuiTypography
                component={Link}
                to="/disclaimer"
                variant="button"
                color="white"
                fontWeight="medium"
              >
                Disclaimer
              </VuiTypography>
            </VuiTypography>
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

export default SignUp;
