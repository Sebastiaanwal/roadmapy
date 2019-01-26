import React, { Component } from 'react';
import { Segment, Item, Icon, List, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import format from 'date-fns/format'
import DecrementButton from '../../counter/buttons/DecrementButton'
import IncrementButton from '../../counter/buttons/IncrementButton'
import EventListCounter from './EventListCounter'

const mapState = (state, ownProps) => {
  let eventState = {};
  console.log(state.events[0].id)
  console.log(ownProps.event.id)

  const eventStateProp = state.firestore.ordered.events.filter(e => e.id === ownProps.event.id)
  console.log(eventStateProp)
  eventState = eventStateProp[0];
  console.log(eventStateProp[0])

  return {
   eventState
  }
};


class EventListItem extends Component {
  

  render() {
    const {event, eventState} = this.props
    return (
    <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={event.hostPhotoURL} />
              <Item.Content>
                <Item.Header as={Link} to={`/event/${event.id}`}>{event.title}</Item.Header>
                <Item.Description>
                  Hosted by <Link to={`/profile/${event.hostUid}`}>{event.hostedBy}</Link>
                </Item.Description>
                {event.cancelled &&
                <Label style={{top: '-40px'}} ribbon='right' color='red' content='This event has been cancelled'/>}
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name="clock" /> {format(event.date.toDate(), 'dddd Do MMMM')} at {format(event.date.toDate(), 'HH:mm')}|
            <Icon name="marker" /> {event.venue}
          </span>
        </Segment>
        <Segment secondary>
          <span>{event.description}</span>
        </Segment>
        <Segment clearing>
          <IncrementButton event={eventState}  />
          <DecrementButton event={eventState} />
          <EventListCounter event={eventState} />
          <Button as={Link} to={`/event/${event.id}`} color="teal" floated="right" content="View" />
        </Segment>
      </Segment.Group>
    );
  }
}

export default compose(
  connect(mapState, null),
  firestoreConnect(),
)(EventListItem);