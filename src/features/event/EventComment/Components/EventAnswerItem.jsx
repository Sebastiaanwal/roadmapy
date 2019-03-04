import React, { Component } from 'react';
import { Segment, Item, Icon, List, Grid, Column, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { firestoreConnect} from 'react-redux-firebase';
import { connect } from 'react-redux';
import EventAnswerCounter from './EventAnswerCounter'
import AnswerVoteButton from '../../../counter/buttons/AnswerVoteButton'
import { objectToArray } from '../../../../app/common/util/helpers';
import { debounce } from "debounce";


const mapState = (state, ownProps) => {
  let answerState = {};
  let currentVoteUser = {};
  let findVoteId = {};

  
  if (state.firestore.ordered.event_answer && state.firestore.ordered.event_answer[0]) {
    const answerInArray = state.firestore.ordered.event_answer.filter(e => e.id === ownProps.answer.id);
    answerState = answerInArray[0]
  }

  //zorg dat geneste user onder "voters" valt
  //zorg date id, de uid word
  //en zorg dat onder het veld vote de 0 of 1 komt. 
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
      currentVoteUser
  }
}
//knoppen ui
//currentvote functie
//parent-child relatie clickhandler + logica voting
//action functie, updaten event_answer en nested object registratie boolean + uid
//debounce knoppen



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


  render() {
    const {answer, answerState, eventId} = this.props
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
                  Hosted by <Link to={`/profile/${answer.userUid}`}>{answer.displayName}</Link>
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

          <Button as={Link} to={`/event/${answer.id}`} color="teal" floated="right" content="View" />
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
)(EventAnswerItem);