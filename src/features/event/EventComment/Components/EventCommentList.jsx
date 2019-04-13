import React, { Component } from 'react';
import EventCommentItem from './EventCommentItem';
import InfiniteScroll from 'react-infinite-scroller';
import { Card, Grid, Header, Image, Segment, Tab, Label, Item, Icon, Button } from 'semantic-ui-react';



class EventCommentList extends Component {
  render() {
    const { loadedComments, getNextComments,  history, loading, moreComments, match, } = this.props;
    return (
      <div>
        {loadedComments &&
          loadedComments.length !== 0 && (
            <InfiniteScroll
              pageStart={1}
              loadMore={getNextComments}
              hasMore={!loading && moreComments}
              initialLoad={false}
            >
              {loadedComments && loadedComments.map(comment => <EventCommentItem match={match} key={comment.id} history={history} comment={comment} />)}
            </InfiniteScroll>
          )}
      </div>
    );
  }
}

export default EventCommentList;
