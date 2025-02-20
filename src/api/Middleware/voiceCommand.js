import { updateVoiceCommand } from '../Actions';
import actionTypes from '../Actions/actionTypes';
import api from '../api';

let topic;
let dataCallback;
let nSubscribers = 0;

const subscribe = () => {
  topic = api.startTopic('voice', {
    event: 'start_subscription'
  });
  (async () => {
    for await (const data of topic.iterator()) {
      if (dataCallback) {
        dataCallback(data);
      }
    }
  })();
};

const unsubscribe = () => {
  if (!topic) {
    return;
  }
  topic.talk({ event: 'stop_subscription' });
  topic.cancel();
  topic = null;
};

const refresh = () => {
  if (!topic) {
    return;
  }
  topic.talk({ event: 'refresh' });
};

const confirmTranscription = () => {
  if (!topic) {
    return;
  }
  topic.talk({ 
    action: 'confirm_transcription'
  });
};

const voiceCommand = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  switch (action.type) {
    case actionTypes.onOpenConnection:
      if (nSubscribers > 0) {
        dataCallback = (data) => store.dispatch(updateVoiceCommand(data));
        subscribe();
      }
      break;
    case actionTypes.subscribeToVoiceCommand:
      ++nSubscribers;
      if (nSubscribers === 1 && state.connection.isConnected) {
        dataCallback = (data) => store.dispatch(updateVoiceCommand(data));
        subscribe();
      }
      break;
    case actionTypes.unsubscribeToVoiceCommand:
      --nSubscribers;
      if (nSubscribers === 0) {
        unsubscribe();
      }
      break;
    case actionTypes.refreshVoiceCommand:
      refresh();
      break;
    case actionTypes.confirmTranscription:
      confirmTranscription();
      break;
    default:
      break;
  }
  return result;
};

export default voiceCommand; 