import { FC } from 'react';
import styles from './sizing.module.css';

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

type CallbackOrValue<T> = T | ((p: Sizes) => T);
function getValue<T>(x: CallbackOrValue<T>, props: Sizes): T {
  if (typeof x === 'function') {
    return (x as (p: Sizes) => T)(props);
  }
  return x;
}

export const withPaddingSized: (p: CallbackOrValue<number>) => HOCSized = (
  paddingOrCallback
) => {
  return <T extends Sizes>(SizedChildComponent: FCSized<T>) => {
    return (props: T) => {
      const { width: availableWidth, height: availableHeight } = props;

      const padding = getValue(paddingOrCallback, props);

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
      aspectRatio = 8 / 13,
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
