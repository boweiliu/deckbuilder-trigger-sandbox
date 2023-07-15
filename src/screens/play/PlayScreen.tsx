import { PlayViewport } from '@/screens/play/PlayViewport';
import { PlayBoard } from '@/screens/play/PlayBoard';
import styles from './PlayScreen.module.css';


export type Sizes = { width: number, height: number  }
export type FCS<T extends Sizes> = FC<T>;
export type Sized<C> = [Sizes, C];
export type FCSized<T extends Sizes> = (...args: Parameters<FCS<T>>) => Sized<ReturnType<FCS<T>>>;
export type HOCSized = <T extends Sizes,>(c: FCSized<T>) => FCSized<T>;


export const GrayBorder = (props: { width, height, ChildComponent, borderWidth }) => {
    const { width, height, ChildComponent, borderWidth = 6 } = props;

    return (<div className={styles.grayBorder} style={{ borderWidth: borderWidth + 'px' }}>
      <ChildComponent {...props} width={width - 2  * borderWidth} height={height - 2  * borderWidth} />
    </div>);
}

export const withGrayBorder = (ChildComponent) => {
    return (props) => (<GrayBorder {...props} ChildComponent={ChildComponent} />)
}

export const Padding = (props: {width, height, ChildComponent, padding }) => {
    const { width, height, ChildComponent, padding } = props;

    return (<div className={styles.withPadding} style={{ padding: padding + 'px' }}>
      <ChildComponent {...props} width={width - 2  * padding} height={height - 2  * padding} />
    </div>);
}

export const withPadding = (padding) => {
    return ((ChildComponent) => {
        return (props) => (<Padding {...props} padding={padding} ChildComponent={ChildComponent} />);
    })
}

export const withPaddingSized: ((p: number) => HOCSized) = (padding) => {
    return <T extends Sizes,>(SizedChildComponent: FCSized<T>) => {
        return (props: T) => {
            const { width: availableWidth, height: availableHeight } = props;

            const childAvailableSizes = { height: availableHeight - 2 * padding, width: availableWidth - 2 * padding };

            const [ childRenderedSizes, children ] = SizedChildComponent({...props, ...childAvailableSizes});

            const { width: renderedWidth, height: renderedHeight } = childRenderedSizes;

            return [ {width: renderedWidth + 2 * padding, height: renderedHeight + 2 * padding}, (
                <div className={styles.withPadding} style={{ padding: padding + 'px' }}>
                    {children}
                </div>
            ) ];
        };
    };
};


// aspectRatio = width / height
export const withAutoWidthSized = <T extends Sizes,>(SizedChildComponent: FCSized<T>): FCSized<T> => {
    return (props) => {
        // grab the available sizes, as passed down from our wrapper
        const { width: availableWidth, height: availableHeight, aspectRatio = 4./7 } = props;

        // compute the sizes available to the child
        const childAvailableSizes = { height: availableHeight, width: availableHeight * aspectRatio };

        // invoke the child
        const [ childRenderedSizes, children ] = SizedChildComponent({...props, ...childAvailableSizes});

        return [ childRenderedSizes, children ];
    };
}


// Reading in order, goes outside in. so for instance here we apply gray border then apply padding.
export const PlayScreen = withGrayBorder(withPadding(16)(MyPlayScreen));

export function MyPlayScreen(props: { width: number, height: number }) {
  const { width, height } = props;
  return (
    <div className={styles.playScreenContainer} >
        <div className={styles.rowsWrapper} style={{height}}>width {width} height {height}</div>
        <BigCard width={width} height={height} />
    </div>
  );
}

// const { rendered: renderedBigCard, width, height } = useMeasureRender(BigCard, { height });
// ...
// return (<> {renderedBigCard} </>)

// const RowsWrapperAndBigCard = withLeftRight({ padding: 16 })(MyRowsWrapper, BigCard);

// export const withLeftRight = (args: { padding: number  }) => {
//     const { padding  } = args;
//     return (Child1, Child2) => {
//         return (props: { width, height }) => {
//             const { width, height } = props;
//             return (<>
//                 <Child1 {...props} height={height} width={}/>
//                 <div width={padding} height={height} />
//                 <Child2 {...props} />
//                 </>);
// 
//         }
//     }
// }

const MyRowsWrapper = (props: { width, height }) => {
  const { width, height } = props;
    return (<div className={styles.rowsWrapper} style={{width, height}}>width {width} height {height}</div>);
}

const BigCard = unSizer(withPaddingSized(12)(withAutoWidthSized(defaultSizer(MyBigCard))))
// const BigCard = withPadding(12)(unSizer(withAutoWidthSized(defaultSizer(MyBigCard))))

function MyBigCard(props: { width, height }) {
  const { width, height } = props;
  return <div className={styles.singleInfoArea} style={{width, height}}>height {height} width {width}</div>
}

function defaultSizer<T extends Sizes>(Component: FCS<T>): FCSized<T> {
    return (props: T) => {
        return [{ width: props.width, height: props.height }, (<Component {...props} />)]
    }
}

function unSizer<T extends Sizes>(SizedComponent: FCSized<T>): FCS<T>{
    return (props: T) => {
        const [ , el ] = SizedComponent(props);
        return el;
    }
}

function PlayHud() {
  return null;
}
