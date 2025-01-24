/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/


import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

const { grey, text, info } = colors;
const { size } = typography;

export default {
  styleOverrides: {
    li: {
      lineHeight: 0,
    },

    separator: {
      fontSize: size.sm,
    },
  },
};
