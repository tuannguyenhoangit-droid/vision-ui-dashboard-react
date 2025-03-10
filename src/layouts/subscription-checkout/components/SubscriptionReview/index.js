/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";


import VuiBox from "components/VuiBox";
import linearGradient from "assets/theme/functions/linearGradient";
import colors from "assets/theme/base/colors";
import VuiTypography from "components/VuiTypography";
import { useSelector } from "react-redux";


function SubscriptionReview({ selectedNetwork }) {
    const { checkout: { subscription, priceType } } = useSelector((e) => e.subscription);
    const { gradients } = colors;
    const { bill } = gradients;

    return (
        <VuiBox>
            <VuiBox
                component="li"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ background: linearGradient(bill.main, bill.state, bill.deg), border: "1px solid #56577a" }}
                borderRadius="lg"
                p="16px"
                mb={"24px"}
                mt="24px"
            >
                <VuiTypography color="success" variant="h6">
                    {subscription?.name}
                </VuiTypography>
                <VuiTypography color="white" variant="caption">{subscription.description}</VuiTypography>
            </VuiBox>

            <VuiBox
                component="li"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                alignItems="flex-start"
                sx={{ background: linearGradient(bill.main, bill.state, bill.deg), border: "1px solid #56577a" }}
                borderRadius="lg"
                p="16px"
                mb={"24px"}
                mt="24px"
            >
                <VuiBox display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                    <VuiTypography variant="button"
                        color="white"
                        fontWeight="medium"
                        textTransform="capitalize">
                        Total
                    </VuiTypography>
                    <VuiTypography variant="button"
                        color="white"
                        fontWeight="medium"
                        textTransform="capitalize">
                        {['$', (subscription?.prices || []).find(price => price.type === priceType?.type)?.price?.toFixed(1)].join('')}
                    </VuiTypography>
                </VuiBox>

                <VuiBox mt={1} display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                    <VuiTypography variant="button"
                        color="white"
                        fontWeight="medium"
                        textTransform="capitalize">
                        Billing Period
                    </VuiTypography>
                    <VuiTypography variant="button"
                        color="white"
                        fontWeight="medium"
                        textTransform="capitalize">
                        {(subscription?.prices || []).find(price => price.type === priceType?.type)?.description || ""}
                    </VuiTypography>
                </VuiBox>
                <VuiBox mt={1} display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                    <VuiTypography variant="button"
                        color="white"
                        fontWeight="medium"
                        textTransform="capitalize">
                        Payment Method
                    </VuiTypography>
                    <VuiTypography variant="button"
                        color="white"
                        fontWeight="medium"
                        textTransform="capitalize">
                        $USDT (Crypto)
                    </VuiTypography>
                </VuiBox>
                <VuiBox mt={1} display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                    <VuiTypography variant="button"
                        color="white"
                        fontWeight="medium"
                        textTransform="capitalize">
                        Network
                    </VuiTypography>
                    <VuiTypography variant="button"
                        color="white"
                        fontWeight="medium"
                        textTransform="capitalize">
                        {selectedNetwork.name}
                    </VuiTypography>
                </VuiBox>

            </VuiBox>
        </VuiBox>
    );
}

// Setting default values for the props of Bill
SubscriptionReview.defaultProps = {
    noGutter: false,
};

// Typechecking props for the Bill
SubscriptionReview.propTypes = {
    name: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    vat: PropTypes.string.isRequired,
    noGutter: PropTypes.bool,
};

export default SubscriptionReview;
