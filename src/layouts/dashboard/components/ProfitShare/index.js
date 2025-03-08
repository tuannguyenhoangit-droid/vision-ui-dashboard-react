import { Card, Dialog } from "@mui/material";
import GradientBorder from "examples/GradientBorder";
import VuiBox from "components/VuiBox";
import { isMobile } from "react-device-detect";
import VuiTypography from "components/VuiTypography";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { Download } from "@mui/icons-material";

export function ProfitShare({ open, onClose = () => null, data = null }) {
  const {
    symbol,
    unRealizedProfit,
    entryPrice,
    markPrice,
    margin,
    notional,
    leverage,
    positionInitialMargin,
    positionAmt,
  } = data || {};

  const handleDownload = () => {
    const container = document.getElementById("profit-share-dialog");
    if (!container) return;
    html2canvas(container, {
      scale: 2,
      useCORS: true, // Enable CORS to allow screenshot of external images
    }).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, [symbol, "-profit-share-", new Date().toISOString(), ".png"].join(""));
      });
    });
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          background: "transparent",
        },
      }}
    >
      <GradientBorder borderRadius={0} fullWidth="100%">
        <Card
          id="profit-share-dialog"
          component="form"
          role="form"
          borderRadius="inherit"
          p="24px"
          width={isMobile ? "100%" : "420px"}
          sx={({ palette: { secondary } }) => ({
            backgroundColor: secondary.focus,
            width: isMobile ? "100%" : "420px",
            borderRadius: 0,
          })}
        >
          <VuiTypography variant="caption" color="white">
            Automatic Trading Platform
          </VuiTypography>
          <VuiTypography variant="h6" color="white">
            SA BOT
          </VuiTypography>
          <VuiBox mt={2} display="flex" alignItems="center" gap="16px" flexDirection="row">
            <VuiTypography
              variant="h6"
              color={parseInt(positionAmt) >= 0 ? "success" : "error"}
              fontWeight="bold"
            >
              {parseInt(positionAmt) >= 0 ? "LONG" : "SHORT"}
            </VuiTypography>
            <VuiTypography color="white" variant="caption" fontWeight="normal">
              |
            </VuiTypography>
            <VuiTypography variant="h6" color="white" fontWeight="bold">
              {[
                Math.abs(
                  Math.round(parseInt(notional) / parseFloat(positionInitialMargin))
                ).toFixed(0),
                "x",
              ].join(" ")}
            </VuiTypography>
            <VuiTypography color="white" variant="caption" fontWeight="normal">
              |
            </VuiTypography>
            <VuiTypography variant="h6" color="white" fontWeight="bold">
              {symbol}
            </VuiTypography>
          </VuiBox>
          <VuiBox mt={1} display="flex" alignItems="center" gap="16px" flexDirection="row">
            <VuiTypography
              variant="h3"
              color={parseFloat(unRealizedProfit) > 0 ? "success" : "error"}
              fontWeight="bold"
            >
              {[
                unRealizedProfit > 0 ? "+" : "",
                ((parseFloat(unRealizedProfit) / parseFloat(positionInitialMargin)) * 100).toFixed(
                  2
                ),
                "%",
              ].join(" ")}
            </VuiTypography>
          </VuiBox>
          <VuiBox mt={1} gap="16px" flexDirection="column">
            <VuiBox display="flex">
              <VuiTypography variant="caption" color="text">
                {["Entry Price", entryPrice].join(": ")}
              </VuiTypography>
            </VuiBox>
            <VuiBox display="flex" mt={0.5}>
              <VuiTypography variant="caption" color="text">
                {["Mark Price", markPrice].join(": ")}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
          <VuiBox mt={2} gap="16px" flexDirection="column">
            <VuiBox display="flex">
              <VuiTypography variant="caption" color="white">
                Connect SA BOT to Binance Account at
              </VuiTypography>
            </VuiBox>
            <VuiBox display="flex" mt={0.5}>
              <VuiTypography variant="caption" color="warning">
                https://beta-sa.okbot.org
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </Card>
      </GradientBorder>
      <VuiBox
        display="flex"
        mt={4}
        gap="16px"
        justifyContent="flex-end"
        style={{ backgroundColor: "transparent" }}
      >
        {/* <FacebookShareButton url="https://beta-sa.okbot.org">
                    <FacebookIcon size={32} />
                </FacebookShareButton>
                <TelegramShareButton url="https://beta-sa.okbot.org">
                    <TelegramIcon size={32} />
                </TelegramShareButton>
                <TwitterShareButton url="https://beta-sa.okbot.org">
                    <TwitterIcon size={32} />
                </TwitterShareButton> */}
        <Download onClick={handleDownload} style={{ color: "white", width: 32, height: 32 }} />
      </VuiBox>
    </Dialog>
  );
}
