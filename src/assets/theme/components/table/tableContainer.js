/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Vision UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import boxShadows from "assets/theme/base/boxShadows";
import borders from "assets/theme/base/borders";

const { transparent } = colors;
const { xxl } = boxShadows;
const { borderRadius } = borders;

export default {
  styleOverrides: {
    root: {
      backgroundColor: transparent.main,
      boxShadow: xxl,
      borderRadius: borderRadius.xl,
      "& thead": {
        "& tr": {
          "& th": {
            "&:first-of-type": {
              paddingLeft: "0px !important",
            },
          },
        },
      },
      "& .MuiTableBody-root": {
        "& tr": {
          "& td": {
            "&:first-of-type": {
              paddingLeft: "0px !important",
              "& .MuiBox-root": {
                paddingLeft: "0px !important",
              },
            },
          },
        },
      },
    },
  },
};
