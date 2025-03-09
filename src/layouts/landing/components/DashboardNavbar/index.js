import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";
import { useVisionUIController, setTransparentNavbar, setMiniSidenav } from "context";

// Images
import { Telegram } from "@mui/icons-material";
import SA_BOT_IMAGE from "assets/images/sabot_ic.png";
import VuiButton from "components/VuiButton";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar } = controller;
  const history = useHistory();
  const [openLearnStrategies, setOpenLearnStrategies] = useState(false);
  const [openBotStrategies, setOpenBotStrategies] = useState(false);
  const [mainActionButtonRound, setMainActionButtonRound] = useState(false);

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }
    setMiniSidenav(dispatch, true);
    setTransparentNavbar(dispatch, false);
    setMainActionButtonRound(true);
    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
      setMainActionButtonRound((fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleOpenTelegram = () => window.open("https://t.me/sabot_official", "_blank");
  const handleCloseLearnStrategies = () => setOpenLearnStrategies(false);
  const handleCloseBotStrategies = () => setOpenBotStrategies(false);

  const handleOpenLearnStrategies = (event) => setOpenLearnStrategies(event.currentTarget);
  const handleOpenBotStrategies = (event) => setOpenBotStrategies(event.currentTarget);

  const openSignIn = () => {
    history.push("/authentication/sign-in");
  };
  const openSignUp = () => {
    history.push("/authentication/sign-up");
  };

  // Render bot strategies menu
  const BotStrategies = () => (
    <Menu
      anchorEl={openBotStrategies}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openBotStrategies)}
      onClose={handleCloseBotStrategies}
      sx={{ mt: 2 }}
    >
      <VuiBox>
        <VuiButton
          target="_blank"
          href="https://en.wikipedia.org/wiki/MACD"
          style={{ justifyContent: "left" }}
          variant="text"
          color="white"
        >
          Depend Upper Histogram (DUH)
        </VuiButton>
      </VuiBox>
      <VuiBox>
        <VuiButton
          target="_blank"
          href="https://en.wikipedia.org/wiki/MACD"
          style={{ justifyContent: "left" }}
          variant="text"
          color="white"
        >
          Follow Bollinger Bands (FBB)
        </VuiButton>
      </VuiBox>
      <VuiBox>
        <VuiButton
          target="_blank"
          href="https://en.wikipedia.org/wiki/MACD"
          style={{ justifyContent: "left" }}
          variant="text"
          color="white"
        >
          Histogram Over Average (HOA)
        </VuiButton>
      </VuiBox>
      <VuiBox>
        <VuiButton
          target="_blank"
          href="https://en.wikipedia.org/wiki/MACD"
          style={{ justifyContent: "left" }}
          variant="text"
          color="white"
        >
          EMA Safe Entry (ESE)
        </VuiButton>
      </VuiBox>
      <VuiBox>
        <VuiButton
          target="_blank"
          href="https://en.wikipedia.org/wiki/MACD"
          style={{ justifyContent: "left" }}
          variant="text"
          color="white"
        >
          Max DCA per SHW
        </VuiButton>
      </VuiBox>
    </Menu>
  );

  // Render learn strategies menu
  const LearnStrategies = () => (
    <Menu
      anchorEl={openLearnStrategies}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openLearnStrategies)}
      onClose={handleCloseLearnStrategies}
      sx={{ mt: 2 }}
    >
      <VuiBox>
        <VuiButton
          target="_blank"
          href="https://en.wikipedia.org/wiki/MACD"
          style={{ justifyContent: "left" }}
          variant="text"
          color="white"
        >
          MACD
        </VuiButton>
      </VuiBox>
      <VuiBox>
        <VuiButton
          target="_blank"
          href="https://en.wikipedia.org/wiki/Bollinger_Bands"
          style={{ justifyContent: "left" }}
          variant="text"
          color="white"
        >
          Bollinger Bands
        </VuiButton>
      </VuiBox>
      <VuiBox>
        <VuiButton
          target="_blank"
          href="https://en.wikipedia.org/wiki/Moving_average"
          style={{ justifyContent: "left" }}
          variant="text"
          color="white"
        >
          EMA
        </VuiButton>
      </VuiBox>
      <VuiBox>
        <VuiButton
          target="_blank"
          href="https://en.wikipedia.org/wiki/Dollar_cost_averaging"
          style={{ justifyContent: "left" }}
          variant="text"
          color="white"
        >
          DCA
        </VuiButton>
      </VuiBox>
    </Menu>
  );

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar
        sx={(theme) => {
          return {
            ...navbarContainer(theme),
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          };
        }}
      >
        <VuiBox
          color="inherit"
          mb={{ xs: 1, md: 0 }}
          sx={(theme) => {
            return {
              ...navbarRow(theme, { isMini }),
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            };
          }}
        >
          {/* SA bot image */}
          <VuiBox
            sx={{
              width: 32,
              height: 32,
              marginRight: 2,
              color: "white",
            }}
            component="img"
            src={SA_BOT_IMAGE}
          />

          <VuiTypography variant="h4" color="white">
            SA Bot
          </VuiTypography>
        </VuiBox>
        <VuiBox
          sx={(theme) => {
            return {
              ...navbarRow(theme, { isMini }),
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            };
          }}
        >
          <VuiBox color={light ? "white" : "inherit"} display="flex" gap={2} alignItems="center">
            <VuiButton
              sx={({ breakpoints }) => ({
                [breakpoints.down("xl")]: {
                  display: "none",
                },
              })}
              onClick={handleOpenBotStrategies}
              variant="text"
              color="white"
            >
              Bot Strategies
            </VuiButton>
            <VuiButton
              sx={({ breakpoints }) => ({
                [breakpoints.down("xl")]: {
                  display: "none",
                },
              })}
              onClick={handleOpenLearnStrategies}
              variant="text"
              color="white"
            >
              Learn Strategies
            </VuiButton>
            <VuiButton
              sx={({ breakpoints }) => ({
                [breakpoints.down("md")]: {
                  display: "none",
                },
              })}
              onClick={openSignIn}
              variant={mainActionButtonRound ? "outlined" : "text"}
              color="white"
              size="small"
            >
              Sign In
            </VuiButton>
            <VuiButton
              sx={({ breakpoints }) => ({
                [breakpoints.down("md")]: {
                  display: "none",
                },
              })}
              onClick={openSignUp}
              variant={mainActionButtonRound ? "outlined" : "text"}
              color="white"
              size="small"
            >
              Sign Up
            </VuiButton>

            <IconButton
              size="small"
              color="inherit"
              sx={navbarMobileMenu}
              onClick={handleMiniSidenav}
            >
              <Icon className={"text-white"}>{miniSidenav ? "menu" : "menu_open"}</Icon>
            </IconButton>
            <IconButton
              size="small"
              color="inherit"
              sx={({ breakpoints }) => ({
                [breakpoints.down("xl")]: {
                  display: "none",
                },
              })}
              onClick={handleOpenTelegram}
            >
              <Telegram style={{ width: 24, height: 24, color: "#25a3e1", marginRight: 6 }} />
              <VuiTypography color="white" variant="button" fontWeight="medium">
                Support
              </VuiTypography>
            </IconButton>

            {BotStrategies()}
            {LearnStrategies()}
          </VuiBox>
        </VuiBox>
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
