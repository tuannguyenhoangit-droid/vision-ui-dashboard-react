/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/


import { Telegram } from "@mui/icons-material";
import { Link } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiButton from "components/VuiButton";
import VuiTypography from "components/VuiTypography";

function Footer() {
  return (
    <VuiBox
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      direction="row"
      component="footer"
      py={2}
      pb={0}
    >
      <VuiBox item xs={12} sx={{ textAlign: "center" }}>
        <VuiTypography
          variant="button"
          sx={{ textAlign: "center", fontWeight: "400 !important" }}
          color="white"
        >
          @ 2021, Made with ❤️&nbsp;&nbsp;&nbsp; by{" "}
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
      <VuiBox item xs={10}>
        <VuiBox mr={1.5}>
          <VuiButton
            component={Link}
            href="https://t.me/sabot_official"
            variant="text"
            target="_blank"
            rel="noreferrer"
            color="white"
          >
            <Telegram style={{ width: 24, height: 24 }} />
            &nbsp; Telegram
          </VuiButton>
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
