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

export function CardsRowContents(
  props: Sizes & {
    count: number;
    setIsScrolledToLeft?: (b: boolean) => void;
    setIsScrolledToRight?: (b: boolean) => void;
  }
) {
  const { height, width, count, setIsScrolledToLeft, setIsScrolledToRight } =
    props;
  const ref = useRef<HTMLDivElement | null>(null);

  const afterScroll = useCallback(() => {
    if (ref.current) {
      const el = ref.current;
      setIsScrolledToLeft?.(el.scrollLeft === 0);
      setIsScrolledToRight?.(
        Math.ceil(el.scrollWidth - el.scrollLeft) === el.clientWidth
      );
    }
  }, [setIsScrolledToLeft, setIsScrolledToRight]);

  const onWheelScroll = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (ref.current) {
        ref.current.scrollLeft += e.deltaY;
        afterScroll();
      }
    },
    [afterScroll]
  );

  return (
    <div
      ref={ref}
      onWheel={onWheelScroll}
      onScroll={afterScroll}
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

export function CardsRowScrollable(
  props: Sizes & { borderRadius: number; count: number }
) {
  const { width, height, borderRadius: innerBorderRadius, count } = props;

  const shouldShowScrollers = true;

  return (
    <>
      {shouldShowScrollers && (
        <div
          className={styles.rowLeftScroller}
          style={{
            width: height * 0.22,
            fontSize: height * 0.15,
            borderRadius: `${innerBorderRadius}px 0px 0px ${innerBorderRadius}px`,
          }}
        >
          {'<'}
        </div>
      )}
      <CardsRowContents width={width} height={height} count={count} />
      {shouldShowScrollers && (
        <div
          className={styles.rowRightScroller}
          style={{
            width: height * 0.22,
            fontSize: height * 0.15,
            borderRadius: `0px ${innerBorderRadius}px ${innerBorderRadius}px 0px`,
          }}
        >
          {'>'}
        </div>
      )}
    </>
  );
}
