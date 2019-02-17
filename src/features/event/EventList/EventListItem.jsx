import React, { Component } from 'react';
import { Segment, Item, Icon, List, Grid, Column, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { firestoreConnect} from 'react-redux-firebase';
import { connect } from 'react-redux';
import format from 'date-fns/format'
import EventListCounter from './EventListCounter'
import SubCategoryButton from '../../counter/buttons/SubCategoryButton';
import { objectToArray } from '../../../app/common/util/helpers';



const mapState = (state, ownProps) => {
  let eventState = {};
  let juniorVote = {};
  let mediorVote = {};
  let seniorVote = {};

  const eventStateProp = state.firestore.ordered.events.filter(e => e.id === ownProps.event.id)
  eventState = eventStateProp[0];
 
  if (eventState.likes) {
  const findLikeId = objectToArray(eventState.likes).filter(e => e.id === ownProps.auth.uid)
  juniorVote = findLikeId[0].juniorVote
  mediorVote = findLikeId[0].mediorVote
  seniorVote = findLikeId[0].seniorVote
  } else {
    juniorVote = false
    mediorVote = false
    seniorVote = false
  }

  return {
   eventState, 
   juniorVote, 
   mediorVote,
   seniorVote
  }
};


class EventListItem extends Component {
  render() {
    const {event, eventState, authenticated, juniorVote, mediorVote, seniorVote } = this.props

    return (
    <Grid columns={2} divided>
      <Grid.Column width={2} >
          <EventListCounter event={eventState} />
      </Grid.Column>
      <Grid.Column width={14}>
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
          <SubCategoryButton 
          event={eventState} 
          juniorVote={juniorVote} 
          mediorVote={mediorVote} 
          seniorVote={seniorVote} 
          authenticated={authenticated}
          />

          <Button as={Link} to={`/event/${event.id}`} color="teal" floated="right" content="View" />
        </Segment>
      </Segment.Group>
      </Grid.Column>
    </Grid>

   
    );
  }
}

export default compose(
  connect(mapState, null),
  firestoreConnect()
)(EventListItem);