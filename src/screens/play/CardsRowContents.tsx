import {
  FC,
  useState,
  useRef,
  useCallback,
  ReactNode,
  CSSProperties,
} from 'react';
import styles from './PlayScreen.module.css';
import { Sizes } from '@/components/hoc/sizing';

import { SmallCard } from '@/screens/play/PlayScreen';

export function CardsRowContents(props: Sizes & { count: number }) {
  const { height, width, count } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  const onWheelScroll = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    ref.current?.scrollTop;
    e.deltaX;
  }, []);

  return (
    <div
      ref={ref}
      onWheel={onWheelScroll}
      className={styles.rowContents}
      style={{
        height:
          height *
          2 /* intentionally overflow the y way too far, it's fine because the containing div has overflow y clip, and this helps to hide the scrollbar */,
      }}
    >
      {new Array(count).fill(0).map((_, idx) => (
        <SmallCard key={idx} width={Infinity} height={height} />
      ))}
    </div>
  );
}
