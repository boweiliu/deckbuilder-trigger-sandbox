import { FC, useState, ReactNode, CSSProperties } from 'react';
import classnames from 'classnames';
import { PlayViewport } from '@/screens/play/PlayViewport';
import { PlayBoard } from '@/screens/play/PlayBoard';
import styles from './PlayScreen.module.css';
import {
  Sizes,
  FCSized,
  withBorderSized,
  withAutoWidthSized,
  withPaddingSized,
  defaultSizer,
  unSizer,
  withFlexLeftSized,
  getAdaptiveBorderRadius,
} from '@/components/hoc/sizing';

// For reference - 5/7 is playing card, 4/7 is tarot, 1/2 is domino. 6/11 is best for tall cards, i like 2/3 for fat cards since we dont have art.
const ASPECT_RATIO = 6 / 11;
const CARD_BORDER_WIDTH = 2;

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
        whiteSpace: 'nowrap',
        fontSize: size,
        display: 'flex',
        justifyContent: 'center',
        ...style,
      }}
    >
      <div
        style={{
          width: 'fit-content',
          /* lineHeight 0.7 is more closely fitting to text, but this looks fine */
          lineHeight: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Should be max-width 80% of the width of its container
function SmallCardCenterButton(props: Sizes & { text?: string }) {
  const { width, height, text = 'Play' } = props;
  return (
    <TextInBox className={styles.smallCardButton} fontSize={width * 0.3}>
      {text}
    </TextInBox>
  );
}

function MySmallCard(props: Sizes & { borderRadius?: number }) {
  const { width, height, borderRadius } = props;
  const [selected, setSelected] = useState(Boolean(Math.random() < 0.1));
  // const borderRadius = getAdaptiveBorderRadius({ width, height });
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
  withPaddingSized(({ width, height }) => height * 0.04)(
    withBorderSized(CARD_BORDER_WIDTH, {
      className: styles.smallCardBorder,
      isRounded: true,
    })(withAutoWidthSized(ASPECT_RATIO)(defaultSizer(MySmallCard)))
  )
);

function Row(props: Sizes & { count?: number; title?: string }) {
  const { width, height, count = 5, title = 'Shop' } = props;
  const borderRadius = getAdaptiveBorderRadius({ width, height });
  // -4px on height to account for border. also make sure to hide horiz scrollbar

  const shouldShowScrollers = count > 5;
  const innerBorderRadius = borderRadius - 2; // subtract off the border width

  return (
    <div className={styles.rowArea} style={{ width, height }}>
      <TextInBox
        className={styles.rowFloatingTitle}
        fontSize={height * 0.12}
        style={{ top: height * -0.05, left: width * 0.1 }}
      >
        {title}
      </TextInBox>
      <div className={styles.row} style={{ borderRadius }}>
        {shouldShowScrollers && (
          <div
            className={styles.rowLeftScroller}
            style={{
              width: height * 0.28,
              fontSize: height * 0.15,
              borderRadius: `${innerBorderRadius}px 0px 0px ${innerBorderRadius}px`,
            }}
          >
            {'<'}
          </div>
        )}
        <div
          className={styles.rowContents}
          style={{ width: width - 4, height: height - 4 }}
        >
          {new Array(count).fill(0).map((_, idx) => (
            <SmallCard key={idx} width={width} height={height - 4} />
          ))}
        </div>
        {shouldShowScrollers && (
          <div
            className={styles.rowRightScroller}
            style={{
              width: height * 0.28,
              fontSize: height * 0.15,
              borderRadius: `0px ${innerBorderRadius}px ${innerBorderRadius}px 0px`,
            }}
          >
            {'>'}
          </div>
        )}
      </div>
    </div>
  );
}

const RowWrapper = unSizer(
  withPaddingSized(({ width, height }) => height * 0.04)(defaultSizer(Row))
);

function RowsWrapper(props: Sizes) {
  const { width, height } = props;
  return (
    <div className={styles.rowsWrapper} style={{ width, height }}>
      <RowWrapper width={width} height={height / 3} count={6} title="Shop" />
      <RowWrapper width={width} height={height / 3} count={1} title="Perms" />
      <RowAndPile width={width} height={height} />
    </div>
  );
}

const PileWrapper = unSizer(
  withPaddingSized(({ width, height }) => height * 0.04)(defaultSizer(Pile))
);

function Pile(props: Sizes) {
  const { width, height } = props;
  const borderRadius = getAdaptiveBorderRadius({
    width: width * Infinity,
    height,
  });
  return (
    <div className={styles.pileArea} style={{ width, height }}>
      <TextInBox
        className={styles.pileFloatingTitle}
        fontSize={height * 0.12}
        style={{ top: height * -0.05, left: width * 0.5 }}
      >
        Pile
      </TextInBox>
      <div className={styles.pile} style={{ borderRadius }} />
    </div>
  );
}

function RowAndPile(props: Sizes) {
  const { width, height } = props;
  return (
    <div style={{ display: 'flex' }}>
      <RowWrapper
        width={width - 250}
        height={height / 3}
        count={10}
        title="Hand"
      />
      <PileWrapper width={250} height={height / 3} />
    </div>
  );
}

function MyBigCard(props: Sizes & { borderRadius?: number }) {
  const { width, height, borderRadius } = props;
  return (
    <div
      className={styles.bigCard}
      style={{
        width,
        height,
        borderRadius,
        fontSize: height * 0.09,
      }}
    >
      <div className={styles.bigCardContents} style={{}}>
        filler
      </div>
      <TextInBox
        className={styles.bigCardFloatingTitle}
        fontSize={height * 0.075}
        style={{ top: height * -0.03 }}
      >
        Hand, #3
      </TextInBox>
      <TextInBox
        role="button"
        className={styles.bigCardFloatingFooter}
        fontSize={height * 0.075}
        style={{ bottom: height * -0.03 }}
      >
        Play
      </TextInBox>
    </div>
  );
}

const BigCard = withPaddingSized(({ width, height }) => width * 0.015)(
  withBorderSized(CARD_BORDER_WIDTH, {
    className: styles.bigCardBorder,
    isRounded: true,
  })(withAutoWidthSized(ASPECT_RATIO)(defaultSizer(MyBigCard)))
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
export const PlayScreen = unSizer(
  withBorderSized(6, {
    style: { borderColor: '#888888', borderStyle: 'solid' },
  })(
    withPaddingSized(({ width, height }) => Math.min(width, height) * 0.01)(
      defaultSizer(MyPlayScreen)
    )
  )
);
