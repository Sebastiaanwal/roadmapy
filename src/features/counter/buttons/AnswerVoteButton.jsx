import React, { Component } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {updateAnserVote, updateVoter} from '../../event/EventAnswer/answerActions';


const actions = {
  updateAnserVote, 
  updateVoter
};

class AnswerVoteButton extends Component {
 
 
  componentDidUpdate(prevProps) {

    const {newAnswer, updateAnserVote, updateVoter, eventId} = this.props
    if (prevProps.newAnswer.votes !== newAnswer.votes) { 
      updateAnserVote(newAnswer, eventId )
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