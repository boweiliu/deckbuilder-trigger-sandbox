import { FC } from 'react';
import { PlayViewport } from '@/screens/play/PlayViewport';
import { PlayBoard } from '@/screens/play/PlayBoard';
import styles from './PlayScreen.module.css';

export type Sizes = { width: number; height: number };
export type FCS<T extends Sizes> = FC<T>;
export type Sized<C> = [Sizes, C];
export type FCSized<T extends Sizes> = (
  ...args: Parameters<FCS<T>>
) => Sized<ReturnType<FCS<T>>>;
export type HOCSized = <T extends Sizes>(c: FCSized<T>) => FCSized<T>;
export type HOC2Sized = <T extends Sizes>(
  c: FCSized<T>,
  d: FCSized<T>
) => FCSized<T>;

export function GrayBorder<T extends Sizes>(
  props: {
    ChildComponent: FC<T>;
    borderWidth?: number;
  } & T
) {
  const { width, height, ChildComponent, borderWidth = 6 } = props;

  return (
    <div className={styles.grayBorder} style={{ borderWidth }}>
      <ChildComponent
        {...props}
        width={width - 2 * borderWidth}
        height={height - 2 * borderWidth}
      />
    </div>
  );
}

export const withGrayBorder = <T extends Sizes & { borderWidth?: number }>(
  ChildComponent: FC<T>
): FC<T> => {
  return function grayBorder(props: T) {
    const { width, height, borderWidth = 6 } = props;
    return (
      <div className={styles.grayBorder} style={{ borderWidth, width, height }}>
        <ChildComponent
          {...props}
          width={width - 2 * borderWidth}
          height={height - 2 * borderWidth}
        />
      </div>
    );
  };
};

export const withPaddingSized: (p: number) => HOCSized = (padding) => {
  return <T extends Sizes>(SizedChildComponent: FCSized<T>) => {
    return (props: T) => {
      const { width: availableWidth, height: availableHeight } = props;

      const childAvailableSizes = {
        height: availableHeight - 2 * padding,
        width: availableWidth - 2 * padding,
      };

      const [childRenderedSizes, children] = SizedChildComponent({
        ...props,
        ...childAvailableSizes,
      });

      const { width: renderedWidth, height: renderedHeight } =
        childRenderedSizes;

      const mySizes = {
        width: renderedWidth + 2 * padding,
        height: renderedHeight + 2 * padding,
      };
      return [
        mySizes,
        // eslint-disable-next-line react/jsx-key
        <div
          className={styles.withPadding}
          style={{
            padding,
            width: mySizes.width,
            height: mySizes.height,
          }}
        >
          {children}
        </div>,
      ];
    };
  };
};

// aspectRatio = width / height
export const withAutoWidthSized = <T extends Sizes & { aspectRatio?: number }>(
  SizedChildComponent: FCSized<T>
): FCSized<T> => {
  return (props) => {
    // grab the available sizes, as passed down from our wrapper
    const {
      width: availableWidth,
      height: availableHeight,
      aspectRatio = 4 / 7,
    } = props;

    // compute the sizes available to the child
    const childAvailableSizes = {
      height: availableHeight,
      width: availableHeight * aspectRatio,
    };

    // invoke the child
    const [childRenderedSizes, children] = SizedChildComponent({
      ...props,
      ...childAvailableSizes,
    });

    return [childRenderedSizes, children];
  };
};

function RowsWrapper(props: Sizes) {
  const { width, height } = props;
  return (
    <div className={styles.rowsWrapper} style={{ width, height }}>
      width {width} height {height}
    </div>
  );
}

export const withFlexLeftSized: (args: {
  paddingBetween: number;
}) => HOC2Sized = (args) => {
  const { paddingBetween } = args;
  return <T extends Sizes>(
    LeftComponent: FCSized<T>,
    RightComponent: FCSized<T>
  ): FCSized<T> => {
    return (props: T) => {
      const { width: availableWidth, height: availableHeight } = props;

      const [rightRenderedSizes, rightChildren] = RightComponent({ ...props });

      const leftAvailableSizes = {
        width: availableWidth - rightRenderedSizes.width - paddingBetween,
        height: availableHeight,
      };
      console.log({ props, leftAvailableSizes, rightRenderedSizes });

      const [leftRenderedSizes, leftChildren] = LeftComponent({
        ...props,
        ...leftAvailableSizes,
      });

      const myRenderedSizes = {
        width:
          leftRenderedSizes.width + paddingBetween + rightRenderedSizes.width,
        height: Math.max(leftRenderedSizes.height, rightRenderedSizes.height),
      };

      return [
        myRenderedSizes,
        <>
          {leftChildren}
          <div
            style={{ width: paddingBetween, height: myRenderedSizes.height }}
          />
          {rightChildren}
        </>,
      ];
    };
  };
};

const BigCard = withPaddingSized(12)(
  withAutoWidthSized(defaultSizer(MyBigCard))
);

const RowsWrapperAndBigCard = unSizer(
  withFlexLeftSized({ paddingBetween: 16 })(defaultSizer(RowsWrapper), BigCard)
);

function MyBigCard(props: Sizes) {
  const { width, height } = props;
  return (
    <div className={styles.singleInfoArea} style={{ width, height }}>
      height {height} width {width}
    </div>
  );
}

export function defaultSizer<T extends Sizes>(Component: FCS<T>): FCSized<T> {
  return (props: T) => {
    return [
      { width: props.width, height: props.height },
      // eslint-disable-next-line react/jsx-key
      <Component {...props} />,
    ];
  };
}

export function unSizer<T extends Sizes>(SizedComponent: FCSized<T>): FCS<T> {
  return (props: T) => {
    const [, el] = SizedComponent(props);
    return el;
  };
}

// Reading in order, goes outside in. so for instance here we apply gray border then apply padding.
export const PlayScreen = withGrayBorder(
  unSizer(withPaddingSized(16)(defaultSizer(MyPlayScreen)))
);

export function MyPlayScreen(props: { width: number; height: number }) {
  const { width, height } = props;
  return (
    <div className={styles.playScreenContainer}>
      <RowsWrapperAndBigCard width={width} height={height} />
    </div>
  );
}
