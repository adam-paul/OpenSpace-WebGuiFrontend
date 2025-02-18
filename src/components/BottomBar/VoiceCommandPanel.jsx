import React from 'react';
import { MdMic } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { setPopoverVisibility } from '../../api/Actions';
import Button from '../common/Input/Button/Button';
import Popover from '../common/Popover/Popover';
import CenteredLabel from '../common/CenteredLabel/CenteredLabel';

import Picker from './Picker';

import styles from './VoiceCommandPanel.scss';

function VoiceCommandPanel() {
  const popoverVisible = useSelector((state) => state.local.popovers.voiceCommand?.visible);
  const dispatch = useDispatch();

  function togglePopover() {
    dispatch(setPopoverVisibility({
      popover: 'voiceCommand',
      visible: !popoverVisible
    }));
  }

  function popover() {
    return (
      <Popover
        title="Voice Commands"
        className={Picker.Popover}
        closeCallback={togglePopover}
      >
        <div className={styles.content}>
          <CenteredLabel>Voice command functionality coming soon...</CenteredLabel>
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