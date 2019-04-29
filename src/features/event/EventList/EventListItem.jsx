import React, { Component } from 'react';
import { Segment, Item, Icon, List, Grid, Column, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { firestoreConnect} from 'react-redux-firebase';
import { connect } from 'react-redux';
import distanceInWords from 'date-fns/distance_in_words';
import EventListCounter from './EventListCounter'
import SubCategoryButton from '../../counter/buttons/SubCategoryButton';
import { objectToArray } from '../../../app/common/util/helpers';



const mapState = (state, ownProps) => {
  let eventState = {};
  let juniorVote = {};
  let mediorVote = {};
  let seniorVote = {};
  let findLikeId = {};

  const eventStateProp = state.firestore.ordered.events.filter(e => e.id === ownProps.event.id)
  eventState = eventStateProp[0];
 
  if (eventState.likes) {
  findLikeId = objectToArray(eventState.likes).filter(e => e.id === ownProps.auth.uid)
  } else {
    juniorVote = false
    mediorVote = false
    seniorVote = false
  }

  findLikeId = findLikeId[0]

  if (findLikeId) {
    juniorVote = findLikeId.juniorVote
    mediorVote = findLikeId.mediorVote
    seniorVote = findLikeId.seniorVote
    } else {
      juniorVote = false
      mediorVote = false
      seniorVote = false
    }

  return {
   eventState, 
   juniorVote, 
   mediorVote,
   seniorVote,
   findLikeId
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
              <Item.Content>
                <Item.Header as={Link} to={`/event/${event.id}`}>{event.title}</Item.Header>
                <Item.Description>
                  Created by <Link to={`/profile/${event.hostUid}`}>{event.hostedBy}</Link> {distanceInWords(event.created, Date.now())} ago
                </Item.Description>
         
                {event.cancelled &&
                <Label style={{top: '-40px'}} ribbon='right' color='red' content='This event has been cancelled'/>}
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
     {/*    <Segment secondary>
          <span>{event.description}</span>
        </Segment> */}
          <SubCategoryButton 
          event={eventState} 
          juniorVote={juniorVote} 
          mediorVote={mediorVote} 
          seniorVote={seniorVote} 
          authenticated={authenticated}
          />
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