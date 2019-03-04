import React, { Component } from 'react';
import { Segment, Header, Button, Comment } from 'semantic-ui-react';
import EventDetailedChatForm from './EventDetailedChatForm';
import { Link } from 'react-router-dom';
import { debounce } from "debounce";
import { objectToArray } from '../../../app/common/util/helpers';
import distanceInWords from 'date-fns/distance_in_words';
import CommentVoteButton from '../../counter/buttons/AnswerVoteButton';
     //onclickhandlet update localstate
                    //localstate doorgegeven aan childvotecomponent. 
                    //zodra childvotecomponent is geupdate dan automatisch action: update ID in firebase
                    //action voor update moet nog gemaakt worden. (let op negatieve waarde belangrijk voor queries)
                    // zorgen dat comments na een render descending (aflopend) worden gequeried. 

class EventDetailedChat extends Component {
  state = {
    showReplyForm: false,
    selectedCommentId: null,
    newVote: {}, 
    selecteVotedId: null
  };

  handleOpenReplyForm = id => () => {
    this.setState({
      showReplyForm: true,
      selectedCommentId: id
    });
  };

  handleCloseReplyForm = () => {
    this.setState({
      selectedCommentId: null,
      showReplyForm: false
    });
  };


  handleUpVote = (id, vote) => () => {
    const currentVote = vote.voteCount
    console.log(currentVote)

    if (currentVote == 1 ) {
      this.setState({
        newVote: currentVote + 1, 
        selecteVotedId: id
    }) 
    } else if ( currentVote == -1 ) {
      this.setState({
        newVote: currentVote + 1, 
        selecteVotedId: id
      }) 
    } else if ( currentVote == 0 ) {
      this.setState({
        newVote: currentVote + 1, 
        selecteVotedId: id
      }) 
    }
  };

  handleDownVote = (id, vote) => () =>  {
    const currentVote = vote.voteCount
    console.log(currentVote)
    if ( currentVote == 1 ) { 
      this.setState({
        newVote: currentVote - 1, 
        selecteVotedId: id
    }) 
     } else if ( currentVote == -1 ) {
      this.setState({
        newVote: currentVote + 1, 
        selecteVotedId: id
      }) 
    } else if ( currentVote == 0 ) {
      this.setState({
        newVote: currentVote - 1, 
        selecteVotedId: id
      }) 
    } 
  };

  getUserVote = (commentId) => {
    const { eventChat, uid } = this.props;
    let voteCount = {};
    const findComment = eventChat.filter(e => e.id === commentId)
    const currentComment = objectToArray(findComment[0].voteId)
    if (currentComment) {
      const findVote = currentComment.filter(e => e.id === uid)
      voteCount = findVote[0].vote
      
    } else {
      voteCount = 0
    }
    return {
      voteCount
    }
  }

  render() {
    const { addEventComment, eventId, eventChat } = this.props;
    const { showReplyForm, selectedCommentId, newVote, selecteVotedId } = this.state;
    return (
      <div>
        <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: 'none' }}>
          <Header>Chat about this event</Header>
        </Segment>

        <Segment attached >
          <Comment.Group threaded>
            {eventChat &&
              eventChat.map(comment => ( 
                <Comment  key={comment.id}>
                  <Comment.Avatar src={comment.photoURL || '/assets/user.png'} />
                  <Comment.Content>
                    <Comment.Author as={Link} to={`/profile/${comment.uid}`}>
                      {comment.displayName}
                    </Comment.Author>
                    <Comment.Metadata>
                      {comment.votes}
                      <div> · </div>
                      <div>{distanceInWords(comment.date, Date.now())} ago</div>
                    </Comment.Metadata>
                    <Comment.Text>{comment.text}</Comment.Text>
                    <Comment.Actions>
                      <Comment.Action onClick={this.handleOpenReplyForm(comment.id)}>Reply</Comment.Action>


                        {/*   <CommentVoteButton 
                            key={1 + selecteVotedId}
                            text={"Vote up"}
                            icon={<i className="caret up icon"></i>}
                            onClick={this.handleUpVote(comment.id, this.getUserVote(comment.id))}
                            newVote={newVote}
                            commentId={selecteVotedId}
                            eventId={eventId}
                          />
                          <CommentVoteButton
                          key={2 + selecteVotedId}
                            text={"Vote down"}
                            icon={<i className="caret down icon"></i>}
                            onClick={this.handleDownVote(comment.id, this.getUserVote(comment.id))} 
                            newVote={newVote}
                            eventId={eventId}
                            commentId={selecteVotedId}
                          />
                       */}

                      {showReplyForm &&
                        selectedCommentId === comment.id && (
                          <EventDetailedChatForm
                            form={`reply_${comment.id}`}
                            addEventComment={addEventComment}
                            eventId={eventId}
                            closeForm={this.handleCloseReplyForm}
                            parentId={comment.id}
                          />
                        )}
                          
                    </Comment.Actions>
                  </Comment.Content>
          
                  

                  {comment.childNodes &&
                    comment.childNodes.map(child => (
                      <Comment.Group>
                        <Comment key={child.id}>
                          
                          <Comment.Avatar src={child.photoURL || '/assets/user.png'} />
                          <Comment.Content>
                            <Comment.Author as={Link} to={`/profile/${child.uid}`}>
                              {child.displayName}
                            </Comment.Author>
                            <Comment.Metadata>
                              <div>5 likes</div>
                              <div> · </div>
                              <div>{distanceInWords(child.date, Date.now())} ago</div>
                            </Comment.Metadata>
                            <Comment.Text>{child.text}</Comment.Text>
                            <Comment.Actions>
                              <Comment.Action onClick={this.handleOpenReplyForm(child.id)}>Reply</Comment.Action>
                              {showReplyForm &&
                                selectedCommentId === child.id && (
                                  <EventDetailedChatForm
                                    form={`reply_${child.id}`}
                                    addEventComment={addEventComment}
                                    eventId={eventId}
                                    closeForm={this.handleCloseReplyForm}
                                    parentId={child.parentId}
                                  />
                                )}
                                 {/*  <Comment.Action onClick={this.handleUpVote(child.votes)} >Vote up<i class="caret up icon"></i></Comment.Action>
                                  <Comment.Action onClick={this.handleDownVote(child.votes)}>Vote down<i class="caret down icon"></i></Comment.Action> */}
                            </Comment.Actions>
                          </Comment.Content>
                        </Comment>
                      </Comment.Group>
                    ))}
                </Comment>
              ))}
          </Comment.Group>
          <EventDetailedChatForm parentId={0} form={'newComment'} addEventComment={addEventComment} eventId={eventId} />
        </Segment>
      </div>
    );
  }
}

export default EventDetailedChat;
