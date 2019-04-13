import React, { Component } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {updateAnswerVote, updateVoter} from '../../event/EventAnswer/answerActions';


const actions = {
  updateAnswerVote, 
  updateVoter
};

class AnswerVoteButton extends Component {
 
 
  componentDidUpdate(prevProps) {

    const {newAnswer, updateAnswerVote, updateVoter, eventId} = this.props
    if (prevProps.newAnswer.votes !== newAnswer.votes) { 
      updateAnswerVote(newAnswer, eventId )
      updateVoter(newAnswer)
    } 
  }

  handleChange = () => {
    const button =  this.props.voted;
    this.props.onClick(button);            
}

  
  render() {
    return (
        <Button 
          color='green'
          onClick={this.handleChange}
          >
        <Icon name='heart' />
        {this.props.content}
        </Button>
       
    )
  }
}

export default 
  connect(null, actions)(
    (
      AnswerVoteButton
    )
);