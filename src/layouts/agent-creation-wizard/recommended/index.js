import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
import { SymbolConfigModal } from "../strategy-builder/components/SymbolConfigModal";

import RecommandedSymbols from "../recommended/components/RecommandedSymbols";

function Recommendation() {
  const [symbolEditItem, setSymbolEditItem] = useState(null);
  const [isOpenSymbolConfigModal, openSymbolConfigModal] = useState(false);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <RecommandedSymbols onItemClick={setSymbolEditItem} />

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
