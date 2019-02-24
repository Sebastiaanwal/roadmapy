import React, { Component } from 'react'
import { Button, Icon, Label, Comment} from 'semantic-ui-react';
import { connect } from 'react-redux';
import {updateEventComment} from '../../event/eventActions';


const actions = {
  updateEventComment
};

class CommentVote extends React.Component {
 
  componentDidUpdate(prevProps, prevState) {
    const {updateEventComment, newVote,  selecteVotedId, eventId } = this.props

    if (prevProps.newVote !== newVote) { 
      updateEventComment(eventId, selecteVotedId, this.props.newVote)
    } else {
      console.log('mislukt')
    }
  }


  render() {
    return (
        <Comment.Action onClick={this.props.onClick} >
          {this.props.text}
          {this.props.icon}
        </Comment.Action>
    )
  }
}

export default 
  connect(null, actions)(
    (
        CommentVote
    )
);