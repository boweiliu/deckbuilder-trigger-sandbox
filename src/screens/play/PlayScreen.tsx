import { PlayViewport } from '@/screens/play/PlayViewport';
import { PlayBoard } from '@/screens/play/PlayBoard';
import styles from './PlayScreen.module.css';

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

// aspectRatio = width / height
export const AutoWidth = (props: {width, height, ChildComponent, aspectRatio }) => {
    const { width, height, ChildComponent, aspectRatio = 4./7 } = props;

    return (<ChildComponent {...props} height={height} width={height * aspectRatio} />)
}

export const withAutoWidth = (ChildComponent) => {
    return (props) => (<AutoWidth {...props} ChildComponent={ChildComponent} />);
}

export const withAutoWidthSize = <PT,>(SizedChildComponent: (p: PT) => [Sizes, JSX.Element]): (p: PT) => [Sizes, JSX.Element] => {
    return (props) => (
        <AutoWidth {...props} ChildComponent={ChildComponent} />
    );
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

const BigCard = withPadding(12)(withAutoWidth(unSizer(defaultSizer(MyBigCard))))

function MyBigCard(props: { width, height }) {
  const { width, height } = props;
  return <div className={styles.singleInfoArea} style={{width, height}}>height {height} width {width}</div>
}

type Sizes = { width: number, height: number  }

function defaultSizer<T extends Sizes>(Component: (props: T) => JSX.Element) {
    return (props: T) => {
        return [{ width: props.width, height: props.height }, <Component {...props} />]
    }
}

function unSizer<T extends Sizes>(SizedComponent: (props: T) => [ Sizes, JSX.Element ]) {
    return (props: T) => {
        const [ , el ] = SizedComponent(props);
        return el;
    }
}

function PlayHud() {
  return null;
}
