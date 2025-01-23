
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import linearGradient from "assets/theme/functions/linearGradient";
import colors from "assets/theme/base/colors";
import VuiTypography from "components/VuiTypography";
import { useDispatch, useSelector } from "react-redux";
import { QRCodeSVG } from 'qrcode.react';
import VuiButton from "components/VuiButton";
import { ContentCopy } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { countDownExpired } from "utils";
import { cancelTransaction } from "../../../../services/api";
import { cancelPendingTransaction } from "../../../../redux/futures/transaction";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


function PendingTransaction() {
    const { gradients } = colors;
    const { bill } = gradients;
    const { pendingTransaction } = useSelector((e) => e.transaction);
    const [expiredIn, setExpiredIn] = useState(countDownExpired(pendingTransaction?.expiredAt));
    const [isExpired, setIsExpired] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        const interval = setInterval(() => {
            setExpiredIn(countDownExpired(pendingTransaction?.expiredAt));
            setIsExpired(pendingTransaction?.expiredAt <= Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, [expiredIn]);


    const handleCancelTransaction = () => {
        if (pendingTransaction?.id) {
            cancelTransaction(pendingTransaction?.id).then(({ status }) => {
                if (status !== -999) { // -999 is the status code for cancel transaction not found
                    // cancel transaction success
                    dispatch(cancelPendingTransaction(pendingTransaction?.id));
                    history.push("/subscription");
                }
            });
        }
    }




    return <VuiBox>
        <VuiBox
            component="li"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            sx={{ background: linearGradient(bill.main, bill.state, bill.deg), border: "1px solid #56577a" }}
            borderRadius="lg"
            p="16px"
            mb={"16px"}
            mt="24px"
        >

            <VuiBox mt={2} mb={2} mx="auto" display="flex" flexDirection="column" alignItems="center">
                <QRCodeSVG boostLevel marginSize={1} level="H" size={168} value={pendingTransaction?.destinationAddress} />
                <VuiBox mt={2} mb={2} >
                    <VuiTypography variant="caption"
                        color="white"
                        fontWeight="medium"
                        textAlign="center"
                    >
                        Scan this QR Code to get destination address or copy it from the text below
                    </VuiTypography>
                </VuiBox>
            </VuiBox>

            <VuiBox ml={2} mr={2} >
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
                        {['$', pendingTransaction?.amount?.toFixed(1)].join('')}
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
                        {pendingTransaction?.priceType}
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
                        {pendingTransaction?.network}
                    </VuiTypography>
                </VuiBox>

                <VuiBox mt={1} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" width="100%">
                    <VuiTypography variant="button"
                        color="white"
                        fontWeight="medium"
                        textTransform="capitalize">
                        Destination Address
                    </VuiTypography>
                    <VuiBox display="flex" flexDirection="row" alignItems="center">
                        <VuiTypography variant="button"
                            color="white"
                            fontWeight="medium"
                            textTransform="capitalize">
                            {pendingTransaction?.destinationAddress}
                        </VuiTypography>
                        <ContentCopy style={{ marginLeft: 8 }} color="white" />
                    </VuiBox>
                </VuiBox>
            </VuiBox>
            <VuiBox mt={4} mb={2}>
                <VuiBox mb={2} display="flex" flexDirection="row" justifyContent="center">
                    <VuiTypography variant="caption"
                        color="warning"
                        fontWeight="normal"
                        textAlign="center">
                        Once you have transferred, click the button below to verify
                    </VuiTypography>
                </VuiBox>
                <VuiButton disabled={isExpired} variant="gradient" color="info" fullWidth>
                    Transfered, Verify Payment
                </VuiButton>

                <VuiBox mt={2} display="flex" flexDirection="row" justifyContent="center">
                    {/* count down expired time */}
                    <VuiTypography variant="caption"
                        color="white"
                        fontWeight="normal"
                        textAlign="center">
                        {expiredIn}
                    </VuiTypography>
                </VuiBox>
            </VuiBox>
        </VuiBox>
        <VuiBox display="flex" flexDirection="row" justifyContent="space-between" width="100%">
            <VuiButton onClick={handleCancelTransaction} variant="text" color="error" fullWidth>
                Cancel Payment
            </VuiButton>
        </VuiBox>
    </VuiBox>
}

export default PendingTransaction;