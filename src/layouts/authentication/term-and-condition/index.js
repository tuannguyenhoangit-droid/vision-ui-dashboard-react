import VuiBox from "components/VuiBox";
import { firebaseApp } from "../../../firebase";
import { getAuth, applyActionCode } from "firebase/auth";
import { useEffect, useState } from "react";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import GradientBorder from "examples/GradientBorder";
import bgSignIn from "assets/images/signUpImage.png";

import borders from "assets/theme/base/borders";
import VuiTypography from "components/VuiTypography";

function TermAndCondition() {

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
      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Introduction
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="white" fontWeight="light">
            Welcome to [Platform Name]. By using this platform, you agree to comply with these
            Terms and Conditions. Please read them carefully before signing up or using any of
            our services.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Purpose of the Platform
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • The platform is designed to assist users in creating strategies for automatic
            trading.
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • Users can link their Binance Futures accounts via API keys to enable automated
            trading.
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • By using this platform, you acknowledge that trading cryptocurrencies carries
            significant risks, and the platform does not provide financial advice.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          User Account and Registration
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • Users can create an account using either a Google account or an email address
            (with verification).
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • By signing up, users agree to provide accurate information and maintain the
            confidentiality of their account credentials.
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • Users are responsible for any activities conducted under their accounts.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          API Key Usage and Security
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • Users are required to link their Binance Futures accounts using API keys with
            "Read" and "Futures Order" permissions. Withdraw permission is neither required nor
            used.
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • API keys are encrypted using RSA during transmission to the server and stored
            securely with AES encryption in our database.
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • Users must whitelist specific IPs provided by the platform and grant restriction
            access to the API keys to use the platform's functionalities.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Subscription Plans
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • The platform offers four subscription tiers. All subscriptions are payable in USDT
            and offer different features, quotas, and pricing.
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • Users can select monthly or yearly payment options based on their requirements.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Risks and Limitations
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • Trading cryptocurrencies involves significant risks, including the potential loss
            of your entire investment.
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • The platform does not guarantee the success of any trading strategy or offer
            financial advice.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Data Security
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • The platform uses advanced encryption methods to ensure the security of your API
            keys and personal data.
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • While we take all necessary precautions, the platform cannot guarantee absolute
            protection against unauthorized access or breaches.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Prohibited Activities
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • Users agree not to use the platform for unlawful activities, share account
            credentials, or attempt to reverse-engineer the platform.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Termination of Services
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • The platform reserves the right to suspend or terminate user accounts for
            violations of these Terms and Conditions. Refunds are not provided for unused
            portions of subscriptions.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Limitation of Liability
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • The platform is not responsible for financial losses, errors, or unauthorized
            transactions resulting from the use of our services.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Amendments
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="text" fontWeight="light">
            • The platform reserves the right to amend these Terms and Conditions at any time.
            Continued use of the platform constitutes acceptance of updated terms.
          </VuiTypography>
        </VuiBox>
      </VuiBox>

      <VuiBox>
        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
          Contact Information
        </VuiTypography>
        <VuiBox>
          <VuiTypography component="label" variant="button" color="white" fontWeight="light">
            For any questions or concerns, please contact us at [support email/phone number].
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </VuiBox>
  );
}

export default TermAndCondition;
