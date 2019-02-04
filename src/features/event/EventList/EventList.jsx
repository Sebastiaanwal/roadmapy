import React, { Component } from 'react';
import EventListItem from './EventListItem';
import InfiniteScroll from 'react-infinite-scroller';
import { Card, Grid, Header, Image, Segment, Tab, Label, Item, Icon, Button } from 'semantic-ui-react';




const panes = [
  {menuItem: 'Alle vragen', pane: {key: 'allQuestions'}},
  {menuItem: 'Junior', pane: {key: 'junior'}},
  {menuItem: 'Medior', pane: {key: 'medior'}},
  {menuItem: 'Senior', pane: {key: 'hosted'}},
]

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
