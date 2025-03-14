import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link } from "react-router-dom";

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

import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import SA_BOT_IMAGE from "assets/images/sabot_ic.png";
// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

import { useVisionUIController, setTransparentNavbar, setMiniSidenav } from "context";

// Images
import logoSpotify from "assets/images/shapes/binance.svg";
import { useDispatch, useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import { Telegram } from "@mui/icons-material";
import { setNotification } from "app-redux/futures/notificationSlice";
import { getExceptionNotification } from "services/api";
import { timeDifference } from "utils";
import VuiButton from "components/VuiButton";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const user = useSelector((state) => state.user);
  const notification = useSelector((state) => state.notification);
  const reduxDispatch = useDispatch();

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
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

  // get initial notification
  useEffect(() => {
    if (notification.data.length === 0) {
      getExceptionNotification(1, 10).then((res) => {
        reduxDispatch(setNotification({ data: res.data, page: res.page }));
      });
    }
  }, []);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleOpenTelegram = () => window.open("https://t.me/sabot_official", "_blank");
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <VuiBox p={2} display="flex" justifyContent="space-between">
        <VuiTypography color="white" variant="h6">
          Notification
        </VuiTypography>
        <VuiButton variant="text"> View more</VuiButton>
      </VuiBox>
      {notification.data.map((item) => (
        <NotificationItem
          image={<img src={logoSpotify} alt="person" />}
          title={[item.error]}
          tradeData={item.queryObject}
          date={timeDifference(item.createdAt)}
          onClick={handleCloseMenu}
        />
      ))}
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
            minHeight: 0,
          };
        }}
      >
        {isMobile ? null : (
          <VuiBox
            color="inherit"
            mb={{ xs: 1, md: 0 }}
            sx={(theme) => ({
              ...navbarRow(theme, { isMini }),
              [theme.breakpoints.down("md")]: {
                display: "none",
              },
            })}
          >
            <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
          </VuiBox>
        )}
        {isMini ? null : (
          <VuiBox sx={(theme) => navbarRow(theme, { isMini })}>
            <VuiBox
              display="flex"
              alignItems="center"
              flexDirection="row"
              sx={({}) => ({
                backgroundColor: "info.main !important",
              })}
            >
              {/* SA bot image */}
              <VuiBox
                sx={({ breakpoints }) => ({
                  width: 24,
                  height: 24,
                  marginRight: 2,
                  color: "white",
                  [breakpoints.up("md")]: {
                    display: "none",
                  },
                })}
                component="img"
                src={SA_BOT_IMAGE}
              />
              <VuiTypography
                sx={({ breakpoints }) => ({
                  [breakpoints.up("md")]: {
                    display: "none",
                  },
                })}
                color="white"
                variant="lg"
              >
                SA Bot
              </VuiTypography>
            </VuiBox>
            <VuiBox color={light ? "white" : "inherit"}>
              <Link to="/profile">
                <IconButton sx={navbarIconButton} size="small">
                  <Icon
                    sx={({ palette: { dark, white } }) => ({
                      color: light ? white.main : dark.main,
                    })}
                  >
                    account_circle
                  </Icon>
                  <VuiTypography
                    variant="button"
                    fontWeight="medium"
                    color={light ? "white" : "dark"}
                    sx={({ breakpoints }) => ({
                      [breakpoints.down("lg")]: {
                        display: "none",
                      },
                    })}
                  >
                    {user.user?.displayName}
                  </VuiTypography>
                </IconButton>
              </Link>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon className={"text-white"}>{miniSidenav ? "menu_open" : "menu"}</Icon>
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                onClick={handleOpenTelegram}
              >
                <Telegram style={{ width: 24, height: 24, color: "#25a3e1" }} />
                {isMobile ? null : (
                  <VuiTypography variant="button" fontWeight="medium">
                    Support
                  </VuiTypography>
                )}
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon className={light ? "text-white" : "text-dark"}>notifications</Icon>
                {notification.data.length > 0 ? (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      width: "15px",
                      height: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                    }}
                  >
                    {notification.data.length}
                  </div>
                ) : null}
              </IconButton>
              {notification.data.length > 0 ? renderMenu() : null}
            </VuiBox>
          </VuiBox>
        )}
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
