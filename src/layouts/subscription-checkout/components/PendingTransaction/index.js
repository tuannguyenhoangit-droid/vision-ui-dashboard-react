
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import linearGradient from "assets/theme/functions/linearGradient";
import colors from "assets/theme/base/colors";
import VuiTypography from "components/VuiTypography";
import { useSelector } from "react-redux";
import { QRCodeSVG } from 'qrcode.react';
import VuiButton from "components/VuiButton";
import { ContentCopy, IceSkating } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { countDown } from "utils";
import { useEffect, useState } from "react";


function PendingTransaction() {
    const { gradients } = colors;
    const { bill } = gradients;
    const { pendingTransaction } = useSelector((e) => e.transaction);

    const [expiredIn, setExpiredIn] = useState(countDown(pendingTransaction.expiredAt));

    useEffect(() => {
        const interval = setInterval(() => {
            setExpiredIn(countDown(pendingTransaction.expiredAt));
        }, 1000);
        return () => clearInterval(interval);
    }, [expiredIn]);


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
                <QRCodeSVG boostLevel marginSize={1} level="H" size={168} value={pendingTransaction.destinationAddress} />
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
                        {['$', pendingTransaction.amount.toFixed(1)].join('')}
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
                        {pendingTransaction.priceType}
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
                        {pendingTransaction.network}
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
                            {pendingTransaction.destinationAddress}
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
                <VuiButton variant="gradient" color="info" fullWidth>
                    Transfered, Verify Payment
                </VuiButton>

                <VuiBox mt={2} display="flex" flexDirection="row" justifyContent="center">
                    {/* count down expired time */}
                    <VuiTypography variant="caption"
                        color="white"
                        fontWeight="normal"
                        textAlign="center">
                        Expired in {expiredIn}
                    </VuiTypography>
                </VuiBox>
            </VuiBox>
        </VuiBox>
        <VuiBox display="flex" flexDirection="row" justifyContent="space-between" width="100%">
            <VuiButton variant="text" color="error" fullWidth>
                Cancel Payment
            </VuiButton>
        </VuiBox>
    </VuiBox>
}

export default PendingTransaction;