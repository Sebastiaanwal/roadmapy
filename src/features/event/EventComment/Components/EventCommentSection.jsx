import React, { Component } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFirestore, firebaseConnect } from 'react-redux-firebase';
import { getComments } from '../commentActions';
import { objectToArray } from '../../../../app/common/util/helpers';
import EventCommentList from './EventCommentList';
import LoadingComponent from '../../../../app/layout/LoadingComponent';


const mapState = (state, ownProps) => {
  
    return {
     
      comments: state.comments,
      loading: state.async.loading
    }
  }

const actions = {
  getComments
};

class EventCommentSection extends Component {
  
  state = {
    moreComments: false,
    loadingInitial: true,
    loadedComments: [],
    contextRef: {}, 
    
  };


  async componentDidMount() {
    const { firestore, eventId } = this.props;
    await firestore.get(`event_comment/`);
  
    await firestore.setListener(`event_comment/`);
    let next = await this.props.getComments(eventId);
    if (next && next.docs) {
      this.setState({
        moreComments: true,
        loadingInitial: false
      });
    }
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.comments !== nextProps.comments) {
      this.setState({
        loadedComments: [...this.state.loadedComments, ...nextProps.comments]
      });
    }
  }

  getNextComments = async () => {
    const { comments, eventId } = this.props;
    console.log(comments)
    let lastEvent = comments && comments[comments.length - 1];
    let next = await this.props.getComments(eventId, lastEvent);
    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreComments: false
      });
    }
  };

  handleContextRef = contextRef => this.setState({contextRef})

  render() {
    const { loading, vote, history,  eventId } = this.props;
    const { moreComments, loadedComments } = this.state;
    if (this.state.loadingInitial) return <LoadingComponent inverted={true} />;
    console.log(this.state.loadedComments)
    return (
      <Grid>
        <Grid.Column width={16}>
          <div ref={this.handleContextRef}>
          <EventCommentList
            history={history}
            eventId={eventId}
            loading={loading}
            moreComments={moreComments}
            loadedComments={loadedComments}
            getNextComments={this.getNextComments}
            changeTab={this.changeTab}
          />
          </div>

        </Grid.Column>
    
        <Grid.Column width={16}>
          <Loader active={loading}/>
        </Grid.Column>
      </Grid>
    );
  }
}

export default compose(
  withFirestore,
  connect(mapState, actions),
  firebaseConnect())(EventCommentSection);


