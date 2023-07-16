import { FC } from 'react';
import { PlayViewport } from '@/screens/play/PlayViewport';
import { PlayBoard } from '@/screens/play/PlayBoard';
import styles from './PlayScreen.module.css';
import {
  Sizes,
  FCSized,
  withAutoWidthSized,
  withPaddingSized,
  defaultSizer,
  unSizer,
  withFlexLeftSized,
  withGrayBorder,
} from '@/components/hoc/sizing';

function getAdaptiveBorderRadius(props: Sizes): number {
  const { width, height } = props;
  const shorter = Math.min(width, height);
  return Math.max(12, shorter / 8);
}

function MySmallCard(props: Sizes) {
  const { width, height } = props;
  const borderRadius = getAdaptiveBorderRadius({ width, height });
  return (
    <div
      className={styles.smallCard}
      style={{ width, height, borderRadius, fontSize: height / 11 }}
    >
      filler
    </div>
  );
}

const SmallCard = unSizer(
  withPaddingSized(6)(withAutoWidthSized(defaultSizer(MySmallCard)))
);

function Row(props: Sizes & { count?: number }) {
  const { width, height, count = 5 } = props;
  const borderRadius = getAdaptiveBorderRadius({ width, height });
  // -4px on height to account for border. also make sure to hide horiz scrollbar
  return (
    <div className={styles.row} style={{ borderRadius, width, height }}>
      {new Array(count).fill(0).map((_, idx) => (
        <SmallCard key={idx} width={width} height={height - 4} />
      ))}
    </div>
  );
}

const RowWrapper = unSizer(withPaddingSized(8)(defaultSizer(Row)));

function RowsWrapper(props: Sizes) {
  const { width, height } = props;
  return (
    <div className={styles.rowsWrapper} style={{ width, height }}>
      <RowWrapper width={width} height={height / 3} count={5} />
      <RowWrapper width={width} height={height / 3} count={1} />
      <RowWrapper width={width} height={height / 3} count={10} />
    </div>
  );
}

function MyBigCard(props: Sizes) {
  const { width, height } = props;
  const borderRadius = getAdaptiveBorderRadius({ width, height });
  return (
    <div
      className={styles.bigCard}
      style={{ width, height, borderRadius, fontSize: height / 11 }}
    >
      filler
    </div>
  );
}

const BigCard = withPaddingSized(12)(
  withAutoWidthSized(defaultSizer(MyBigCard))
);

const RowsWrapperAndBigCard = unSizer(
  withFlexLeftSized({ paddingBetween: 0 })(defaultSizer(RowsWrapper), BigCard)
);

export function MyPlayScreen(props: { width: number; height: number }) {
  const { width, height } = props;
  return (
    <div className={styles.playScreenContainer}>
      <RowsWrapperAndBigCard width={width} height={height} />
    </div>
  );
}

// Reading in order, goes outside in. so for instance here we apply gray border then apply padding.
export const PlayScreen = withGrayBorder(
  unSizer(withPaddingSized(16)(defaultSizer(MyPlayScreen)))
);
