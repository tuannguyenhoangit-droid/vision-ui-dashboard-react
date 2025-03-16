import { Card, Dialog } from "@mui/material";
import GradientBorder from "examples/GradientBorder";
import VuiBox from "components/VuiBox";
import { isMobile } from "react-device-detect";
import VuiTypography from "components/VuiTypography";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import ProfitTexture from "assets/images/profit-texture.png";
import { Download } from "@mui/icons-material";
import SA_BOT_IMAGE from "assets/images/sabot_ic.png";
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
    const container = document.getElementById("profit-share-dialog2");
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
          component="form"
          role="form"
          id="profit-share-dialog2"
          width={isMobile ? "100%" : "420px"}
          sx={({ palette: { secondary } }) => ({
            backgroundColor: secondary.focus,
            width: isMobile ? "100%" : "420px",
            borderRadius: 0,
            padding: "24px",
          })}
        >
          <VuiBox
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: -999,
              opacity: 0.368,
              width: "100%",
              height: "100%",
            }}
            component="img"
            src={ProfitTexture}
            width="100%"
            height="100%"
          />
          <VuiBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row"
          >
            <VuiBox>
              <VuiTypography fontWeight="bold" variant="body2" color="primary">
                Automated Trading Platform
              </VuiTypography>
              <VuiTypography variant="h6" color="white">
                SA BOT
              </VuiTypography>
            </VuiBox>
            <VuiBox
              component="img"
              src={SA_BOT_IMAGE}
              sx={{
                width: 32,
                height: 32,
                marginRight: 2,
                color: "white",
              }}
            />
          </VuiBox>
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
