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

function RowsWrapper(props: Sizes) {
  const { width, height } = props;
  return (
    <div className={styles.rowsWrapper} style={{ width, height }}>
      <Row width={width} height={height / 3} />
      <Row width={width} height={height / 3} />
      <Row width={width} height={height / 3} />
    </div>
  );
}

function Row(props: Sizes) {
  const { width, height } = props;
  return (
    <div className={styles.rowWrapper} style={{ width, height }}>
      <div className={styles.row}>
        width {width} height {height}
      </div>
    </div>
  );
}

function MyBigCard(props: Sizes) {
  const { width, height } = props;
  return (
    <div className={styles.singleInfoArea} style={{ width, height }}>
      height {height} width {width}
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
