import React, {Component} from 'react'
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {updateEvent} from '../../event/eventActions';

const actions = {
  updateEvent
};

class IncrementButton extends Component {

  render() {
    const { event } = this.props;
    return (
      <Button className="ui labeled icon button"  onClick={() => this.props.updateEvent({...event, counter: event.counter + 1})} >
        <i className="angle double down icon"></i>
          Increment
      </Button>  
    )
  }
}


export default 
  connect(null, actions)(
    (
      IncrementButton
    )
);