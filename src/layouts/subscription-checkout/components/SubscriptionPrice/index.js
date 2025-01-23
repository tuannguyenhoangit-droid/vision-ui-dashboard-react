import PropTypes from "prop-types";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import linearGradient from "assets/theme/functions/linearGradient";
import colors from "assets/theme/base/colors";
import { Radio } from "@mui/material";
import VuiBadge from "components/VuiBadge";

function SubscriptionPrice({ name, price, checked, noGutter, onChange, priceDescription }) {
  const { gradients } = colors;
  const { bill } = gradients;

  return (
    <VuiBox
      onClick={onChange}
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{ background: linearGradient(bill.main, bill.state, bill.deg), border: `1px solid ${checked ? colors.primary.main : "#56577a"}` }}
      borderRadius="lg"
      p="12px"
      mb={noGutter ? "0px" : "24px"}
      mt="24px"
    >
      <VuiBox width="100%" display="flex" flexDirection="row" alignItems="center">
        <Radio checked={checked} onClick={onChange} sx={{ "& .MuiSvgIcon-root": { fontSize: 28, fill: checked ? colors.primary.main : "#56577a" } }} />
        <VuiBox display="flex" flexDirection="row" justifyContent="space-between" width="100%">
          <VuiBox ml={1.5}>
            <VuiBox
              display="flex"
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              flexDirection={{ xs: "column", sm: "row" }}
              mb="5px"
            >
              <VuiTypography
                variant="button"
                color="white"
                fontWeight="medium"
                textTransform="capitalize"
              >
                {name}
              </VuiTypography>
            </VuiBox>
            <VuiBox mb={1} lineHeight={0}>
              <VuiTypography
                variant="button" color="text" fontWeight="regular"
              >
                {price}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
          <VuiBox>
            <VuiBadge color="success" variant="contained" badgeContent={priceDescription} />
          </VuiBox>
        </VuiBox>
      </VuiBox>
    </VuiBox>
  );
}

// Setting default values for the props of Bill
SubscriptionPrice.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Bill
SubscriptionPrice.propTypes = {
  name: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  vat: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default SubscriptionPrice;
