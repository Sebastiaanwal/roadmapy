import React, { Component } from 'react';
import EventListItem from './EventListItem';
import InfiniteScroll from 'react-infinite-scroller';

class EventList extends Component {
  render() {
    const { events, getNextEvents, loading, moreEvents, match, auth } = this.props;
    return (
      <div>
        {events &&
          events.length !== 0 && (
            <InfiniteScroll
              pageStart={1}
              loadMore={getNextEvents}
              hasMore={!loading && moreEvents}
              initialLoad={false}
            >
              {events && events.map(event => <EventListItem match={match} key={event.id} event={event} auth={auth}/>)}
            </InfiniteScroll>
          )}
      </div>
    );
  }
}

export default EventList;
