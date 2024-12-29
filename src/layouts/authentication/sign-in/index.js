/*!

=========================================================
* SA BOT - v1.0.0
=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useState } from "react";

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
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import VuiAvatar from "components/VuiAvatar";
// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";
import Alert from "@mui/material/Alert";

// Images
import bgSignIn from "assets/images/signInImage.png";
import googleImage from "assets/images/logos/google.png";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseApp } from "../../../firebase";

import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/futures/messageSlice";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { setUser } from "../../../redux/futures/userSlice";
import { userSignIn } from "../../../services/api";

const auth = getAuth(firebaseApp);

const provider = new GoogleAuthProvider();

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const [data, setData] = useState({ email: "", password: "" });

  const dispatch = useDispatch();
  const history = useHistory();

  const onChange = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // success
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const handleSignInWithPassword = async () => {
    if (data.email && data.password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        if (user.emailVerified) {
          // sync user latest data
          const signedUser = await userSignIn(
            user.displayName,
            user.email,
            user.uid,
            user.photoURL
          );
          // set user data include keys
          dispatch(setUser(signedUser.data));
          dispatch(
            setMessage({
              message: "Success",
            })
          );

          setTimeout(() => {
            history.push("/dashboard");
          }, 1000);
        } else {
          dispatch(
            setMessage({
              message: "You need to verify email before login!",
              type: "error",
            })
          );
        }
      } catch (e) {
        dispatch(
          setMessage({
            message: "Email or Password is incorrect!",
            type: "error",
          })
        );
      }
    } else {
      dispatch(
        setMessage({
          message: "Please enter both email and password!",
          type: "error",
        })
      );
    }
  };

  return (
    <CoverLayout
      title="Nice to see you!"
      color="white"
      description="Enter your email and password to sign in"
      premotto="INSPIRED BY THE FUTURE:"
      motto="THE SA BOT DASHBOARD"
      image={bgSignIn}
    >
      <VuiBox component="form" role="form">
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
              Email
            </VuiTypography>
          </VuiBox>
          <GradientBorder
            minWidth="100%"
            padding="1px"
            borderRadius={borders.borderRadius.lg}
            backgroundImage={radialGradient(
              palette.gradients.borderLight.main,
              palette.gradients.borderLight.state,
              palette.gradients.borderLight.angle
            )}
          >
            <VuiInput
              onChange={({ nativeEvent }) => onChange("email", nativeEvent.target.value)}
              value={data.email}
              type="email"
              placeholder="Your email..."
              fontWeight="500"
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
              onChange={({ nativeEvent }) => onChange("password", nativeEvent.target.value)}
              value={data.password}
              placeholder="Your password..."
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
        <VuiBox mt={4} mb={1} alignItems="center">
          <VuiButton circular onClick={handleSignInWithPassword} color="info" fullWidth>
            Sign In with Account
          </VuiButton>
          <VuiBox display="flex" alignItems="center" justifyContent="center" mt={2} mb={2}>
            <div
              style={{
                height: 1,
                background: "white",
                width: "60px",
                marginRight: 6,
              }}
            />
            <VuiTypography color="white" variant="button">
              OR
            </VuiTypography>
            <div
              style={{
                height: 1,
                background: "white",
                width: "60px",
                marginLeft: 6,
              }}
            />
          </VuiBox>
          <VuiButton circular variant="contained" onClick={handleSignIn} color="black" fullWidth>
            <VuiAvatar src={googleImage} alt="name" size="xs" />
            <VuiTypography color="white" ml={2} variant="button">
              Sign In with Google
            </VuiTypography>
          </VuiButton>
        </VuiBox>
        <VuiBox mt={3} textAlign="center">
          <VuiTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <VuiTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="white"
              fontWeight="medium"
            >
              Sign up
            </VuiTypography>
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </CoverLayout>
  );
}

export default SignIn;
