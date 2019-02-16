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

class SubCategoryButtonJunior extends React.Component {
 
  componentDidUpdate(prevProps) {
    const {updateEvent, updatingCategoryLike, newEvent } = this.props
    if (prevProps.newEvent.juniorCount !== newEvent.juniorCount && prevProps.newEvent.juniorVote !== newEvent.juniorVote ) {
      updateEvent(newEvent)
      updatingCategoryLike(newEvent)
    }
  }
  
  render() {
    return (
        <Button as='div' labelPosition='right' >
        <Button 
          color='green'
          onClick={this.props.juniorClick}
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