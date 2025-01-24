/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/


import typography from "assets/theme/base/typography";


import pxToRem from "assets/theme/functions/pxToRem";

const { size } = typography;

export default {
  styleOverrides: {
    root: {
      padding: pxToRem(16),
      fontSize: size.xl,
    },
  },
};
