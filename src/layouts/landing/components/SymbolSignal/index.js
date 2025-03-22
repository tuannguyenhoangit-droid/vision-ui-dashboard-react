import { Card } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiButton from "components/VuiButton";
import VuiTypography from "components/VuiTypography";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useHistory } from "react-router-dom";

function SymbolSignal({ title, description, profitIn, data = [], type }) {
  const history = useHistory();

  if (data.length === 0) {
    return <div />;
  }
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 7,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <VuiBox mt={6}>
      <VuiTypography
        style={{
          textAlign: "center",
        }}
        variant="h6"
        color="white"
      >
        {title}
      </VuiTypography>
      <VuiTypography
        style={{
          textAlign: "center",
        }}
        variant="body2"
        color="text"
      >
        {description}
      </VuiTypography>
      <VuiBox mt={3}>
        <Carousel
          responsive={responsive}
          // key={activeItem}
          // onChange={handleChange}
          itemClass="carousel-item-padding-10-px"
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          centerMode={true}
          customLeftArrow={<div />}
          customRightArrow={<div />}
        >
          {data.map((item) => (
            <VuiBox ml={1} mr={1}>
              <Card style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }} key={item.symbol}>
                <VuiBox
                  display="flex"
                  justifyContent="space-between"
                  flexDirection="column"
                  alignItems="center"
                >
                  <VuiTypography
                    sx={{
                      textAlign: "center",
                    }}
                    color={item.signal === "BUY" ? "success" : "error"}
                    variant="body2"
                  >
                    {item.signal}
                  </VuiTypography>
                  <VuiTypography
                    sx={{
                      textAlign: "center",
                    }}
                    color="primary"
                    variant="body2"
                  >
                    {item.symbol.replace("USDT", "")}
                  </VuiTypography>
                  <VuiTypography
                    sx={{
                      textAlign: "center",
                    }}
                    mt={1}
                    color="white"
                    variant="caption"
                  >
                    {["Confi ", (item.result.confidence || 0).toFixed(0), "%"].join("")}
                  </VuiTypography>
                  <VuiTypography
                    sx={{
                      textAlign: "center",
                    }}
                    mt={0.5}
                    color="dark"
                    variant="caption"
                  >
                    {profitIn}
                  </VuiTypography>
                  <VuiBox mt={1}>
                    <VuiButton
                      onClick={() => history.push("/ai-recommended")}
                      size="small"
                      variant="contained"
                      color={item.signal === "BUY" ? "success" : "error"}
                    >
                      Run Bot
                    </VuiButton>
                  </VuiBox>
                </VuiBox>
              </Card>
            </VuiBox>
          ))}
        </Carousel>
      </VuiBox>
    </VuiBox>
  );
}

export default SymbolSignal;
