import React, { Component } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {updateEvent} from '../../event/eventActions';
import {updatingCategoryLike} from '../../user/userActions';


const actions = {
  updateEvent, 
  updatingCategoryLike
};

class SubCategoryButtonJunior extends React.Component {
 
 

  componentDidUpdate(prevProps) {
    
    const {updateEvent, updatingCategoryLike, newEvent, clickedCategory } = this.props
    if (clickedCategory === 'junior' && prevProps.newEvent.juniorCount !== newEvent.juniorCount && prevProps.newEvent.juniorVote !== newEvent.juniorVote) { 
      updateEvent(newEvent)
      updatingCategoryLike(newEvent)
    } 
  }

  handleChange = () => {
    const button = 'junior';
    this.props.onClick(button);            
}
  
  render() {
    return (
        <Button as='div' labelPosition='right' >
        <Button 
          color='green'
          onClick={this.handleChange}
          >
        <Icon name='heart' />
        Junior
        </Button>
        <Label as='a' basic color='green' pointing='left'>
        {this.props.event.juniorCount}  
        </Label>  
        </Button> 
    )
  }
}

export default 
  connect(null, actions)(
    (
      SubCategoryButtonJunior
    )
);