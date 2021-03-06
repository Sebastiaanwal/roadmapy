import React, { Component } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {updateEvent, juniorButton} from '../../event/eventActions';
import {updatingCategoryLike} from '../../user/userActions';


const actions = {
  updateEvent, 
  updatingCategoryLike,
  juniorButton
};

class SubCategoryButtonJunior extends Component {

  componentDidUpdate(prevProps) {
    console.log(this.props.clickedCategory)
    const {updateEvent, juniorButton, updatingCategoryLike, newEvent, clickedCategory } = this.props
    if (clickedCategory === 'junior' && prevProps.newEvent.juniorCount !== newEvent.juniorCount && prevProps.newEvent.juniorVote !== newEvent.juniorVote) { 
      juniorButton(newEvent)
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
          size='mini'
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