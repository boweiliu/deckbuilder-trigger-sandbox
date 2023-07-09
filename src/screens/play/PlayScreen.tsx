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
      <div style={{ width: 'calc(100% - 8px)', height: 'calc(35% - 8px)', backgroundColor: '#333', display: 'flex', padding: '4px', border: 'solid 2px #ccc', borderRadius: '6px', margin: '4px', 'overflowX': 'auto',   'overscrollBehavior': 'contain',  'scrollbarWidth': 'none', }} id="cards-container">
        <div style={{ margin: '4px', backgroundColor: 'blue', minWidth: '150px', 'marginLeft': 'auto', }}>card 1</div>
        <div style={{ margin: '4px', backgroundColor: 'blue', minWidth: '150px', }}>card 2</div>
        <div style={{ margin: '4px', backgroundColor: 'blue', minWidth: '150px', }}>card 4</div>
        <div style={{ margin: '4px', backgroundColor: 'blue', minWidth: '150px', }}>card 5</div>
        <div style={{ margin: '4px', backgroundColor: 'blue', minWidth: '150px', }}>card 5</div>
        <div style={{ margin: '4px', backgroundColor: 'blue', minWidth: '150px', }}>card 5</div>
        <div style={{ margin: '4px', backgroundColor: 'blue', minWidth: '150px', }}>card 6</div>
        <div style={{ margin: '4px', backgroundColor: 'blue', minWidth: '150px', 'marginRight': 'auto', }}>card 3</div>
      </div>
    </div>
  );
}

function PlayHud() {
  return null;
}
