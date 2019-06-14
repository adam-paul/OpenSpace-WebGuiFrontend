import { applyMiddleware } from 'redux';
import { propertyTree } from './propertyTree';
import { time } from './time';
import { connection } from './connection';
import { shortcuts } from './shortcuts';
import { version } from './version';
import { sessionRecording } from './sessionRecording';
import logger from './logger';

const middleware = applyMiddleware(
  //logger, // middleWare for logging state change
  propertyTree,
  time,
  sessionRecording,
  connection,
  shortcuts,
  version
);

export default middleware;
