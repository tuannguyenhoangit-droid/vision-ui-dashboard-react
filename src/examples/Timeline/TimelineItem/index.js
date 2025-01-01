/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiBadge from "components/VuiBadge";

// Timeline context
import { useTimeline } from "examples/Timeline/context";

// Custom styles for the TimelineItem
import { timelineItem } from "examples/Timeline/TimelineItem/styles";

function TimelineItem({ color, icon, title, dateTime, description, realizedPnl }) {
  return (
    <VuiBox position="relative" mb="24px" sx={(theme) => timelineItem(theme, { color })}>
      <VuiBox
        width="1.625rem"
        height="1.625rem"
        borderRadius="50%"
        position="absolute"
        top="3.25%"
        left="-8px"
        zIndex={2}
      >
        {icon}
      </VuiBox>
      <VuiBox ml="20px" pt={description ? 0.7 : 0.5} lineHeight={0} maxWidth="30rem">
        <VuiBox>
          <VuiTypography variant="button" fontWeight="medium" color="success">
            {[realizedPnl >= 0.0 ? "+ $" : "- $", Math.round(realizedPnl * 100) / 100]}
          </VuiTypography>
          <VuiTypography ml={0.5} variant="button" fontWeight="medium" color="white">
            {title}
          </VuiTypography>
        </VuiBox>
        <VuiBox mt={0.5}>
          <VuiTypography variant="caption" fontWeight="medium" color="text">
            {dateTime}
          </VuiTypography>
        </VuiBox>
        <VuiBox mt={2} mb={1.5}>
          {description ? (
            <VuiTypography variant="button" fontWeight="regular" color="text">
              {description}
            </VuiTypography>
          ) : null}
        </VuiBox>
      </VuiBox>
    </VuiBox>
  );
}

// Setting default values for the props of TimelineItem
TimelineItem.defaultProps = {
  color: "info",
  badges: [],
  lastItem: false,
  description: "",
};

// Typechecking props for the TimelineItem
TimelineItem.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  description: PropTypes.string,
  badges: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  lastItem: PropTypes.bool,
};

export default TimelineItem;
