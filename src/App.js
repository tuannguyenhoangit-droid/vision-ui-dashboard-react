/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software.

*/

import { useState, useEffect, useMemo } from "react";

// react-router components
import { Route, Switch, Redirect, useLocation, useHistory } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";


import VuiBox from "components/VuiBox";


import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";


import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";


import routes from "routes";


import { useVisionUIController, setMiniSidenav, setOpenConfigurator } from "context";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebase";
import { setUser } from "./redux/futures/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { userSignIn } from "services/api";

const NO_AUTH_PATHS = ["/disclaimer", "/authentication/email-verify", "/terms-and-conditions"];

export default function App() {
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const history = useHistory();

  const dispatchRedux = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    let unsubscribe = null;
    if (NO_AUTH_PATHS.includes(history.location.pathname)) {
      // do nothing
    } else {
      //
      unsubscribe = auth.onAuthStateChanged(async (user) => {

        if (user) {
          if (user.emailVerified) {
            // sync user latest data
            const signedUser = await userSignIn(
              user.displayName,
              user.email,
              user.uid,
              user.photoURL
            );

            // set user data include keys
            dispatchRedux(setUser(signedUser.data));

            setTimeout(() => {
              history.push("/dashboard");
            }, 1000);
          }
        } else {
          if (!NO_AUTH_PATHS.includes(history.location.pathname)) {
            history.push("/authentication/sign-in");
          }
          dispatchRedux(setUser(null));
        }
      });
    }

    // Cleanup subscription on unmount
    return () => unsubscribe?.();
  }, [history]);

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} component={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <VuiBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="info"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="white"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </VuiBox>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand=""
            brandName="SA Trading Bot"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          {/* {configsButton} */}
        </>
      )}
      {/* {layout === "vr" && <Configurator />} */}
      <Switch>
        {getRoutes(routes)}
        <Redirect from="*" to="/dashboard" />
      </Switch>
    </ThemeProvider>
  );
}
