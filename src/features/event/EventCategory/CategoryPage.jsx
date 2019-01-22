import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux'
import CategoryDetailedEvents from './CategoryDetailedEvents'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { getCategoryEvents } from '../../event/eventActions'

const mapState = (state, ownProps) => {
  
    const category = ownProps.match.params.id;
  
  return {
    category,
    events: state.events,
    eventsLoading: state.async.loading,
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting,
  }
}

const actions = {
    getCategoryEvents
}

class CategoryPage extends Component {

  async componentDidMount() {
    const events = await this.props.getCategoryEvents(this.props.category);
    console.log(events);
  }

  changeTab = (e, data) => {
    this.props.getCategoryEvents(this.props.category, data.activeIndex)
  }

  render() {
    const {requesting, events, eventsLoading, category } = this.props;
    
    const loading = requesting[`category/${category}`]

    if (loading) return <LoadingComponent inverted={true}/>
    return (
      <Grid>
        <CategoryDetailedEvents changeTab={this.changeTab} events={events} eventsLoading={eventsLoading}/>
      </Grid>
    );
  }
}

export default compose(
  connect(mapState, actions),
)(CategoryPage);
