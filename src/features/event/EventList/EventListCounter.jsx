import React, { Component } from 'react'
import { Segment, Item, Icon, List, Grid, Column, Button, Label } from 'semantic-ui-react';



class EventListCounter extends Component {

  render() {
    const { event } = this.props;

    return (
      <div className="ui right pointing grey basic label">{event.count}</div>
    )
  }
}

export default EventListCounter