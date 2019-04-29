import React, { Component } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase';
import { getCategoryEvents } from '../eventActions';
import EventList from '../EventList/EventList';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../EventActivity/EventActivity';
import CategoryMenu from '../EventCategory/CategoryMenu'


const mapState = (state, ownProps) => {
  
const category = ownProps.match.params.id;
const subCategory = ownProps.match.params.sub;

  return {
    category,
    subCategory,
    events: state.events,
    loading: state.async.loading,
    activities: state.firestore.ordered.activity,
    auth: state.firebase.auth,
  }
}

const actions = {
  getCategoryEvents
};

class CategoryPage extends Component {
  state = {
    moreEvents: false,
    loadingInitial: true,
    loadedEvents: [],
    
  };

  async componentDidMount() {
    const { firestore, category, subCategory } = this.props;
    await firestore.get(`events/`);
  
    await firestore.setListener(`events/`);
    let next = await this.props.getCategoryEvents(category, subCategory);
    if (next && next.docs) {
      this.setState({
        moreEvents: true,
        loadingInitial: false
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.events !== nextProps.events) {
      this.setState({
        loadedEvents: [...this.state.loadedEvents, ...nextProps.events]
      });
    }
  }

  getNextEvents = async () => {
    const { events, category, subCategory } = this.props;
    let lastEvent = events && events[events.length - 1];
    let next = await this.props.getCategoryEvents(category, subCategory, lastEvent);
    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreEvents: false
      });
    }
  };
  //ik (Bram) snap het gebruik van ref niet wrapped over Eventlist.

  render() {
    const { loading, activities, match, auth } = this.props;
    const { moreEvents, loadedEvents } = this.state;
    if (this.state.loadingInitial) return <LoadingComponent inverted={true} />;

    return (
      <Grid>
        <Grid.Column width={10}>
          <CategoryMenu category={match.params.id} />
          <EventList
            loading={loading}
            moreEvents={moreEvents}
            events={loadedEvents}
            getNextEvents={this.getNextEvents}
            changeTab={this.changeTab}
            auth={auth}
          />
        

        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity activities={activities} contextRef={this.state.contextRef} />

        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loading}/>
        </Grid.Column>
      </Grid>
    );
  }
}

export default compose(connect(mapState, actions)(firestoreConnect()(CategoryPage)));


