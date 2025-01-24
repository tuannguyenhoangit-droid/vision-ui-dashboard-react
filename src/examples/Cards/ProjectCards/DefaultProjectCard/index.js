/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";



import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import { IoCheckmark } from "react-icons/io5";
import colors from "assets/theme/base/colors";
const { success } = colors;
function DefaultProjectCard({
  image,
  label,
  title,
  features,
  description,
  action,
  monthlyPrice,
  quarterlyPrice,
  active,
  onClick = () => { },
}) {


  return (
    <VuiBox
      sx={{
        display: "flex",
        flexDirection: "column",
        boxShadow: "none",
        overflow: "visible",
      }}
    >
      <VuiBox
        component="img"
        src={image}
        mb="8px"
        borderRadius="15px"
        sx={({ breakpoints }) => ({
          [breakpoints.up("xl")]: {
            height: "200px",
          },
        })}
      />

      <VuiBox
        sx={({ breakpoints }) => ({
          [breakpoints.only("xl")]: {
            minHeight: "200px",
          },
        })}
      >
        <VuiBox>
          <VuiTypography variant="xxs" color="text" fontWeight="medium" textTransform="capitalize">
            {label}
          </VuiTypography>
        </VuiBox>
        <VuiBox mb={2}>
          {action.type === "internal" ? (
            <VuiTypography
              component={Link}
              to={action.route}
              variant="h5"
              color="white"
              textTransform="capitalize"
            >
              {title}
            </VuiTypography>
          ) : (
            <VuiTypography
              component="a"
              href={action.route}
              target="_blank"
              rel="noreferrer"
              color="white"
              variant="h5"
              textTransform="capitalize"
            >
              {title}
            </VuiTypography>
          )}
        </VuiBox>
        <VuiBox mb={3} lineHeight={0}>
          <VuiBox mb={1} lineHeight={0}>
            <VuiTypography variant="h6" color="text" fontWeight="light">
              Feature & Quota
            </VuiTypography>
          </VuiBox>
          {Array.isArray(features)
            ? features.map((des) => (
              <VuiBox mb={1} alignItems="center" display="flex">
                <IoCheckmark size={20} color={success.main} />
                <VuiBox ml={1}>
                  <VuiTypography variant="button" fontWeight="regular" color="white">
                    {des}
                  </VuiTypography>
                </VuiBox>
              </VuiBox>
            ))
            : null}
        </VuiBox>
        <VuiBox mb={3} lineHeight={0}>
          <VuiTypography variant="button" fontWeight="regular" color="text">
            {description}
          </VuiTypography>
        </VuiBox>
        <VuiBox>
          <VuiButton
            color={active ? "orange" : "primary"}
            fullWidth
            alignItems="center"
            display="flex"
            onClick={onClick}
          >
            {
              monthlyPrice ? <VuiTypography color="white">
                {["$", monthlyPrice]}
                <VuiTypography
                  variant="button"
                  color="white"
                  sx={{
                    marginLeft: 1,
                  }}
                >
                  {["per month"]}
                </VuiTypography>
              </VuiTypography> : null}
            {
              quarterlyPrice ? <VuiTypography color="white">
                {["$", Math.round((quarterlyPrice / 3) * 100) / 100]}
                <VuiTypography
                  variant="button"
                  color="white"
                  sx={{
                    marginLeft: 1,
                  }}
                >
                  {["per month with quarterly price"]}
                </VuiTypography>
              </VuiTypography> : null}
          </VuiButton>
        </VuiBox>
        {/* <VuiBox display="flex" justifyContent="space-between" alignItems="center">
          {action.type === "internal" ? (
            <VuiButton
              component={Link}
              to={action.route}
              variant="outlined"
              size="small"
              color={action.color}
            >
              {action.label}
            </VuiButton>
          ) : (
            <VuiButton
              component="a"
              href={action.route}
              target="_blank"
              rel="noreferrer"
              variant="outlined"
              size="small"
              color={action.color}
            >
              {action.label}
            </VuiButton>
          )}
          <VuiBox display="flex">{renderAuthors}</VuiBox>
        </VuiBox> */}
      </VuiBox>
    </VuiBox>
  );
}

// Setting default values for the props of DefaultProjectCard
DefaultProjectCard.defaultProps = {
  authors: [],
};

// Typechecking props for the DefaultProjectCard
DefaultProjectCard.propTypes = {
  image: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(["external", "internal"]),
    route: PropTypes.string.isRequired,
    color: PropTypes.oneOf([
      "white",
      "text",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
      "white",
    ]).isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  authors: PropTypes.arrayOf(PropTypes.object),
};

export default DefaultProjectCard;
