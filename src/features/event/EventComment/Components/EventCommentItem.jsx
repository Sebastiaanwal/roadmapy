import React, { Component } from 'react';
import { Segment, Item, Icon, List, Grid, Column, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { firebaseConnect, withFirestore} from 'react-redux-firebase';
import { connect } from 'react-redux';
/* import EventAnswerCounter from './EventAnswerCounter'
import AnswerVoteButton from '../../../counter/buttons/AnswerVoteButton' */
import { objectToArray } from '../../../../app/common/util/helpers';
import { debounce } from "debounce";


const mapState = (state, ownProps) => {
  let answerState = {};

  
  if (state.firestore.ordered.event_comment && state.firestore.ordered.event_comment[0]) {
    const answerInArray = state.firestore.ordered.event_comment.filter(e => e.id === ownProps.comment.id);
    answerState = answerInArray[0]
  }
 

    return {
      answerState, 
      uid: state.firebase.auth.uid
  }
}


class EventCommentItem extends Component {


  render() {
    const {comment, answerState, eventId, uid} = this.props

    return (
    <Grid columns={2} divided>
      <Grid.Column width={2} >
          {/* <EventAnswerCounter newVotes={answerState.votes} /> */}
      </Grid.Column>
      <Grid.Column width={14}>
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={comment.photoURL} />
              <Item.Content>
                <Item.Header>Titel header!</Item.Header>
                <Item.Description>
                  Hosted by <Link to={`/profile/${comment.userUid}`}>{comment.displayName}</Link>
                </Item.Description>
                {comment.cancelled &&
                <Label style={{top: '-40px'}} ribbon='right' color='red' content='This event has been cancelled'/>}
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment secondary>
          <span>{comment.description}</span>
        </Segment>
        <Segment clearing>
      {/*       <AnswerVoteButton
              eventId={eventId}
              voted={"up"}
              newAnswer={newAnswer}
              onClick={this.handleClick}
              content={"upvote"}
            />
            
            <AnswerVoteButton
              eventId={eventId}
              voted={"down"}
              newAnswer={newAnswer}
              onClick={this.handleClick}
              content={"downvote"}
            /> */}
             {uid === answerState.uid && 
          <Button
            as={Link}
            to={`/answer/${answerState.id}`}
            color="orange"
          >
            Edit
          </Button>
        }
          <Button as={Link} to={`/event/${comment.id}`} color="teal" floated="right" content="View" />
        </Segment>
      </Segment.Group>
      </Grid.Column>
    </Grid>

   
    );
  }
}

export default compose(
  withFirestore,
  connect(mapState, null),
  firebaseConnect()
)(EventCommentItem);