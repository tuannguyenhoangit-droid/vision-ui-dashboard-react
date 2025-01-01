/*!

=========================================================
* SA BOT - v1.0.0
=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

export default styled(Switch)(({ theme, ownerState }) => {
  const { palette } = theme;
  const { color } = ownerState;
  const { white, success, light } = palette;

  // styles for the button with variant="contained"
  const containedStyles = () => {
    // background color value
    const backgroundValue = palette[color] ? palette[color].main : white.main;

    // color value when button is focused

    return {
      "&.MuiSwitch-root": {
        "& .Mui-checked+.MuiSwitch-thumb": {
          backgroundColor: white.main,
        },
        "& .MuiSwitch-track": {
          backgroundColor: `${light.focus} !important`,
          borderColor: "transparent",
        },
        "& .Mui-checked+.MuiSwitch-track": {
          backgroundColor: `${backgroundValue} !important`,
        },
      },
    };
  };

  return {
    ...containedStyles(),
  };
});
