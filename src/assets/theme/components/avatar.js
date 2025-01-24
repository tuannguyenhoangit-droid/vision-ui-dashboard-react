/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/


import borders from "assets/theme/base/borders";

const { borderRadius } = borders;

export default {
  styleOverrides: {
    root: {
      transition: "all 200ms ease-in-out",
    },

    rounded: {
      borderRadius: borderRadius.lg,
    },

    img: {
      height: "auto",
    },
  },
};
