import React, { Component } from 'react'



class EventListCounter extends Component {

  render() {
    return (
        <div class="ui left labeled button" tabindex="0">
          <a class="ui basic right pointing label">
            {this.props.event.counter}
          </a>
          <div class="ui button">
              <i class="heart icon"></i> score
          </div>
        </div>
    )
  }
}

export default EventListCounter