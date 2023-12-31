import {
  FC,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  CSSProperties,
} from 'react';
import classnames from 'classnames';
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
      // https://stackoverflow.com/questions/876115/how-can-i-determine-if-a-div-is-scrolled-to-the-bottom
      // edited to handle ios overscroll as well
      setIsScrolledToLeft?.(el.scrollLeft <= 2);
      setIsScrolledToRight?.(
        Math.ceil(el.scrollWidth - el.scrollLeft) - el.clientWidth <= 2
      );
    }
  }, [setIsScrolledToLeft, setIsScrolledToRight]);

  const onWheelScroll = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (ref.current) {
        ref.current.scrollLeft += e.deltaY;
        e.preventDefault();
        afterScroll();
      }
    },
    [afterScroll]
  );

  useEffect(() => afterScroll(), [afterScroll]);

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
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  const setIsScrolledToLeft = useCallback((b: boolean) => setShowLeft(!b), []);
  const setIsScrolledToRight = useCallback(
    (b: boolean) => setShowRight(!b),
    []
  );
  return (
    <>
      {shouldShowScrollers && (
        <div
          className={classnames(
            styles.rowLeftScroller,
            showLeft ? null : styles.disabledScroller
          )}
          style={{
            width: height * 0.22,
            fontSize: height * 0.15,
            borderRadius: `${innerBorderRadius}px 0px 0px ${innerBorderRadius}px`,
          }}
        >
          {'<'}
        </div>
      )}
      <CardsRowContents
        width={width}
        height={height}
        count={count}
        setIsScrolledToLeft={setIsScrolledToLeft}
        setIsScrolledToRight={setIsScrolledToRight}
      />
      {shouldShowScrollers && (
        <div
          className={classnames(
            styles.rowRightScroller,
            showRight ? null : styles.disabledScroller
          )}
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
