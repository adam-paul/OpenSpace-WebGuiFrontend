import React, { useEffect } from 'react';
import { MdMic, MdStop } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { setPopoverVisibility, subscribeToVoiceCommand, unsubscribeToVoiceCommand } from '../../api/Actions';
import Button from '../common/Input/Button/Button';
import Popover from '../common/Popover/Popover';
import CenteredLabel from '../common/CenteredLabel/CenteredLabel';
import { useLuaApi } from '../../api/hooks';

import Picker from './Picker';

import styles from './VoiceCommandPanel.scss';

function VoiceCommandPanel() {
  const popoverVisible = useSelector((state) => state.local.popovers.voiceCommand?.visible);
  const isConnected = useSelector((state) => state.connection.isConnected);
  const voiceState = useSelector((state) => state.voiceCommand);
  const luaApi = useLuaApi();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Voice Command Panel - Connection Status:', isConnected);
    console.log('Voice Command Panel - Voice State:', voiceState);
    console.log('Voice Command Panel - Lua API:', luaApi ? 'Available' : 'Not Available');
    
    dispatch(subscribeToVoiceCommand());
    return () => dispatch(unsubscribeToVoiceCommand());
  }, []);

  function togglePopover() {
    dispatch(setPopoverVisibility({
      popover: 'voiceCommand',
      visible: !popoverVisible
    }));
  }

  const startRecording = async () => {
    if (!isConnected || !luaApi) {
      console.log('Cannot start recording - Connection:', isConnected, 'LuaApi:', !!luaApi);
      return;
    }

    try {
      console.log('Attempting to start recording...');
      await luaApi.voice.startRecording();
      console.log('Recording started successfully');
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!isConnected || !luaApi) return;

    try {
      await luaApi.voice.stopRecording();
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  function popover() {
    return (
      <Popover
        title="Voice Commands"
        className={Picker.Popover}
        closeCallback={togglePopover}
      >
        <div className={styles.content}>
          {voiceState.error ? (
            <CenteredLabel className={styles.error}>{voiceState.error}</CenteredLabel>
          ) : voiceState.transcription ? (
            <>
              <CenteredLabel>Transcription:</CenteredLabel>
              <CenteredLabel>{voiceState.transcription}</CenteredLabel>
            </>
          ) : (
            <Button
              onClick={voiceState.status === 'recording' ? stopRecording : startRecording}
              className={`${styles.recordButton} ${voiceState.status === 'recording' ? styles.recording : ''}`}
              disabled={voiceState.status === 'processing' || !isConnected || !luaApi}
            >
              {voiceState.status === 'recording' ? (
                <>
                  <MdStop className={styles.icon} />
                  Stop Recording
                </>
              ) : (
                <>
                  <MdMic className={styles.icon} />
                  {!isConnected ? 'Connecting...' : 
                   !luaApi ? 'Loading...' :
                   voiceState.status === 'processing' ? 'Processing...' : 
                   'Start Recording'}
                </>
              )}
            </Button>
          )}
          {voiceState.status === 'processing' && (
            <CenteredLabel>Processing audio...</CenteredLabel>
          )}
        </div>
      </Popover>
    );
  }

  return (
    <div className={Picker.Wrapper}>
      <Picker
        onClick={togglePopover}
        refKey="VoiceCommand"
        className={`${popoverVisible && Picker.Active}`}
      >
        <MdMic className={Picker.Icon} />
      </Picker>
      {popoverVisible && popover()}
    </div>
  );
}

export default VoiceCommandPanel; 