import React, { Component } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {updateEvent} from '../../event/eventActions';
import {updatingCategoryLike} from '../../user/userActions';
import { debounce } from "debounce";

const actions = {
  updateEvent, 
  updatingCategoryLike
};

class SubCategoryButtonSenior extends React.Component {
  componentDidUpdate(prevProps) {
    const {updateEvent, updatingCategoryLike, newEvent } = this.props
    if (prevProps.newEvent.seniorCount !== newEvent.seniorCount && prevProps.newEvent.seniorVote !== newEvent.seniorVote ) {
      updateEvent(newEvent)
      updatingCategoryLike(newEvent)
    }
  }

  handleChange = () => {
    const button = 'senior';
    this.props.onClick(button);            
}

  render() {
    const button = 'senior'
    return (
        <Button as='div' labelPosition='right' >
        <Button 
          color='red'
          onClick={this.handleChange}
          >
        <Icon name='heart' />
        Senior
        </Button>
        <Label as='a' basic color='red' pointing='left'>
        {this.props.event.seniorCount}  
        </Label>  
        </Button> 
    )
  }
}

export default 
  connect(null, actions)(
    (
      SubCategoryButtonSenior
    )
);