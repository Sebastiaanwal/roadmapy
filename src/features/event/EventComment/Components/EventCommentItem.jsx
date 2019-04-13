import React, { Component } from 'react';
import { Segment, Item, Icon, List, Grid, Column, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { firebaseConnect, withFirestore} from 'react-redux-firebase';
import { connect } from 'react-redux';
import { deleteComment } from '../commentActions'
/* import EventAnswerCounter from './EventAnswerCounter'
import AnswerVoteButton from '../../../counter/buttons/AnswerVoteButton' */
import { objectToArray } from '../../../../app/common/util/helpers';
import { debounce } from "debounce";
import distanceInWords from 'date-fns/distance_in_words';



const mapState = (state, ownProps) => {
  let answerState = {};
  
  if (state.firestore.ordered.event_comment && state.firestore.ordered.event_comment[0]) {
    const answerInArray = state.firestore.ordered.event_comment.filter(e => e.id === ownProps.comment.id);
    console.log(ownProps.comment)
    answerState = answerInArray[0]
  }

    return {
      answerState, 
      uid: state.firebase.auth.uid
  }
}

const actions = {
  deleteComment
};

class EventCommentItem extends Component {

  onDelete = async () => {
     await this.props.deleteComment(this.props.comment, this.props.history)
};

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
              <Item.Content>
                
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

             {uid === answerState.uid && 
             
          <Button
            as={Link}
            to={`/comment/${answerState.id}`}
            color="orange"
            size="mini"
            floated="left" 
          >
            Edit
          </Button>
        }
          {uid === answerState.uid && 
             <Button 
            color="red" 
            content="Delete"   
            size="mini"          
            floated="left" 
            onClick={this.onDelete}
          >
          
        Delete
          
          </Button>}
           <Label attached="top right">            
           {distanceInWords(comment.setDate, Date.now())} ago
           commented by <Link to={`/profile/${comment.userUid}`}>{comment.displayName}</Link></Label>


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
)(EventCommentItem);