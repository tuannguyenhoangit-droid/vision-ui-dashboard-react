import { useState, useEffect } from "react";
// react-router components
import { Route, Switch, Redirect, useLocation, useHistory } from "react-router-dom";
// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "examples/Sidenav";
import theme from "assets/theme";
import routes from "routes";
import { useVisionUIController, setMiniSidenav } from "context";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebase";
import { setUser } from "./app-redux/futures/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { userSignIn } from "services/api";

const NO_AUTH_PATHS = [
  "/privacy-policy",
  "/authentication/verify-email",
  "/terms-and-conditions",
  "/",
];

export default function App() {
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, direction, layout, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const history = useHistory();
  const currentUser = useSelector((state) => state.user);

  const dispatchRedux = useDispatch();

  useEffect(() => {
    let unsubscribe = null;
    if (NO_AUTH_PATHS.some((path) => history.location.pathname === path)) {
      // do nothing
    } else {
      //
      const auth = getAuth(firebaseApp);
      unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          if (user.emailVerified && currentUser?.user === null) {
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
              history.push("/future");
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
  }, [history.location.pathname]);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {layout === "dashboard" && !NO_AUTH_PATHS.includes(history.location.pathname) && (
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
        <Redirect from="*" to="/future" />
      </Switch>
    </ThemeProvider>
  );
}
