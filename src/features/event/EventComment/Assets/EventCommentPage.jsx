import React, { Component } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase';
import { getAnswers } from '../answerActions';
import EventCommentList from './EventCommentList';
import LoadingComponent from '../../../../app/layout/LoadingComponent';
import AnswerForm from './EventCommentPage';


const mapState = (state, ownProps) => {
  //hoe voeg komen de comments in storemanager net zoals bij event? 
  //Bij createevent, objectassign ook gebruiken voor de 'answers'?

  return {
    answers: state.answers,
    loading: state.async.loading,
    auth: state.firebase.auth,
  }
}

const actions = {
    getAnswers
};

class EventCommentPage extends Component {
  state = {
    moreAnswers: false,
    loadingInitial: true,
    loadedAnswers: [],
    contextRef: {}, 
    
  };

  async componentDidMount() {
    const { firestore, eventId } = this.props;
    await firestore.get(`event_answer/`);
  
    await firestore.setListener(`event_answer/`);
    console.log(eventId)
    let next = await this.props.getAnswers(eventId);
    if (next && next.docs) {
      this.setState({
        moreAnswers: true,
        loadingInitial: false
      });
    }
  }

  componentDidUpdate(prevProps) {
    console.log(this.props.answers)
    console.log(prevProps.answers)
    if (this.props.answers.id !== prevProps.answers.id) {
      this.setState({
        loadedAnswers: [...this.state.loadedAnswers, ...this.props.answers]
      });
    }
  }

  getNextAnswers = async () => {
    const { answers, eventId } = this.props;
    let lastEvent = answers && answers[answers.length - 1];
    let next = await this.props.getAnswers(eventId, lastEvent);
    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreAnswers: false
      });
    }
  };

  handleContextRef = contextRef => this.setState({contextRef})

  render() {
    const { loading, auth, eventId, event } = this.props;
    const { moreAnswers, loadedAnswers } = this.state;
    if (this.state.loadingInitial) return <LoadingComponent inverted={true} />;
    console.log(this.state.loadedAnswers)
    return (
      <Grid>
        <Grid.Column width={16}>
          {/* <CategoryMenu category={match.params.id} /> */}
          <div ref={this.handleContextRef}>
          <EventCommentList
            loading={loading}
            moreAnswers={moreAnswers}
            answers={loadedAnswers}
            getNextAnswers={this.getNextAnswers}
            changeTab={this.changeTab}
            auth={auth}
          />
          <AnswerForm 
          eventId={eventId}          
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

export default compose(connect(mapState, actions)(firestoreConnect()(EventCommentPage)));

