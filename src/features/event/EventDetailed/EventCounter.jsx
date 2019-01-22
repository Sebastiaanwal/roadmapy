import React, { Component } from 'react'

class EventCounter extends Component {

  render() {
    
    return (
        <div class="ui left labeled button" tabindex="0">
          <a class="ui basic right pointing label">
            {this.props.event.count}
          </a>
          <div class="ui button">
              <i class="heart icon"></i> score
          </div>
        </div>
    )
  }
}

export default EventCounter

