import React, { Component } from 'react';
import EventCommentItem from './EventCommentItem';
import InfiniteScroll from 'react-infinite-scroller';
import { Card, Grid, Header, Image, Segment, Tab, Label, Item, Icon, Button } from 'semantic-ui-react';



class EventList extends Component {
  render() {
    const { answers, getNextAnswers, loading, moreAnswers, match, auth } = this.props;
    return (
      <div>
        {answers &&
          answers.length !== 0 && (
            <InfiniteScroll
              pageStart={1}
              loadMore={getNextAnswers}
              hasMore={!loading && moreAnswers}
              initialLoad={false}
            >
              {answers && answers.map(answer => <EventCommentItem match={match} key={answer.id} answer={answer} auth={auth}/>)}
            </InfiniteScroll>
          )}
      </div>
    );
  }
}

export default EventList;
