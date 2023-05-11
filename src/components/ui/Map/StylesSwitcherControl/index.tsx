import React from 'react';
import { type ControlPosition } from 'react-map-gl/maplibre';
import Image from 'next/image';
import { type StyleSpecification } from 'maplibre-gl';

import ReactOverlayControl from 'app/components/ui/Map/ReactOverlayControl';
import Popover from 'app/components/ui/Popover';
import VectorButton from 'app/components/ui/VectorButton';
import Clickable from 'app/components/utils/Clickable';
import { deepMemo } from 'app/lib/utils';
import { type ImageSource } from 'app/types';

import styles from './styles.module.scss';

export interface MapStyle {
  /** Название стиля */
  label: string;

  /** Изображение для стиля */
  preview: ImageSource;

  /** Ссылка на стиль, либо его непосредственное описание */
  style: StyleSpecification | string;
}

export interface StylesSwitcherControlProps {
  /** Расположение элемента управления относительно карты */
  position?: ControlPosition;

  /** Callback на случай выбора стиля */
  onChangeStyle: (style: StyleSpecification | string) => void;

  /** Доступные стили */
  mapStyles: MapStyle[];
}

/** Элемент управления для смены стилей карты */
const StylesSwitcherControl: React.FC<StylesSwitcherControlProps> = ({
  position,
  onChangeStyle,
  mapStyles = [],
}) => {
  return (
    <ReactOverlayControl position={position}>
      <div className="maplibregl-ctrl maplibregl-ctrl-group">
        <Popover
          placement="right"
          content={(
            <div className={styles.stylesList}>
              {mapStyles.map(({ label, preview, style }, i) => (
                <Clickable key={i} onClick={() => onChangeStyle(style)}>
                  <div className={styles.item}>
                    <Image
                      className={styles.preview}
                      src={preview}
                      width={160}
                      height={76}
                      alt={label}
                    />

                    <p className={styles.label}>
                      {label}
                    </p>
                  </div>
                </Clickable>
              ))}
            </div>
          )}
        >
          <VectorButton src="common/square-3-stack-3d" size={30} />
        </Popover>
      </div>
    </ReactOverlayControl>
  );
};

export default deepMemo(StylesSwitcherControl);
