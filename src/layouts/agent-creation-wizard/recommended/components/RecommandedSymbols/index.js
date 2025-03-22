import { useEffect, useState } from "react";
import { getRecommandedSymbols } from "services/api";
import { Card, Chip, Grid } from "@mui/material";
import Table from "examples/Tables/Table";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import { BsCheckCircleFill } from "react-icons/bs";
import VuiButton from "components/VuiButton";
import { AddCircle } from "@mui/icons-material";
//  symbol, volume, date, recommanded, signal, stochSignal stochSignal: confidence, finalSignal

const RecommandedSymbolsItem = ({ row, onItemClick = () => null, type }) => {
  const handleOnClick = () =>
    onItemClick({
      ...row,
      side: row.signal,
    });
  return {
    symbol: (
      <VuiBox display="flex" alignItems="center">
        <VuiTypography variant="button" color="white">
          {row.symbol}
        </VuiTypography>
      </VuiBox>
    ),
    signal: (
      <VuiTypography variant="button" color={row.signal === "BUY" ? "success" : "error"}>
        {row.signal}
      </VuiTypography>
    ),
    score: (
      <VuiTypography variant="caption" color="white">
        {(row.result.totalScore || 0).toFixed(2)}
      </VuiTypography>
    ),
    date: (
      <VuiTypography variant="caption" color="white">
        {new Date(row.updatedAt).toLocaleString()}
      </VuiTypography>
    ),

    confidence: (
      <VuiTypography variant="caption" color="white">
        {[(row.result.confidence || 0).toFixed(2), "%"].join("")}
      </VuiTypography>
    ),
    action: (
      <VuiTypography variant="caption" color="white">
        <VuiButton size="small" onClick={handleOnClick} color="vimeo" variant="gradient">
          <AddCircle style={{ marginRight: 4 }} />
          Strategy
        </VuiButton>
      </VuiTypography>
    ),
  };
};

const RecommandedSymbolsItemMobile = ({ row, onItemClick = () => null, type }) => {
  const handleOnClick = () =>
    onItemClick({
      ...row,
      side: row.signal,
    });
  return (
    <VuiBox
      key={row.symbol}
      sx={{
        marginTop: 1,
        marginBottom: 1,
      }}
    >
      <Card sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
        <Grid container>
          <VuiBox display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <VuiBox display="flex" alignItems="center">
              <VuiTypography variant="h6" color="white">
                {row.symbol}
                <Chip
                  sx={{ marginLeft: 1 }}
                  color="primary"
                  label={
                    <VuiTypography variant="caption" color="white">
                      {type}
                    </VuiTypography>
                  }
                  size="small"
                />
              </VuiTypography>
            </VuiBox>
            <Chip
              color={row.signal === "BUY" ? "success" : "error"}
              label={
                <VuiTypography variant="caption" color="white">
                  {row.signal}
                </VuiTypography>
              }
              size="small"
            />
          </VuiBox>
          <VuiBox
            mt={2}
            width="100%"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <VuiTypography variant="caption" color="white">
              {["Score: ", (row.result.totalScore || 0).toFixed(2)]}
            </VuiTypography>
            <VuiTypography variant="caption" color="white">
              {["Confidence: ", (row.result.confidence || 0).toFixed(2)]}%
            </VuiTypography>
          </VuiBox>

          <VuiBox
            mt={1.5}
            width="100%"
            display="flex"
            justifyContent="space-between"
            flexDirection="row"
            alignItems="center"
          >
            <VuiTypography variant="caption" color="white">
              {new Date(row.updatedAt).toLocaleString()}
            </VuiTypography>
            <VuiButton size="small" onClick={handleOnClick} color="vimeo" variant="gradient">
              <AddCircle style={{ marginRight: 4 }} />
              Strategy
            </VuiButton>
          </VuiBox>
        </Grid>
      </Card>
    </VuiBox>
  );
};

const RecommandedSymbols = (props) => {
  const { onItemClick = () => null, data = [], title = "", description = "", type = "" } = props;

  const renderRow = () => {
    return data.map((row) => RecommandedSymbolsItem({ row, onItemClick, type }));
  };

  return (
    <Card
      sx={({ breakpoints }) => ({
        [breakpoints.down("sm")]: {
          height: "100% !important",
          padding: 1,
        },
        [breakpoints.up("sm")]: {
          height: "100% !important",
          padding: 1,
        },
        [breakpoints.up("md")]: {
          height: "100% !important",
          padding: 3,
        },
        [breakpoints.up("xl")]: {
          height: "100% !important",
          padding: 3,
        },
      })}
    >
      <VuiBox
        sx={({ breakpoints }) => ({
          [breakpoints.down("md")]: {
            display: "none",
          },
        })}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="32px"
      >
        <VuiBox mb="auto">
          <VuiTypography color="white" variant="lg" mb="6px" gutterBottom>
            {title}
          </VuiTypography>
          <VuiBox display="flex" alignItems="center" lineHeight={0}>
            <BsCheckCircleFill color="green" size="15px" />
            <VuiTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>{description}</strong>
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </VuiBox>
      <VuiBox
        sx={({ breakpoints }) => ({
          [breakpoints.down("md")]: {
            display: "none",
          },
          "& th": {
            borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
              `${borderWidth[1]} solid ${grey[700]}`,
          },
          "& .MuiTableRow-root:not(:last-child)": {
            "& td": {
              borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                `${borderWidth[1]} solid ${grey[700]}`,
            },
          },
        })}
      >
        <Table
          columns={[
            { name: "symbol", align: "left" },
            { name: "signal", align: "left" },
            { name: "confidence", align: "left" },
            { name: "score", align: "left" },
            { name: "date", align: "left" },
            { name: "action", align: "left" },
          ]}
          rows={renderRow()}
        />
      </VuiBox>
      <VuiBox
        sx={({ breakpoints }) => ({
          display: "none",
          [breakpoints.down("md")]: {
            display: "block",
          },
        })}
      >
        {data.map((row) => (
          <RecommandedSymbolsItemMobile
            key={row.symbol}
            row={row}
            onItemClick={onItemClick}
            type={type}
          />
        ))}
      </VuiBox>
    </Card>
  );
};

export default RecommandedSymbols;
