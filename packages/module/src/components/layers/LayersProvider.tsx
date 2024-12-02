import React, { useState, useEffect } from 'react';
import { DEFAULT_LAYER, TOP_LAYER } from '../../const';
import LayersContext from './LayersContext';
import { useHover } from '../../utils';

interface LayersProviderProps {
  layers?: string[];
  children?: React.ReactNode;
}

const LayersProvider: React.FunctionComponent<LayersProviderProps> = ({ layers, children }) => {
  const [layerState, setLayerState] = useState<{ [id: string]: SVGGElement | null }>({});
  const [hover, hoverRef] = useHover();

  const contextValue = (id: string): SVGGElement => {
    const layerNode = layerState[id];
    if (layerNode) {
      return layerNode;
    }
    throw new Error(`Unknown layer '${id}'`); // Debugging error
  };

  const setDomLayers = (node: SVGGElement | null, id: string) => {
    if (node && layerState[id] !== node) {
      setLayerState((prev) => ({ ...prev, [id]: node }));
    }
  };

  useEffect(() => {
    if (layers && !layers.includes(DEFAULT_LAYER)) {
      throw new Error('Missing default layer.');
    }
  }, [layers]);

  const layerIds = layers || [DEFAULT_LAYER];

  // eslint-disable-next-line no-console
  console.log('Layer IDs', layerIds);

  return (
    <LayersContext.Provider value={contextValue}>
      {layerIds.map((id) => {
        return (
          <g
            key={id}
            data-layer-id={id}
            ref={(r) => {
              setDomLayers(r, id);
              hoverRef(r);
            }}
          >
            {(() => {
              if (id === TOP_LAYER && layerState[id] && hover) {
                return <g className="top-layer-wrapper">{children}</g>;
              } else if (id === DEFAULT_LAYER && layerState[id]) {
                return children;
              }
              return null;
            })()}
          </g>
        );
      })}
    </LayersContext.Provider>
  );
};

export default LayersProvider;
