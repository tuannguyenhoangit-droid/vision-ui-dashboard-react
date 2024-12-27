/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// prop-types is library for typechecking of props
import PropTypes from "prop-types";
import JSEncrypt from "jsencrypt";
// @mui material components
import Card from "@mui/material/Card";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard React base styles

import GradientBorder from "examples/GradientBorder";
import borders from "assets/theme/base/borders";
import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import { useState } from "react";
import { accountUpdateKeys } from "../../../../services/api";
function ProfileInfoCard({ title, description, info, social }) {
  const labels = [];
  const values = [];

  const [apiKey, setAPIKey] = useState("");
  const [secretKey, setSecretKey] = useState("");

  // Convert this form `objectKey` of the object key in to this `object key`
  Object.keys(info).forEach((el) => {
    if (el.match(/[A-Z\s]+/)) {
      const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/));
      const newElement = el.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);

      labels.push(newElement);
    } else {
      labels.push(el);
    }
  });

  // Push the object values into the values array
  Object.values(info).forEach((el) => values.push(el));

  // Render the card info items
  const renderItems = labels.map((label, key) => (
    <VuiBox key={label} display="flex" py={1} pr={2}>
      <VuiTypography variant="button" color="text" fontWeight="regular" textTransform="capitalize">
        {label}: &nbsp;
      </VuiTypography>
      <VuiTypography variant="button" fontWeight="regular" color="white">
        &nbsp;{values[key]}
      </VuiTypography>
    </VuiBox>
  ));

  const handleEncrypt = async () => {
    const publicKeyPEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA+pIUi+8P+isRC3dM94Yi
pzGzFh4QfCNHSBfmpVTVu6Fx1Nz34sSds0jCcGag/Cngc7WQKV7Nom45uYxe9wGo
N6aRKqwDVe/KpJ0V3BJnIiyGWqo3pUq6pY5Vrzk7iLAhGWUgcIdoCxDFtdWFZinf
a6kvfbZO63jDfJbNn1B9AGq9BQyZhL+MnnqlavbJpTNsUweBssyvlvxwHAwaqtnw
yvsxczqcdZscetZDp14++P6hmccjKap+fpHjsBQG8sXi7yg53vFtSi4XuVGxVv5X
TuMVRuNVF+8KLtG4/Jstt57JE+u7tErK6IKKFAH1+P3YDF5Yck31n107KHjOq7XY
JwIDAQAB
-----END PUBLIC KEY-----
`.trim();

    const dataToEncrypt = `${apiKey}:${secretKey}`;

    // Khởi tạo JSEncrypt với Public Key
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKeyPEM);

    // Mã hóa dữ liệu
    const encryptedData = encryptor.encrypt(dataToEncrypt);
    await accountUpdateKeys(encryptedData);
    console.log("Dữ liệu đã mã hóa:", encryptedData);
  };

  return (
    <Card
      sx={{
        height: "100%",
      }}
    >
      <VuiBox display="flex" mb="14px" justifyContent="space-between" alignItems="center">
        <VuiTypography variant="lg" fontWeight="bold" color="white" textTransform="capitalize">
          {title}
        </VuiTypography>
      </VuiBox>
      <VuiBox>
        <VuiBox mb={2} lineHeight={1}>
          <VuiTypography variant="button" color="text" fontWeight="regular">
            {description}
          </VuiTypography>
        </VuiBox>

        <VuiBox>
          <VuiBox color="white">
            <VuiBox mb={2}>
              <VuiBox mb={1} ml={0.5}>
                <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                  API Key
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
                  placeholder="Enter API Key"
                  value={apiKey}
                  onChange={({ nativeEvent }) => setAPIKey(nativeEvent.target.value)}
                  sx={({ typography: { size } }) => ({
                    fontSize: size.sm,
                  })}
                />
              </GradientBorder>
            </VuiBox>
            <VuiBox mb={0.5}>
              <VuiBox mb={1} ml={0.5}>
                <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                  Secret Key
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
                  placeholder="Enter Secret Key"
                  value={secretKey}
                  onChange={({ nativeEvent }) => setSecretKey(nativeEvent.target.value)}
                  sx={({ typography: { size } }) => ({
                    fontSize: size.sm,
                  })}
                />
              </GradientBorder>
            </VuiBox>
          </VuiBox>
          {renderItems}
        </VuiBox>
        <VuiBox display="flex" mt={1} justifyContent="flex-end">
          <VuiButton onClick={handleEncrypt} color="info">
            SAVE KEY
          </VuiButton>
        </VuiBox>
      </VuiBox>
    </Card>
  );
}

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  social: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProfileInfoCard;
