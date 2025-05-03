import React from 'react';
import { Handle, Position } from 'reactflow';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Define custom node styles based on node type
const getNodeStyles = (type) => {
  const baseStyle = {
    padding: '10px 15px',
    borderRadius: '8px',
    width: '100%',
    minWidth: '150px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '1px solid',
  };

  switch (type) {
    case 'input':
      return {
        ...baseStyle,
        background: 'linear-gradient(310deg, #0075FF 0%, #0059B2 100%)',
        borderColor: '#0075FF',
        color: 'white',
      };
    case 'buy':
      return {
        ...baseStyle,
        background: 'linear-gradient(310deg, #1acd7c 0%, #07964b 100%)',
        borderColor: '#1acd7c',
        color: 'white',
      };
    case 'sell':
      return {
        ...baseStyle,
        background: 'linear-gradient(310deg, #f53535 0%, #c02828 100%)',
        borderColor: '#f53535',
        color: 'white',
      };
    case 'neutral':
      return {
        ...baseStyle,
        background: 'linear-gradient(310deg, #FFD700 0%, #e6c200 100%)',
        borderColor: '#FFD700',
        color: '#111'
      };
    case 'decision':
      return {
        ...baseStyle,
        background: 'linear-gradient(310deg, #344675 0%, #263148 100%)',
        borderColor: '#0075FF',
        borderStyle: 'dashed',
        color: 'white',
        borderRadius: '20px',
      };
    default:
      return {
        ...baseStyle,
        background: 'linear-gradient(310deg, #0C1E4E 0%, #071326 100%)',
        borderColor: '#0075FF',
        color: 'white',
      };
  }
};

// Define icon based on node category
const getNodeIcon = (id) => {
  if (id.includes('Signal') || id === 'finalSignal') {
    return '📊';
  } else if (id.includes('buy') || id.includes('enterLong')) {
    return '📈';
  } else if (id.includes('sell') || id.includes('enterShort')) {
    return '📉';
  } else if (id.includes('histogram') || id.includes('macd')) {
    return '📈';
  } else if (id.includes('ema')) {
    return '📉';
  } else if (id.includes('stoch') || id.includes('RSI')) {
    return '📊';
  } else if (id.includes('band') || id.includes('price')) {
    return '📉';
  } else if (id.includes('confidence') || id.includes('weighting')) {
    return '🧮';
  } else if (id === 'start') {
    return '▶️';
  } else if (id.includes('Position')) {
    return '🔄';
  } else if (id.includes('TP')) {
    return '💰';
  }
  return '📋';
};

// Main component
function CustomNode({ id, data, type }) {
  // Determine node type for styling
  let nodeType = type;
  if (id.includes('buy') || id.includes('enterLong') || id === 'buySignal' || id === 'buyTP') {
    nodeType = 'buy';
  } else if (id.includes('sell') || id.includes('enterShort') || id === 'sellSignal' || id === 'sellTP') {
    nodeType = 'sell';
  } else if (id === 'neutralSignal') {
    nodeType = 'neutral';
  } else if (id.includes('Position')) {
    nodeType = 'decision';
  }

  const styles = getNodeStyles(nodeType);
  const icon = getNodeIcon(id);

  return (
    <div style={styles}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#0075FF', width: '8px', height: '8px' }}
      />
      <VuiBox display="flex" alignItems="center" gap={1}>
        <VuiTypography fontSize="16px">{icon}</VuiTypography>
        <VuiTypography
          variant="button"
          fontWeight="medium"
          textTransform="capitalize"
          fontSize="13px"
        >
          {data.label}
        </VuiTypography>
      </VuiBox>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#0075FF', width: '8px', height: '8px' }}
      />
    </div>
  );
}

export default CustomNode;
