import VuiBox from "components/VuiBox";
import { firebaseApp } from "../../../firebase";
import { getAuth, applyActionCode } from "firebase/auth";
import { useEffect, useState } from "react";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import GradientBorder from "examples/GradientBorder";
import bgSignIn from "assets/images/signUpImage.png";

import borders from "assets/theme/base/borders";
import VuiTypography from "components/VuiTypography";

function Disclaimer() {

  return (

    <VuiBox
      component="form"
      role="form"
      borderRadius="inherit"
      p="45px"
      width="100%"
      sx={({ palette: { secondary } }) => ({
        backgroundColor: secondary.focus,
      })}
    >
      <VuiBox mb={2}>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
            Welcome to SA Trading Bot!
          </VuiTypography>
        </VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Before proceeding with the registration process, please carefully read and acknowledge
          the following:
        </VuiTypography>
      </VuiBox>
      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Purpose of the Platform
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            This platform is designed to assist users in creating strategies for automatic
            trading.
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            Users can link their Binance Futures accounts via API keys to enable automated
            trading.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          API Key Permissions
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            The API keys you provide are strictly used for trading purposes only.
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            We only require "Read" and "Futures Order" permissions. Withdraw permission is not
            required or used.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Data Security
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            Your API keys are encrypted using RSA during transmission to our servers.
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            Once received, the keys are securely stored using AES encryption in our database.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          IP Whitelisting
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            To call the Binance REST API, users must whitelist specific IPs provided by our
            platform and grant restriction access to their API keys. Failure to do so may result
            in limited functionality.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Account Creation and Access
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            You can create an account using either a Google account or an email address with
            verification.
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            By signing up, you agree to comply with our Terms of Service and Privacy Policy.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Risks and Responsibilities
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            Trading cryptocurrencies involves significant risk. The value of digital assets can
            be highly volatile, and you may lose all or part of your investment.
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            The platform does not provide financial advice. Any strategies or trades executed
            using this platform are at your own discretion and risk.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Limitation of Liability
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            While we take all necessary precautions to ensure the security of your data and API
            keys, we cannot guarantee complete protection against unauthorized access or
            breaches.
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="white" fontWeight="light">
            By using this platform, you acknowledge that SA Trading Bot is not responsible for
            any financial losses, errors, or unauthorized transactions resulting from the use of
            our services.
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </VuiBox>

  );
}

export default Disclaimer;
