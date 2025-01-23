

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Checkbox, Link, Step, StepLabel, Stepper } from "@mui/material";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
// Images
import profile1 from "assets/images/profile-1.png";
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Overview page components
import { useEffect, useState } from "react";
import { createTransaction, getPaymentConfigs, getPendingTransaction } from "../../services/api";
import { useHistory } from "react-router-dom";

import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import SubscriptionPrice from "./components/SubscriptionPrice";
import SelectNetwork from "./components/SelectNetwork";
import Divider from '@mui/material/Divider';
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import SubscriptionReview from "./components/SubscriptionReview";
import { BsPencilSquare } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../redux/futures/messageSlice";
import { checkoutPriceType } from "../../redux/futures/subscription";
import { setPendingTransaction } from "../../redux/futures/transaction";
import PendingTransaction from "./components/PendingTransaction";
import VerifyTransactionHashModal from "./components/VerifyTransactionHashModal";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: "linear-gradient( 95deg, #125688 0%, #55acee 50%, #0077b5 100%)",
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: "linear-gradient( 95deg, #0077b5 0%, #55acee 50%, #125688 100%)",
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: "#eaeaf0",
        borderRadius: 1,
        ...theme.applyStyles("dark", {
            backgroundColor: theme.palette.grey[800],
        }),
    },
}));

const ColorlibStepIconRoot = styled("div")(({ theme }) => ({
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...theme.applyStyles("dark", {
        backgroundColor: theme.palette.grey[700],
    }),
    variants: [
        {
            props: ({ ownerState }) => ownerState.active,
            style: {
                backgroundImage: "linear-gradient( 136deg, #2d8cfc 0%, #2d8cfc 50%, #2d8cfc 100%)",
                boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
            },
        },
        {
            props: ({ ownerState }) => ownerState.completed,
            style: {
                backgroundImage: "linear-gradient( 136deg, #0f4a91 0%, #0f4a91 50%, #0f4a91 100%)",
            },
        },
        {
            props: ({ ownerState }) => !ownerState.completed && !ownerState.active,
            style: {
                backgroundImage: "linear-gradient( 136deg, #0f4a91 0%, #0f4a91 50%, #0f4a91 100%)",
            },
        },
    ],
}));

const steps = ["Subscription", "Payment", "Verify"];

function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
        1: <SettingsIcon />,
        2: <GroupAddIcon />,
        3: <VideoLabelIcon />,
    };

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}

ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
};



function SubscriptionCheckout({ location }) {
    const { data, checkout: { subscription, priceType } } = useSelector((e) => e.subscription);
    const { pendingTransaction } = useSelector((e) => e.transaction);
    const dispatch = useDispatch();

    const [currentStep, setCurrentStep] = useState(0);

    const [paymentConfig, setPaymentConfig] = useState([]);
    const [selectedPaymentConfig, setSelectedPaymentConfig] = useState({});
    const [showVerifyTransactionHashModal, setShowVerifyTransactionHashModal] = useState(false);


    const history = useHistory();

    useEffect(() => {
        if (pendingTransaction === null) {
            getPaymentConfigs().then((paymentConfig) => {
                if (paymentConfig?.data?.length > 0) {
                    setPaymentConfig(paymentConfig.data);
                    setSelectedPaymentConfig(paymentConfig.data[0]);
                } else {
                    dispatch(setMessage({
                        message: paymentConfig.message,
                        type: 'warning'
                    }))
                }
            });
        } else {
            setCurrentStep(1)
        }
    }, [pendingTransaction]);

    const onCreateTransaction = () => {
        console.log('selectedPaymentConfig', selectedPaymentConfig);
        console.log('priceType', priceType);
        console.log('subscription', subscription);

        // validate params

        if (!subscription?.id || !selectedPaymentConfig?.network || !priceType?.type) {
            return dispatch(setMessage({
                message: 'Invalid payment config',
                type: "warning"
            }))
        }

        // create transaction
        createTransaction(subscription.id, selectedPaymentConfig.network, priceType.type).then((response) => {
            dispatch(setPendingTransaction(response.data))
        });


    }



    return <DashboardLayout>
        <Card>
            <Grid container spacing={3} mb="30px" alignItems="center" alignSelf="center">
                <Grid xs={12} md={12} xl={12} >
                    <Stepper
                        sx={({ }) => ({
                            marginTop: 2,
                            marginBottom: 4,
                            marginLeft: 0,
                            marginRight: 0,
                        })}
                        activeStep={currentStep}
                        connector={<ColorlibConnector />}
                        alternativeLabel
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>

                {currentStep === 0 ? <Grid container xs={12} md={12} xl={12}>
                    <Grid xs={12} md={6} xl={6} >
                        <VuiBox ml={4} mr={4}>
                            <VuiBox>
                                <VuiBox display="flex" flexDirection="row" justifyContent="space-between">
                                    <VuiTypography component="label" variant="h5" color="white" fontWeight="medium">
                                        1. Choose a plan
                                    </VuiTypography>
                                    <VuiTypography component="label" variant="h5" color="success" fontWeight="medium">
                                        {subscription?.name}
                                        <BsPencilSquare style={{ marginLeft: 10 }} onClick={() => { history.goBack() }} color="white" cursor="pointer" />
                                    </VuiTypography>
                                </VuiBox>
                                {(subscription?.prices || []).map((price) => {
                                    console.log(priceType?.type, price.type);
                                    return (
                                        <SubscriptionPrice
                                            name={price.type}
                                            price={[`$${price.price.toFixed(1)}`, "for", price.description].join(" ")}
                                            priceDescription={price.discountDescription}
                                            checked={priceType?.type === price.type}
                                            noGutter
                                            onChange={() => dispatch(checkoutPriceType(price))}
                                        />
                                    )
                                })}
                            </VuiBox>
                            <VuiBox mt={4}>
                                <VuiTypography component="label" variant="h5" color="white" fontWeight="medium">
                                    2. Payment Options
                                </VuiTypography>
                                <SubscriptionPrice
                                    name={"Crypto"}
                                    price={"Currently only crypto is supported"}
                                    checked={true}
                                    noGutter
                                />
                                <VuiBox mt={2} >
                                    {selectedPaymentConfig?.network ? <SelectNetwork paymentConfigs={paymentConfig} onChange={() => { }} selectedItem={selectedPaymentConfig?.network} /> : null}
                                </VuiBox>
                            </VuiBox>
                        </VuiBox>
                    </Grid>
                    <Grid xs={12} md={1} xl={1} alignItems="center">
                        <Divider style={{
                            backgroundColor: "white",
                            margin: "auto"
                        }} orientation="vertical" flexItem />
                    </Grid>
                    <Grid xs={12} md={5} xl={5}>
                        <VuiBox ml={4} mr={4}>
                            <VuiTypography component="label" variant="h5" color="white" fontWeight="medium">
                                3. Promotion Code
                            </VuiTypography>

                            <VuiBox mt={3} display="flex" flexDirection="row" gap={2}>
                                <VuiInput placeholder="Enter your promotion code" />
                                <VuiButton color="info">Apply</VuiButton>
                            </VuiBox>

                        </VuiBox>
                        <VuiBox ml={4} mr={4} mt={4}>
                            <VuiTypography component="label" variant="h5" color="white" fontWeight="medium">
                                4. Review
                            </VuiTypography>

                            <SubscriptionReview selectedNetwork={selectedPaymentConfig} />

                        </VuiBox>
                        <VuiBox ml={4} mr={4}>
                            <VuiButton onClick={onCreateTransaction} color="info" fullWidth>Continue With Crypto</VuiButton>

                            <VuiBox mt={3} textAlign="center">
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 24, fill: "#d6e6e6" } }}
                                    color="success"
                                    defaultChecked={true}
                                    checked={true}
                                />
                                <VuiTypography variant="button" color="text" fontWeight="regular">
                                    By continuing payment for subscription, I agree with the{" "}
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
                                        Privacy Policy
                                    </VuiTypography>
                                    {" "}
                                    of SA Trading Bot platform.
                                </VuiTypography>
                            </VuiBox>
                        </VuiBox>
                    </Grid>
                </Grid> : null}
                {currentStep === 1 ? <Grid container xs={12} md={12} xl={12} justifyContent={"center"}>
                    <Grid xs={12} md={8} xl={6}>
                        <PendingTransaction onVerify={() => { setShowVerifyTransactionHashModal(true) }} />
                    </Grid>
                </Grid> : null}

                <VerifyTransactionHashModal open={showVerifyTransactionHashModal} onClose={() => { setShowVerifyTransactionHashModal(false) }} />
            </Grid>
        </Card>
    </DashboardLayout>
}

export default SubscriptionCheckout;
