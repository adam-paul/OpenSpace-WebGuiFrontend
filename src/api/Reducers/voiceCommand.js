import actionTypes from '../Actions/actionTypes';

const defaultState = {
  status: 'idle',
  transcription: '',
  error: ''
};

const voiceCommand = (state = defaultState, action = {}) => {
  switch (action.type) {
    case actionTypes.updateVoiceCommand:
      if (action.payload.type === 'voice_status') {
        console.log('Voice command reducer - Current state:', JSON.stringify(state, null, 2));
        console.log('Voice command reducer - Received update:', JSON.stringify(action.payload, null, 2));
        
        const newState = {
          ...state,
          status: action.payload.status || state.status,
          transcription: action.payload.transcription || '',
          error: action.payload.error || ''
        };
        
        console.log('Voice command reducer - New state:', JSON.stringify(newState, null, 2));
        return newState;
      }
      return state;
    default:
      return state;
  }
};

export default voiceCommand; 