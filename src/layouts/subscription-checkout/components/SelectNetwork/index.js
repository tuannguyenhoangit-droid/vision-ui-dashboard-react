/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import linearGradient from "assets/theme/functions/linearGradient";
import colors from "assets/theme/base/colors";
import { FormControl, MenuItem, Select } from "@mui/material";

function SelectNetwork({ paymentConfigs = [], noGutter, onChange, selectedItem }) {
    const { gradients } = colors;
    const { bill } = gradients;

    return (
        <VuiBox
            onClick={onChange}
            component="li"
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ background: linearGradient(bill.main, bill.state, bill.deg) }}
            borderRadius="lg"
            p="12px"
            mb={noGutter ? "0px" : "24px"}
            mt="24px"
        >
            <Select
                variant="outlined"
                value={selectedItem}
                label="Select Network"
                sx={{
                    '&.MuiInputBase-root': {
                        background: '',
                        backgroundColor: ''
                    }
                }}
                onChange={() => { }}
            >
                {paymentConfigs.map((config) => {
                    return (
                        <MenuItem value={config.network}>{config.name}</MenuItem>
                    )
                })}
            </Select>

        </VuiBox>
    );
}

// Setting default values for the props of Bill
SelectNetwork.defaultProps = {
    noGutter: false,
};

// Typechecking props for the Bill
SelectNetwork.propTypes = {
    name: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    vat: PropTypes.string.isRequired,
    noGutter: PropTypes.bool,
};

export default SelectNetwork;
