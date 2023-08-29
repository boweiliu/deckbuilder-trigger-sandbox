import { FC, CSSProperties } from 'react';
import classnames from 'classnames';
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


export function getAdaptiveBorderRadius(props: Sizes): number {
  const { width, height } = props;
  const shorter = Math.min(width, height);
  return shorter * 0.080;
}

export const withBorderSized: (
  width: CallbackOrValue<number>,
  opts: { style?: CSSProperties; className?: string, isRounded?: boolean }
) => HOCSized = (widthOrCallback, opts = {}) => {
  return <T extends Sizes>(SizedChildComponent: FCSized<T>) => {
    return (props: T) => {
      const { width: availableWidth, height: availableHeight } = props;

      const borderWidth = getValue(widthOrCallback, props);

        // compute the available size of the child by subtracting the border
      const childAvailableSizes = {
        height: availableHeight - 2 * borderWidth,
        width: availableWidth - 2 * borderWidth,
      };
      const childBorderRadius = opts.isRounded ? getAdaptiveBorderRadius(childAvailableSizes) : 0;
      const borderRadius = opts.isRounded ? childBorderRadius + borderWidth : 0;
      // const borderRadius = opts.isRounded ? getAdaptiveBorderRadius(props) : 0;

        // invoke child
      const [childRenderedSizes, children] = SizedChildComponent({
          borderRadius: childBorderRadius + borderWidth * 0.0, // increase child radius by a little so it doesn't interact with the parent even after pixel rounding
        ...props,
        ...childAvailableSizes,
      });

        // get the rendered size of the child and add the border back
      const { width: renderedWidth, height: renderedHeight } =
        childRenderedSizes;

      const mySizes = {
        width: renderedWidth + 2 * borderWidth,
        height: renderedHeight + 2 * borderWidth,
      };

      return [
        mySizes,
        // eslint-disable-next-line react/jsx-key
        <div
          className={classnames(styles.withBorder, opts.className)}
          style={{
            width: mySizes.width,
            height: mySizes.height,
            borderWidth,
            borderRadius,
            ...(opts.style || {}),
          }}
        >
          {children}
        </div>,
      ];
    };
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

// export const withPaddingSized: (p: CallbackOrValue<number>) => HOCSized = (
  // paddingOrCallback
// ) => {
  // return <T extends Sizes>(SizedChildComponent: FCSized<T>) => {
export const withAutoWidthSized: (a: CallbackOrValue<number>) => HOCSized = ( aspectRatioOrCallback ) => {
    return <T extends Sizes>(SizedChildComponent: FCSized<T>) => {
        return (props: T) => {

            const aspectRatio = getValue(aspectRatioOrCallback, props);
    // grab the available sizes, as passed down from our wrapper
    const {
      width: availableWidth,
      height: availableHeight,
      // aspectRatio = 8 / 13,
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
        }
    }
}

// aspectRatio = width / height
export const withAutoWidthSized3 = <T extends Sizes & { aspectRatio?: number }>(
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
