import React, { Component } from 'react';
import EventAnswerItem from './EventAnswerItem';
import InfiniteScroll from 'react-infinite-scroller';
import { Card, Grid, Header, Image, Segment, Tab, Label, Item, Icon, Button } from 'semantic-ui-react';



class EventAnswerList extends Component {
  render() {
    const { loadedAnswers, getNextAnswers, history, loading, moreAnswers, match, } = this.props;
    return (
      <div>
        {loadedAnswers &&
          loadedAnswers.length !== 0 && (
            <InfiniteScroll
              pageStart={1}
              loadMore={getNextAnswers}
              hasMore={!loading && moreAnswers}
              initialLoad={false}
            >
              {loadedAnswers && loadedAnswers.map(answer => <EventAnswerItem match={match} history={history} key={answer.id} answer={answer} />)}
            </InfiniteScroll>
          )}
      </div>
    );
  }
}

export default EventAnswerList;
