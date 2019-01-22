import React, { Component } from 'react'



class EventListCounter extends Component {

  render() {
    const { event } = this.props;

    return (
        <div class="ui left labeled button" tabindex="0">
          <a class="ui basic right pointing label">
            {event.count}
          </a>
          <div class="ui button">
              <i class="heart icon"></i> score
          </div>
        </div>
    )
  }
}

export default EventListCounter