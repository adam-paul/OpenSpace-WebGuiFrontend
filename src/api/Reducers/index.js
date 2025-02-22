import camera from './camera';
import cameraPath from './cameraPath';
import connection from './connection';
import documentation from './documentation';
import engineMode from './engineMode';
import exoplanets from './exoplanets';
import fetchData from './fetchData';
import groups from './groups';
import local from './local';
import luaApi from './luaApi';
import missions from './missions';
import propertyTree from './propertyTree';
import sessionRecording from './sessionRecording';
import shortcuts from './shortcuts';
import skybrowser from './skybrowser';
import storyTree from './storyTree';
import time from './time';
import userPanels from './userPanels';
import version from './version';
import voiceCommand from './voiceCommand';

// Add more reducers here
const openspaceApp = (state = {}, action = {}) => {
  const propertyTreeReducer = propertyTree(state.propertyTree, action);
  const shortcutsReducer = shortcuts(state.shortcuts, action);
  return {
    propertyTree: propertyTreeReducer,
    shortcuts: shortcutsReducer,
    groups: groups(state.groups, action, propertyTreeReducer, shortcutsReducer),
    time: time(state.time, action),
    connection: connection(state.connection, action),
    camera: camera(state.camera, action),
    cameraPath: cameraPath(state.cameraPath, action),
    documentation: documentation(state.documentation, action),
    exoplanets: exoplanets(state.exoplanets, action),
    skybrowser: skybrowser(state.skybrowser, action),
    engineMode: engineMode(state.engineMode, action),
    sessionRecording: sessionRecording(state.sessionRecording, action),
    local: local(state.local, action),
    luaApi: luaApi(state.luaApi, action),
    fetchData: fetchData(state.fetchData, action),
    storyTree: storyTree(state.storyTree, action),
    version: version(state.version, action),
    userPanels: userPanels(state.userPanels, action),
    missions: missions(state.missions, action),
    voiceCommand: voiceCommand(state.voiceCommand, action)
  };
};

export default openspaceApp;
