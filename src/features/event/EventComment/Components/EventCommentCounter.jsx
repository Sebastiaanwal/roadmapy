import React, { Component } from 'react'
import { Segment, Item, Icon, List, Grid, Column, Button, Label } from 'semantic-ui-react';



class EventCommentCounter extends Component {

  render() {
    const { newVotes } = this.props;

    return (
      <div className="ui right pointing grey basic label">{newVotes}</div>
    )
  }
}

export default EventCommentCounter