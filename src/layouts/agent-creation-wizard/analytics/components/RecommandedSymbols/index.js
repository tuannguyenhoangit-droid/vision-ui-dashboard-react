import { useEffect, useState } from "react";
import { getRecommandedSymbols } from "services/api";
import { Card } from "@mui/material";
import Table from "examples/Tables/Table";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import { BsCheckCircleFill } from "react-icons/bs";
import VuiButton from "components/VuiButton";
import { AddCircle } from "@mui/icons-material";
//  symbol, volume, date, recommanded, signal, stochSignal stochSignal: confidence, finalSignal

const RecommandedSymbolsItem = ({ row, onItemClick = () => null }) => {
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
        {row.stochSignal.totalScore}
      </VuiTypography>
    ),
    date: (
      <VuiTypography variant="caption" color="white">
        {new Date(row.updatedAt).toLocaleString()}
      </VuiTypography>
    ),
    recommanded: (
      <VuiTypography variant="caption" color="white">
        {row.recommanded}
      </VuiTypography>
    ),
    confidence: (
      <VuiTypography variant="caption" color="white">
        {[row.stochSignal.confidence.toFixed(2), "%"].join("")}
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

const RecommandedSymbols = (props) => {
  const { onItemClick = () => null } = props;
  const [recommandedSymbols, setRecommandedSymbols] = useState([]);

  useEffect(() => {
    getRecommandedSymbols().then((data) => setRecommandedSymbols(data));
  }, []);

  const renderRow = () => {
    return recommandedSymbols.map((row) => RecommandedSymbolsItem({ row, onItemClick }));
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
      <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="32px">
        <VuiBox mb="auto">
          <VuiTypography color="white" variant="lg" mb="6px" gutterBottom>
            Recommanded Symbols
          </VuiTypography>
          <VuiBox display="flex" alignItems="center" lineHeight={0}>
            <BsCheckCircleFill color="green" size="15px" />
            <VuiTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>Top symbols recommanded by AI</strong>
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </VuiBox>
      <VuiBox
        sx={{
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
        }}
      >
        <Table
          columns={[
            { name: "symbol", align: "left" },
            { name: "signal", align: "left" },
            { name: "confidence", align: "left" },
            { name: "score", align: "left" },
            { name: "date", align: "left" },
            { name: "recommanded", align: "left" },
            { name: "action", align: "left" },
          ]}
          rows={renderRow()}
        />
      </VuiBox>
    </Card>
  );
};

export default RecommandedSymbols;
