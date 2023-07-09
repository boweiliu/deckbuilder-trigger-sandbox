import { PlayViewport } from '@/screens/play/PlayViewport';
import { PlayBoard } from '@/screens/play/PlayBoard';
import styles from './PlayScreen.module.css';

export const GrayBorder = (props: { width, height, ChildComponent, borderWidth }) => {
    const { width, height, ChildComponent, borderWidth = 6 } = props;

    return (<div className={styles.grayBorder} style={{ borderWidth: borderWidth + 'px' }}>
      <ChildComponent width={width - 2  * borderWidth} height={height - 2  * borderWidth} />
    </div>);
}

export function PlayScreen(props: { width: number, height: number }) {
    const { width, height } = props;
    return (<GrayBorder
    width={width}
    height={height}
    ChildComponent={MyPlayScreen}
    />);
}

export function MyPlayScreen(props: { width: number, height: number }) {
  const { width, height  } = props;
  return (
    <div className={styles.playScreenContainer}>
      <div>hello</div>
    </div>
  );
}

function PlayHud() {
  return null;
}
