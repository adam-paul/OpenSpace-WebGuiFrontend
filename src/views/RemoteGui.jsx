import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setShowAbout, startConnection } from '../api/Actions';
import { formatVersion, isCompatible, RequiredOpenSpaceVersion, RequiredSocketApiVersion } from '../api/Version';
import BottomBar from '../components/BottomBar/BottomBar';
import Error from '../components/common/Error/Error';
import Button from '../components/common/Input/Button/Button';
import Overlay from '../components/common/Overlay/Overlay';
import Stack from '../components/common/Stack/Stack';
import NodeMetaContainer from '../components/NodeMetaPanel/NodeMetaContainer';
import NodePopOverContainer from '../components/NodePropertiesPanel/NodePopOverContainer';
import Sidebar from '../components/Sidebar/Sidebar';
import '../styles/base.scss';
import About from './About/About';
import styles from './RemoteGui.scss';

function RemoteGui({ startConnection, version, hideAbout, connectionLost, showAbout }) {
  let hasCheckedVersion = false;
  
  React.useEffect(() => {
    startConnection();
  }, []);
  
  function reloadGui() {
    location.reload();
  }
  
  if (!hasCheckedVersion && version.isInitialized) {
    const versionData = version.data;
    if (!isCompatible(
      versionData.openSpaceVersion, RequiredOpenSpaceVersion))
    {
      console.warn(
        'Possible incompatibility: \nRequired OpenSpace version: ' +
        formatVersion(RequiredOpenSpaceVersion) +
        '. Currently controlling OpenSpace version ' +
        formatVersion(versionData.openSpaceVersion) + '.'
      );
    }
    if (!isCompatible(
      versionData.socketApiVersion, RequiredSocketApiVersion))
    {
      console.warn(
        "Possible incompatibility: \nRequired Socket API version: " +
        formatVersion(RequiredSocketApiVersion) +
        ". Currently operating over API version " +
        formatVersion(versionData.socketApiVersion) + '.'
      );
    }
    hasCheckedVersion = true;
  }

  return (
    <div className={styles.app}>
      { showAbout && (
        <Overlay>
          <Stack style={{ maxWidth: '500px' }}>
            <Button style={{ alignSelf: 'flex-end', color: 'white' }} onClick={hideAbout}>
              Close
            </Button>
            <About />
          </Stack>
        </Overlay>
      )}
      { connectionLost && (
        <Overlay>
          <Error>
            <h2>Houston, we've had a...</h2>
            <p>...disconnection between the user interface and OpenSpace.</p>
            <p>Trying to reconnect automatically, but you may want to...</p>
            <Button className={Error.styles.errorButton} onClick={reloadGui}>Reload the user interface</Button>
          </Error>
        </Overlay>
      )}
      <section className={styles.Grid__Left}>
        <Sidebar />
      </section>
      <section className={styles.Grid__Right}>
        <NodePopOverContainer />
        <NodeMetaContainer />
        <BottomBar showFlightController={true}/>
      </section>
    </div>
  );
}

const mapStateToProps = state => ({
  connectionLost: state.connection.connectionLost,
  version: state.version,
  showAbout: state.local.showAbout
});

const mapDispatchToProps = dispatch => ({
  startConnection: () => {
    dispatch(startConnection());
  },
  hideAbout: () => {
    dispatch(setShowAbout(false))
  }
});

RemoteGui = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RemoteGui);

export default RemoteGui;
