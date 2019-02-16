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

class SubCategoryButtonMedior extends React.Component {
  componentDidUpdate(prevProps) {
    const {updateEvent, updatingCategoryLike, newEvent } = this.props
    if (prevProps.newEvent.mediorCount !== newEvent.mediorCount && prevProps.newEvent.mediorVote !== newEvent.mediorVote ) {
      updateEvent(newEvent)
      updatingCategoryLike(newEvent)
    }
  }

  render() {
    return (
        <Button as='div' labelPosition='right' >
        <Button 
          color='orange'
          onClick={this.props.mediorClick}
          >
        <Icon name='heart' />
        Medior
        </Button>
        <Label as='a' basic color='orange' pointing='left'>
        {this.props.event.mediorCount}  
        </Label>  
        </Button> 
    )
  }
}

export default 
  connect(null, actions)(
    (
      SubCategoryButtonMedior
    )
);