import React, { Component } from 'react';
import { Header, Segment, Image, Feed, Sticky, List } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

class UserListItem extends Component {
 
  render() {
    const { user } = this.props;

    return (
      <List.Item>
      <Image avatar src={user.photoURL} />
      <List.Content>
        <List.Header as='a'>{user.displayName}</List.Header>
        <List.Description>
          {user.totalCount} votes
        </List.Description>
      </List.Content>
    </List.Item>
    );
  }
}

export default UserListItem;
