import React, { useRef, useState, useMemo } from 'react';
import MapComponent, {
  type MapRef,
  Marker,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
} from 'react-map-gl/maplibre';
import useTranslation from 'next-translate/useTranslation';
import { type RequestTransformFunction, type StyleSpecification } from 'maplibre-gl';
import { isMapboxURL, transformMapboxUrl } from 'maplibregl-mapbox-request-transformer';

import Input from 'app/components/input/Input';
import Select from 'app/components/input/Select';
import Button from 'app/components/ui/Button';
import ReactOverlayControl from 'app/components/ui/Map/ReactOverlayControl';
import StylesSwitcherControl from 'app/components/ui/Map/StylesSwitcherControl';
import Popover from 'app/components/ui/Popover';
import { env } from 'app/lib/constants';
import { useEvent } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import 'maplibre-gl/dist/maplibre-gl.css';

import { osmStandardStyle } from './map-styles';
import styles from './styles.module.scss';

export interface MapProps {
  /** Содержимое карты */
  children?: React.ReactNode;
}

/** Карта */
const Map: React.FC<MapProps> = ({ children }) => {
  const { t } = useTranslation();
  const mapRef = useRef<MapRef>(null);
  const [mapStyle, setMapStyle] = useState<StyleSpecification | string>(osmStandardStyle);

  const mapStyles = useMemo(() => [
    {
      label: t('components:map.styles.standard'),
      preview: '/assets/images/map-previews/standard.png',
      style: osmStandardStyle,
    },
    {
      label: t('components:map.styles.satellite'),
      preview: '/assets/images/map-previews/satellite.png',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
    },
  ], [t]);

  const transformRequest = useEvent<RequestTransformFunction>((url, resourceType) => {
    // Превращение ссылок mapbox в обычные
    if (isMapboxURL(url)) {
      return transformMapboxUrl(url, resourceType ?? 'Unknown', env.MAPBOX_TOKEN);
    }

    return { url };
  });

  // const isPositionInViewport = useEvent((lat: number, lng: number) => {
  //   const { current: map } = mapRef;
  //   const bounds = map?.getBounds();
  //   return bounds ? bounds.contains([lng, lat]) : false;
  // });

  return (
    <div className={styles.map}>
      <MapComponent
        ref={mapRef}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        mapStyle={mapStyle}
        transformRequest={transformRequest}
        attributionControl={false}
        reuseMaps
      >
        <FullscreenControl />
        <GeolocateControl />

        <StylesSwitcherControl
          position="bottom-right"
          onChangeStyle={setMapStyle}
          mapStyles={mapStyles}
        />
        <NavigationControl position="bottom-right" />

        <ReactOverlayControl position="top-left">
          <div className="maplibregl-ctrl maplibregl-ctrl-group">
            <Select
              placeholder={t('components:map.search.placeholder')}
              options={[]}
            />
          </div>
        </ReactOverlayControl>

        <Marker longitude={-122.4} latitude={37.8} anchor="bottom" draggable>
          <Popover content={<Input placeholder="Placeholder" />}>
            <Button>Marker button</Button>
          </Popover>
        </Marker>

        {children}
      </MapComponent>
    </div>
  );
};

export default deepMemo(Map);
