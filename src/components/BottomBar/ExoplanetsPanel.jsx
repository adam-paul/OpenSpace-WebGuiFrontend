import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  reloadPropertyTree,
  removeExoplanets,
  setPopoverVisibility,
  subscribeToProperty,
  unsubscribeToProperty,
} from '../../api/Actions';
import { ExoplanetsModuleEnabledKey, NavigationAimKey, NavigationAnchorKey } from '../../api/keys';
import propertyDispatcher from '../../api/propertyDispatcher';
import subStateToProps from '../../utils/subStateToProps';
import CenteredLabel from '../common/CenteredLabel/CenteredLabel';
import FilterList from '../common/FilterList/FilterList';
import Button from '../common/Input/Button/Button';
import MaterialIcon from '../common/MaterialIcon/MaterialIcon';
import Popover from '../common/Popover/Popover';
import Row from '../common/Row/Row';
import ScrollOverlay from '../common/ScrollOverlay/ScrollOverlay';
import PropertyOwner from '../Sidebar/Properties/PropertyOwner';
import styles from './ExoplanetsPanel.scss';
import FocusEntry from './Origin/FocusEntry';
import Picker from './Picker';

class ExoplanetsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starName: undefined,
    };
    this.togglePopover = this.togglePopover.bind(this);
    this.addSystem = this.addSystem.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.removeExoplanetSystem = this.removeExoplanetSystem.bind(this);
  }

  componentDidMount() {
    const { startListening } = this.props;
    startListening(ExoplanetsModuleEnabledKey);
  }

  componentWillUnmount() {
    const { stopListening } = this.props;
    stopListening(ExoplanetsModuleEnabledKey);
  }

  togglePopover() {
    this.props.setPopoverVisibility(!this.props.popoverVisible)
  }

  updateStarName(evt) {
    this.setState({
      starName: evt.target.value
    });
  }  

  onSelect(identifier, evt) {
    this.setState({
      starName: identifier
    });
  }

  removeExoplanetSystem(systemName) {
    const matchingAnchor =  (this.props.anchor.value.indexOf(systemName) == 0);
    const matchingAim =  (this.props.aim.value.indexOf(systemName) == 0);
    if ( matchingAnchor || matchingAim ) {
      this.props.anchorDispatcher.set('Sun');
      this.props.aimDispatcher.set('');
    }

    this.props.removeSystem(systemName);
  }

  addSystem() {
    this.props.luaApi.exoplanets.addExoplanetSystem(this.state.starName);
    // TODO: Once we have a proper way to subscribe to additions and removals
    // of property owners, this 'hard' refresh should be removed.
    setTimeout(() => {
      this.props.refresh();
    }, 500);
  }

  get popover() {
    const noContentLabel = <CenteredLabel>No active systems</CenteredLabel>;
    const renderables = this.props.exoplanetSystems;
    let panelContent;

    if (renderables.length === 0) {
      panelContent = noContentLabel;
    } else {
      panelContent = renderables.map(prop =>
        <PropertyOwner autoExpand={false}
                       key={prop}
                       uri={prop}
                       trashAction={this.removeExoplanetSystem}
                       expansionIdentifier={"P:" + prop} />
      )
    }

    return (
      <Popover
        className={Picker.Popover}
        title="Exoplanet Systems"
        closeCallback={this.togglePopover}
        detachable
        attached={true}
      >        
        <div className={Popover.styles.content}>
          <Row>
            { this.props.hasSystems ? (
              <FilterList
                data={this.props.systemList}
                className={styles.list}
                searchText={"Star name..."}
                viewComponent={FocusEntry}
                onSelect={this.onSelect}
                active={this.state.starName}
                searchAutoFocus
              />
            ) : (
              <CenteredLabel className={styles.redText}>
                No exoplanet data was loaded
              </CenteredLabel>
            )
            }
            <div className={Popover.styles.row}>
              <Button onClick={this.addSystem}
                      title="Add system"
                      style={{width: 90}}
                      disabled={!this.state.starName}>
                <MaterialIcon icon="public" />
                <span style={{marginLeft: 5}}>Add System</span>
              </Button>
            </div>
          </Row>
        </div>
        <hr className={Popover.styles.delimiter} />
        <div className={Popover.styles.title}>Exoplanet Systems </div>
        <div className={styles.slideList}>
          <ScrollOverlay>
            {panelContent}
          </ScrollOverlay>
        </div>
      </Popover>
    );
  }

  render() {
    const { enabled, popoverVisible } = this.props;

    if (!enabled) {
      return <></>;
    }

    return (
      <div className={Picker.Wrapper}>
        <Picker 
          className={`${popoverVisible && Picker.Active}`} 
          onClick={this.togglePopover}
        >
          <div>
            <MaterialIcon className={styles.photoIcon} icon="hdr_strong" />
          </div>
        </Picker>
        { popoverVisible && this.popover }
      </div>
    );
  }
}

const mapSubStateToProps = ({
  properties,
  propertyOwners,
  popoverVisible,
  luaApi,
  exoplanetsData,
  anchor,
  aim
}) => 
{
  var systems = [];
  for (const [key, value] of Object.entries(propertyOwners)) {
    if (value.tags.includes('exoplanet_system')) {
      systems.push("Scene." + value.identifier);
    }
  }

  const enabledProp = properties[ExoplanetsModuleEnabledKey];
  const enabled = enabledProp ? enabledProp.value : false;

  return {
    enabled,
    popoverVisible: popoverVisible,
    exoplanetSystems: systems,
    luaApi: luaApi,
    systemList: exoplanetsData,
    hasSystems: (exoplanetsData && exoplanetsData.length > 0),
    anchor: anchor,
    aim: aim
  }
};

const mapStateToSubState = (state) => ({
  properties: state.propertyTree.properties,
  propertyOwners: state.propertyTree.propertyOwners,
  popoverVisible: state.local.popovers.exoplanets.visible,
  luaApi: state.luaApi,
  exoplanetsData: state.exoplanets.data,
  anchor: state.propertyTree.properties[NavigationAnchorKey],
  aim: state.propertyTree.properties[NavigationAimKey],
});

const mapDispatchToProps = dispatch => ({
  setPopoverVisibility: visible => {
    dispatch(setPopoverVisibility({
      popover: 'exoplanets',
      visible
    }));
  },
  refresh: () => {
    dispatch(reloadPropertyTree());
  },
  removeSystem: (system) => {
    dispatch(removeExoplanets({
      system
    }));
  },
  startListening: (uri) => {
    dispatch(subscribeToProperty(uri));
  },
  stopListening: (uri) => {
    dispatch(unsubscribeToProperty(uri));
  },
  anchorDispatcher: propertyDispatcher(dispatch, NavigationAnchorKey),
  aimDispatcher: propertyDispatcher(dispatch, NavigationAimKey),  
})

ExoplanetsPanel = connect(
  subStateToProps(mapSubStateToProps, mapStateToSubState),
  mapDispatchToProps
)(ExoplanetsPanel);

export default ExoplanetsPanel;