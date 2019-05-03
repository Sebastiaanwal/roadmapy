import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import InfiniteScroll from 'react-infinite-scroller';
import { Card, Grid, Header, Image, Segment, List, Label, Item, Icon, Button } from 'semantic-ui-react';
import UserListItem from './UserListItem'


const query = [
  {
    collection: 'users',
    orderBy: ['totalCount', 'desc'],
    limit: 3
  }
]

const mapState = (state, ownProps) => ({
  users: state.firestore.ordered.users
})


class UserList extends Component {

  render() {
    const { users } = this.props;
    return (
      <div>
        <Segment attached>
          <List relaxed>
            {users && users.map(user => <UserListItem key={user.id} user={user} />)}
          </List>
        </Segment>  
      </div>
    );
  }
}

  export default connect(mapState, null)(firestoreConnect(query)(UserList));
