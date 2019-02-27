import React, { Component } from 'react'
import { Segment, Item, Icon, List, Grid, Column, Button, Label } from 'semantic-ui-react';



class EventCommentCounter extends Component {

  render() {
    const { answer } = this.props;

    return (
      <div className="ui right pointing grey basic label">{answer.votes}</div>
    )
  }
}

export default EventCommentCounter