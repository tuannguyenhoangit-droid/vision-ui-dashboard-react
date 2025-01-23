import PropTypes from "prop-types";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import colors from "assets/theme/base/colors";
import { MenuItem, Select } from "@mui/material";

function SelectNetwork({ paymentConfigs = [], onChange, selectedItem }) {
    return (
        <VuiBox
            onClick={onChange}
        >
            <Select
                value={selectedItem}
                placeholder="Select Network"
                defaultValue={selectedItem}

                sx={{
                    backgroundColor: `${colors.secondary.main} !important`,
                    border: `1px solid #56577a`,
                    '& .MuiSelect-select': {
                        color: 'white !important',
                        minHeight: 32,
                        width: '100%'
                    },
                }}

                onChange={() => { }}
            >
                {paymentConfigs.map((config) => {
                    return (
                        <MenuItem key={config.network} value={config.network}>{config.name}</MenuItem>
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
