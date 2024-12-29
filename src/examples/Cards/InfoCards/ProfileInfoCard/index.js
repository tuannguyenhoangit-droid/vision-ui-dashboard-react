/*!

=========================================================
* SA BOT - v1.0.0
=========================================================







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
import { useEffect, useState } from "react";
import { accountUpdateKeys } from "../../../../services/api";
import { PUBLIC_KEY } from "../../../../utils/key";
import { useSelector } from "react-redux";
function ProfileInfoCard({ title, description, info }) {
  const labels = [];
  const values = [];

  const user = useSelector((e) => e.user.user);

  const [apiKey, setAPIKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [editKeys, setEditKeys] = useState(false);

  useEffect(() => {
    if (user?.apiKeyHidden && user?.secretKeyHidden) {
      setEditKeys(false);
      setAPIKey(user.apiKeyHidden);
      setSecretKey(user.secretKeyHidden);
    }
  }, [user]);

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
    const publicKeyPEM = PUBLIC_KEY.trim();

    const dataToEncrypt = `${apiKey}:${secretKey}`;

    // Khởi tạo JSEncrypt với Public Key
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKeyPEM);

    // Mã hóa dữ liệu
    const encryptedData = encryptor.encrypt(dataToEncrypt);
    await accountUpdateKeys(encryptedData);
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
                  disabled={!editKeys}
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
                  disabled={!editKeys}
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
          {editKeys ? (
            <VuiBox display="flex">
              <VuiButton onClick={() => setEditKeys(false)} color="dark">
                CANCEL
              </VuiButton>
              <VuiBox ml={2}>
                <VuiButton onClick={handleEncrypt} color="success">
                  SAVE KEYS
                </VuiButton>
              </VuiBox>
            </VuiBox>
          ) : null}
          {!editKeys ? (
            <VuiButton onClick={() => setEditKeys(true)} color="info">
              CHANGE KEYS
            </VuiButton>
          ) : null}
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
