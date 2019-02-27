import React, { Component } from 'react';
import { Segment, Item, Icon, List, Grid, Column, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { firestoreConnect} from 'react-redux-firebase';
import { connect } from 'react-redux';
import EventCommentCounter from './EventCommentCounter'


/* const mapState = (state, ownProps) => {
    //voor de counter misschien belangrijk.
   let answerState = {};

  const answerStateProp = state.firestore.ordered.answers.filter(e => e.id === ownProps.answer.id)
  answerState = answerStateProp[0];
 
  return {
    answerState
  }
}; */


class EventCommentItem extends Component {
  render() {
    const {answer, answerState, authenticated, juniorVote, mediorVote, seniorVote } = this.props

    return (
    <Grid columns={2} divided>
      <Grid.Column width={2} >
          <EventCommentCounter answer={answer} />
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

          <Button as={Link} to={`/event/${answer.id}`} color="teal" floated="right" content="View" />
        </Segment>
      </Segment.Group>
      </Grid.Column>
    </Grid>

   
    );
  }
}

export default compose(
  connect(null, null),
  firestoreConnect()
)(EventCommentItem);