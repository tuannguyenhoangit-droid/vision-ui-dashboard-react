/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

/** 
  All of the routes for the Vision UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

import Dashboard from "layouts/dashboard";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

import { IoDocument, IoRocketSharp } from "react-icons/io5";
import { IoIosDocument } from "react-icons/io";
import { BsFillPersonFill } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import VerifyEmail from "layouts/authentication/verifyEmail";
import Disclaimer from "layouts/authentication/disclaimer";
import TermAndCondition from "layouts/authentication/term-and-condition";
import Subscription from "layouts/subscription";
import StrategyBuilder from "layouts/agent-creation-wizard/strategy-builder";
import Performance from "layouts/performance-analytics/performance";
import SubscriptionCheckout from "layouts/subscription-checkout";
import SignOut from "layouts/authentication/sign-out";
import Analytics from "layouts/agent-creation-wizard/analytics";
import Recommendation from "layouts/agent-creation-wizard/recommended";
import Landing from "layouts/landing";

const routes = [
  { type: "title", title: "Dashboard", key: "dashboard" },
  {
    type: "collapse",
    name: "Future",
    key: "future",
    route: "/future",
    icon: <IoHome size="15px" color="inherit" />,
    component: Dashboard, // Future
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Spot (Coming Soon)",
    key: "spot",
    route: "/future", // temporary
    icon: <IoHome size="15px" color="inherit" />,
    component: Dashboard, // temporary
    noCollapse: true,
  },
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   route: "/tables",
  //   icon: <IoStatsChart size="15px" color="inherit" />,
  //   component: Tables,
  //   noCollapse: true,
  // },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   route: "/billing",
  //   icon: <BsCreditCardFill size="15px" color="inherit" />,
  //   component: Billing,
  //   noCollapse: true,
  // },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   route: "/rtl",
  //   icon: <IoBuild size="15px" color="inherit" />,
  //   component: RTL,
  //   noCollapse: true,
  // },
  { type: "title", title: "Agent Creation Wizard", key: "agent-creation-wizard" },
  {
    type: "collapse",
    name: "AI Recommended",
    key: "ai-recommended",
    route: "/ai-recommended",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: Recommendation,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Analytics",
    key: "analytics",
    route: "/analytics",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: Analytics,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Strategy Builder",
    key: "strategy-builder",
    route: "/strategy-builder",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: StrategyBuilder,
    noCollapse: true,
  },
  { type: "title", title: "Performance Analytics", key: "performance-analytics" },
  {
    type: "collapse",
    name: "Performance",
    key: "performance-analytics",
    route: "/performance-analytics",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: Performance,
    noCollapse: true,
  },

  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <BsFillPersonFill size="15px" color="inherit" />,
    component: Profile,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Subscription",
    key: "subscription",
    route: "/subscription",
    icon: <BsFillPersonFill size="15px" color="inherit" />,
    component: Subscription,
    noCollapse: true,
  },
  {
    name: "Subscription",
    key: "subscription",
    route: "/subscription/checkout",
    icon: <BsFillPersonFill size="15px" color="inherit" />,
    component: SubscriptionCheckout,
    noCollapse: true,
  },
  {
    name: "Landing",
    key: "landing",
    route: "/",
    icon: <IoIosDocument size="15px" color="inherit" />,
    component: Landing,
    noCollapse: true,
  },
  {
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <IoIosDocument size="15px" color="inherit" />,
    component: SignIn,
    noCollapse: true,
  },
  {
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: SignUp,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Out",
    key: "sign-up",
    route: "/authentication/sign-out",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: SignOut,
    noCollapse: true,
  },
  {
    name: "Verify Email",
    key: "verify-email",
    route: "/authentication/verify-email",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: VerifyEmail,
    noCollapse: true,
  },
  {
    name: "Privacy Policy",
    key: "privacy-policy",
    route: "/privacy-policy",
    icon: <IoDocument size="15px" color="inherit" />,
    component: Disclaimer,
    noCollapse: true,
  },
  {
    name: "Term and Conditions",
    key: "tnc",
    route: "/terms-and-conditions",
    icon: <IoDocument size="15px" color="inherit" />,
    component: TermAndCondition,
    noCollapse: true,
  },
];

export default routes;
