import React, { Component } from 'react';
import EventCommentItem from './EventCommentItem';
import InfiniteScroll from 'react-infinite-scroller';
import { Card, Grid, Header, Image, Segment, Tab, Label, Item, Icon, Button } from 'semantic-ui-react';



class EventCommentList extends Component {
  render() {
    const { loadedAnswers, getNextAnswers, loading, moreAnswers, match, } = this.props;
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
              {loadedAnswers && loadedAnswers.map(answer => <EventCommentItem match={match} key={answer.id} answer={answer} />)}
            </InfiniteScroll>
          )}
      </div>
    );
  }
}

export default EventCommentList;
