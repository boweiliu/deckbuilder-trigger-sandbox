import { PlayViewport } from '@/screens/play/PlayViewport';
import { PlayBoard } from '@/screens/play/PlayBoard';
import styles from './PlayScreen.module.css';

export const GrayBorder = (props: { width, height, ChildComponent, borderWidth }) => {
    const { width, height, ChildComponent, borderWidth = 6 } = props;

    return (<div className={styles.grayBorder} style={{ borderWidth: borderWidth + 'px' }}>
      <ChildComponent width={width - 2  * borderWidth} height={height - 2  * borderWidth} />
    </div>);
}

export const withGrayBorder = (ChildComponent) => {
    return (props) => (<GrayBorder ChildComponent={ChildComponent} {...props} />)
}

export const Padding = (props: {width, height, ChildComponent, padding }) => {
    const { width, height, ChildComponent, padding = 16 } = props;

    return (<div className={styles.withPadding} style={{ padding: padding + 'px' }}>
      <ChildComponent width={width - 2  * padding} height={height - 2  * padding} />
    </div>);
}

export const withPadding = (ChildComponent) => {
    return (props) => (<Padding ChildComponent={ChildComponent} {...props} />);
}

export const PlayScreen = withGrayBorder(withPadding(MyPlayScreen));

export function MyPlayScreen(props: { width: number, height: number }) {
  const { width, height } = props;
  return (
    <div className={styles.playScreenContainer} >
        <div className={styles.rowsWrapper} style={{height}}>width {width}</div>
        <div className={styles.singleInfoArea} style={{height, width: height/1.75}}>height {height}</div>
    </div>
  );
}

function FixedAspectRatio(props: { children }) {
    const { children  } = props;

    return (
        <div style={{position: 'absolute', height: '100%'}}>
        <svg xmlns="http://www.w3.org/2000/svg" height="175" width="100" style={{ height: '100%', width: 'auto' }}/>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'red'}}>
        {children}
        </div>
        </div>)
}

function PlayHud() {
  return null;
}
