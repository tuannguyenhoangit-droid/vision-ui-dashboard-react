import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { SymbolConfigModal } from "../strategy-builder/components/SymbolConfigModal";

import RecommandedSymbols from "../recommended/components/RecommandedSymbols";
import { getRecommandedSymbols } from "services/api";
import { Grid } from "@mui/material";

function Recommendation() {
  const [symbolEditItem, setSymbolEditItem] = useState(null);
  const [isOpenSymbolConfigModal, openSymbolConfigModal] = useState(false);

  // get recommanded symbols
  const [recommandedSymbols, setRecommandedSymbols] = useState({
    longTermSignals: [],
    midTermSignals: [],
    shortTermSignals: [],
  });

  useEffect(() => {
    getRecommandedSymbols().then((data) => setRecommandedSymbols(data));
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <RecommandedSymbols
            title="Long Term Signals"
            description="Top symbols recommanded by AI"
            onItemClick={setSymbolEditItem}
            data={recommandedSymbols.longTermSignals}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecommandedSymbols
            title="Mid Term Signals"
            description="Top symbols recommanded by AI"
            onItemClick={setSymbolEditItem}
            data={recommandedSymbols.midTermSignals}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <RecommandedSymbols
            title="Short Term Signals"
            description="Top symbols recommanded by AI"
            onItemClick={setSymbolEditItem}
            data={recommandedSymbols.shortTermSignals}
          />
        </Grid>
      </Grid>

      <SymbolConfigModal
        item={symbolEditItem}
        onClose={() => {
          openSymbolConfigModal(false);
          setSymbolEditItem(null);
        }}
        open={isOpenSymbolConfigModal || symbolEditItem !== null}
      />
    </DashboardLayout>
  );
}

export default Recommendation;
