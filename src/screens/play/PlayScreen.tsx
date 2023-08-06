import { FC, useState, ReactNode, CSSProperties } from 'react';
import classnames from 'classnames';
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
  return shorter / 8;
}

function TextInBox(props: {
  fontSize: number;
  children: ReactNode;
  className?: string;
  role?: string;
  style?: CSSProperties;
}) {
  const { fontSize: size, children, className, style = {}, role } = props;
  return (
    <div
      role={role}
      className={className}
      style={{
        paddingLeft: size * 0.5,
        paddingRight: size * 0.5,
        paddingTop: size * 0.3,
        paddingBottom: size * 0.3,
        borderRadius: size * 0.5,
        fontSize: size,
        display: 'flex',
        justifyContent: 'center',
        ...style,
      }}
    >
      <div style={{ width: 'fit-content' }}>{children}</div>
    </div>
  );
}

// Should be max-width 80% of the width of its container
function SmallCardCenterButton(props: Sizes & { text?: string }) {
  const { width, height, text = 'Play' } = props;
  return (
    <TextInBox className={styles.smallCardButton} fontSize={width * 0.25}>
      {text}
    </TextInBox>
  );
}

function MySmallCard(props: Sizes) {
  const { width, height } = props;
  const [selected, setSelected] = useState(Boolean(Math.random() < 0.1));
  const borderRadius = getAdaptiveBorderRadius({ width, height });
  return (
    <div
      className={classnames(
        styles.smallCard,
        selected ? styles.selected : null
      )}
      style={{ width, height, borderRadius, fontSize: height * 0.09 }}
      onClick={() => setSelected((it) => !it)}
      onKeyDown={(e) => {
        if (e.keyCode === 13 /* enter */ || e.keyCode === 32 /* space */) {
          e.preventDefault();
          setSelected((it) => !it);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {selected ? (
        <SmallCardCenterButton width={width} height={height} />
      ) : (
        <div style={{ fontSize: height * 0.09 }}>filler</div>
      )}
    </div>
  );
}

const SmallCard = unSizer(
  withPaddingSized(6)(withAutoWidthSized(defaultSizer(MySmallCard)))
);

function Row(props: Sizes & { count?: number; title?: string }) {
  const { width, height, count = 5, title = 'Shop' } = props;
  const borderRadius = getAdaptiveBorderRadius({ width, height });
  // -4px on height to account for border. also make sure to hide horiz scrollbar
  return (
    <div className={styles.row} style={{ borderRadius, width, height }}>
      <TextInBox className={styles.rowFloatingTitle} fontSize={height * 0.075}>
        {title}
      </TextInBox>
      {count > 5 ? <div className={styles.rowLeftScroller}>{'<'}</div> : null}
      <div
        className={styles.rowContents}
        style={{ width: width - 4, height: height - 4 }}
      >
        {new Array(count).fill(0).map((_, idx) => (
          <SmallCard key={idx} width={width} height={height - 4} />
        ))}
      </div>
      {count > 5 ? <div className={styles.rowRightScroller}>{'>'}</div> : null}
    </div>
  );
}

const RowWrapper = unSizer(withPaddingSized(8)(defaultSizer(Row)));

function RowsWrapper(props: Sizes) {
  const { width, height } = props;
  return (
    <div className={styles.rowsWrapper} style={{ width, height }}>
      <RowWrapper width={width} height={height / 3} count={5} title="Shop" />
      <RowWrapper width={width} height={height / 3} count={1} title="Perms" />
      <RowWrapper width={width} height={height / 3} count={10} title="Hand" />
    </div>
  );
}

function MyBigCard(props: Sizes) {
  const { width, height } = props;
  const borderRadius = getAdaptiveBorderRadius({ width, height });
  return (
    <div
      className={styles.bigCard}
      style={{ width, height, borderRadius, fontSize: height * 0.09 }}
    >
      <div className={styles.bigCardContents} style={{}}>
        filler
      </div>
      <TextInBox
        className={styles.bigCardFloatingTitle}
        fontSize={height * 0.05}
      >
        Hand, #3
      </TextInBox>
      <TextInBox
        role="button"
        className={styles.bigCardFloatingFooter}
        fontSize={height * 0.05}
      >
        Play
      </TextInBox>
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
