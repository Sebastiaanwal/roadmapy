import React, { Component } from 'react';
import { Segment, Item, Icon, List, Grid, Column, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { firebaseConnect, withFirestore} from 'react-redux-firebase';
import { connect } from 'react-redux';
import EventAnswerCounter from './EventAnswerCounter'
import {deleteAnswer} from '../answerActions'
import AnswerVoteButton from '../../../counter/buttons/AnswerVoteButton'
import { objectToArray } from '../../../../app/common/util/helpers';
import { debounce } from "debounce";
import distanceInWords from 'date-fns/distance_in_words';



const mapState = (state, ownProps) => {
  let answerState = {};
  let currentVoteUser = {};
  let findVoteId = {};

  
  if (state.firestore.ordered.event_answer && state.firestore.ordered.event_answer[0]) {
    const answerInArray = state.firestore.ordered.event_answer.filter(e => e.id === ownProps.answer.id);
    answerState = answerInArray[0]
  }
 
 if (answerState.voters) {
    findVoteId = objectToArray(answerState.voters).filter(e => e.uid === state.firebase.auth.uid)
    } else {
      currentVoteUser = 0
    }
  
    findVoteId = findVoteId[0]
  
    if (findVoteId) {
      currentVoteUser = findVoteId.voteUser
      } else {
        currentVoteUser = 0
      }

    return {
      answerState, 
      currentVoteUser, 
      uid: state.firebase.auth.uid
  }
}

const actions = {
  deleteAnswer
};


class EventAnswerItem extends Component {

  state = {
    votes: {},
    voteUser: {}
  };
  
  handleClick = debounce((button) => {
    if (button === 'up') {
      this.handleUpVote()
    } else if (button === 'down') {
      this.handleDownVote()
    }
  }, 2000)
  
  handleUpVote = () => {
    const {currentVoteUser, answerState} = this.props

    if (currentVoteUser === 1 ) {
      this.setState({
        votes: answerState.votes -1,
        voteUser: 0
    }) 
    } else if ( currentVoteUser === -1 ) {
      this.setState({
        votes: answerState.votes + 1,
        voteUser: 0
      }) 
    } else if ( currentVoteUser === 0 ) {
      this.setState({
        votes: answerState.votes + 1,
        voteUser: 1
      }) 
    }
  };
  
  handleDownVote = () =>  {
    const {currentVoteUser, answerState} = this.props
    console.log(currentVoteUser)
    if ( currentVoteUser === 1 ) { 
      this.setState({
        votes: answerState.votes - 1,
        voteUser: 0
    }) 
     } else if ( currentVoteUser === -1 ) {
      this.setState({
        votes: answerState.votes + 1,
        voteUser: 0
      }) 
    } else if ( currentVoteUser === 0 ) {
      this.setState({
        votes: answerState.votes - 1,
        voteUser: -1
      }) 
    } 
  };

  onDelete = async () => {
    await this.props.deleteAnswer(this.props.answer, this.props.history)
};


  render() {
    const {answer, answerState, eventId, uid} = this.props
    const {votes, voteUser} = this.state

    const newAnswer = {
      ...answer, 
      votes, 
      voteUser
    }
    return (
    <Grid columns={2} divided>
      <Grid.Column width={2} >
          <EventAnswerCounter newVotes={answerState.votes} />
      </Grid.Column>
      <Grid.Column width={14}>
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={answer.photoURL} />
              <Item.Content>
                <Item.Header>Titel header!</Item.Header>
                <Item.Description>
                  Created by <Link to={`/profile/${answer.userUid}`}>{answer.displayName}</Link> {distanceInWords(answer.setDate, Date.now())} ago
                </Item.Description>
                {answer.cancelled &&
                <Label style={{top: '-40px'}} ribbon='right' color='red' content='This event has been cancelled'/>}
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment secondary>
          <span>{answer.description}</span>
        </Segment>
        <Segment clearing>
            <AnswerVoteButton
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
            />
             {uid === answerState.uid && 
          <Button
            as={Link}
            to={`/answer/${newAnswer.id}`}
            color="orange"
          >
            Edit
          </Button>}
        {uid === answerState.uid && 
           <Button 
           color="red"      
           onClick={this.onDelete}
         >
         
       Delete
         
         </Button>
        }
        </Segment>
      </Segment.Group>
      </Grid.Column>
    </Grid>

   
    );
  }
}

export default compose(
  withFirestore,
  connect(mapState, actions),
  firebaseConnect()
)(EventAnswerItem);