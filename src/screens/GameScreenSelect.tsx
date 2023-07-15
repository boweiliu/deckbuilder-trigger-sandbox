import { useState } from 'react';
import classnames from 'classnames';
import { RotationCheck } from '@/screens/RotationCheck';
import { StartMenu } from '@/screens/StartMenu';
import { PlayScreen } from '@/screens/play/PlayScreen';
import { PauseMenu } from '@/screens/PauseMenu';
import styles from './GameScreenSelect.module.css';
import { FullscreenContext } from '@/hooks/useFullscreen';

const defaultScreenStateAfterRotationCheck = 'play';

export function GameScreenSelect(props: {
  size: { isLandscape: boolean; width: number; height: number };
  setSize: () => void;
  fullscreenContext: FullscreenContext;
}) {
  const {
    size: { isLandscape, width, height },
  } = props;
  const [screenState, setScreenState] = useState<string>('rotationCheck');

  const gameSize = {
    width: isLandscape ? width : height,
    height: isLandscape ? height : width,
  };
  return (
    <>
      {screenState === 'rotationCheck' ? (
        <RotationCheck
          {...props}
          onStart={() => setScreenState(defaultScreenStateAfterRotationCheck)}
        />
      ) : null}

      {screenState !== 'rotationCheck' ? (
        <div
          className={classnames(
            styles.rotationContainer,
            isLandscape ? undefined : styles.rotate
          )}
          style={{
            ...gameSize,
            top: isLandscape ? 0 : height,
          }}
        >
          {screenState === 'startMenu' ? (
            <StartMenu setScreenState={setScreenState} />
          ) : null}
          {screenState === 'play' ? <PlayScreen {...gameSize} /> : null}
          {screenState === 'pauseMenu' ? <PauseMenu /> : null}
        </div>
      ) : null}
    </>
  );
}
