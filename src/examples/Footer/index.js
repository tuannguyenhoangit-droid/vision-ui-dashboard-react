import { Telegram } from "@mui/icons-material";
import { Link } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiButton from "components/VuiButton";
import VuiTypography from "components/VuiTypography";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Binance from "assets/images/shapes/binance.svg";

function Footer() {
  const history = useHistory();
  return (
    <VuiBox
      display="flex"
      flexDirection={{ xs: "column", md: "row", xl: "row" }}
      justifyContent="space-between"
      direction="row"
      component="footer"
      py={2}
      pb={0}
    >
      <VuiBox item xs={12} md={6} xl={6} sx={{ textAlign: "center" }}>
        <VuiTypography
          variant="button"
          sx={{ textAlign: "center", fontWeight: "400 !important" }}
          color="white"
        >
          @ 2025, Made with ❤️&nbsp;&nbsp;&nbsp; by{" "}
          <VuiTypography
            component="a"
            variant="button"
            href="https://simmmple.com/"
            sx={{ textAlign: "center", fontWeight: "500 !important" }}
            color="white"
            mr="2px"
          >
            SA Trading Bot
          </VuiTypography>
          for automatic trading
        </VuiTypography>
      </VuiBox>
      <VuiBox item xs={6} md={6} xl={6}>
        <VuiTypography variant="button" color="white" fontWeight="medium">Strategy</VuiTypography>
        <VuiBox>
          <VuiButton target="_blank" href="https://en.wikipedia.org/wiki/MACD" style={{ justifyContent: "left" }} variant="text" color="white">MACD</VuiButton>
        </VuiBox>
        <VuiBox>
          <VuiButton target="_blank" href="https://en.wikipedia.org/wiki/Bollinger_Bands" style={{ justifyContent: "left" }} variant="text" color="white">Bollinger Bands</VuiButton>
        </VuiBox>
        <VuiBox>
          <VuiButton target="_blank" href="https://en.wikipedia.org/wiki/Moving_average" style={{ justifyContent: "left" }} variant="text" color="white">EMA</VuiButton>
        </VuiBox>
        <VuiBox>
          <VuiButton target="_blank" href="https://en.wikipedia.org/wiki/Dollar_cost_averaging" style={{ justifyContent: "left" }} variant="text" color="white">DCA</VuiButton>
        </VuiBox>
      </VuiBox>
      <VuiBox item xs={6} md={6} xl={6}>
        <VuiTypography variant="button" color="white" fontWeight="medium">About Us</VuiTypography>
        <VuiBox>
          <VuiButton onClick={() => history.push("/terms-and-conditions")} variant="text" color="white">Terms and Conditions</VuiButton>
        </VuiBox>
        <VuiBox>
          <VuiButton onClick={() => history.push("/privacy-policy")} variant="text" color="white">Privacy Policy</VuiButton>
        </VuiBox>
      </VuiBox>
      <VuiBox item xs={6} md={6} xl={6}>
        <VuiTypography variant="button" color="white" fontWeight="medium">Socials</VuiTypography>
        <VuiBox mr={0}>
          <VuiButton
            component={Link}
            href="https://www.binance.com/vi/square/profile/arkham-teller"
            variant="text"
            target="_blank"
            rel="noreferrer"
            color="white"
          >
            <VuiBox style={{ width: 20, height: 20, marginLeft: 2, marginRight: 4 }} component="img" src={Binance} />
            &nbsp; Binance Square
          </VuiButton>
          <VuiBox>
            <VuiButton
              component={Link}
              href="https://t.me/sabot_official"
              variant="text"
              target="_blank"
              rel="noreferrer"
              color="white"
            >
              <Telegram style={{ width: 24, height: 24, marginRight: 2 }} />
              &nbsp; Telegram
            </VuiButton>
          </VuiBox>

        </VuiBox>
        {/*<VuiBox display="flex" justifyContent="center" flexWrap="wrap" mb={3}>
          <VuiBox mr={{ xs: "20px", lg: "46px" }}>
            <VuiTypography
              component="a"
              href="https://www.creative-tim.com/templates"
              variant="body2"
              color="white"
            >
              Marketplace
            </VuiTypography>
          </VuiBox>
          <VuiBox mr={{ xs: "20px", lg: "46px" }}>
            <VuiTypography
              component="a"
              href="https://www.creative-tim.com/blog/"
              variant="body2"
              color="white"
            >
              Blog
            </VuiTypography>
          </VuiBox>
          <VuiBox>
            <VuiTypography
              component="a"
              href="https://www.creative-tim.com/license"
              variant="body2"
              color="white"
            >
              License
            </VuiTypography>
          </VuiBox>
        </VuiBox> */}
      </VuiBox>
    </VuiBox>
  );
}

export default Footer;
