/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/


import colors from "assets/theme/base/colors";


import pxToRem from "assets/theme/functions/pxToRem";

const { transparent } = colors;

export default {
  styleOverrides: {
    root: {
      margin: `${pxToRem(48)} 0`,
      padding: `0 ${pxToRem(12)}`,

      "&.MuiPaper-root": {
        backgroundColor: transparent.main,
      },
    },
  },
};
