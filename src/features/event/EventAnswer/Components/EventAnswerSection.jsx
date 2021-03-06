import React, { Component } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFirestore, firebaseConnect } from 'react-redux-firebase';
import { getAnswers } from '../answerActions';
import { objectToArray } from '../../../../app/common/util/helpers';
import EventAnswerList from './EventAnswerList';
import LoadingComponent from '../../../../app/layout/LoadingComponent';


const mapState = (state, ownProps) => {
  
    return {
     
      answers: state.answers,
      loading: state.async.loading
    }
  }

const actions = {
  getAnswers
};

class EventAnswerSection extends Component {
  
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
    let next = await this.props.getAnswers(eventId);
    if (next && next.docs) {
      this.setState({
        moreAnswers: true,
        loadingInitial: false
      });
    }
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.answers !== nextProps.answers) {
      this.setState({
        loadedAnswers: [...this.state.loadedAnswers, ...nextProps.answers]
      });
    }
  }

  getNextAnswers = async () => {
    const { answers, eventId } = this.props;
    console.log(answers)
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
    const { loading, vote, history, eventId } = this.props;
    const { moreAnswers, loadedAnswers } = this.state;
    if (this.state.loadingInitial) return <LoadingComponent inverted={true} />;
    console.log(this.state.loadedAnswers)
    return (
      <Grid>
        <Grid.Column width={16}>
          <div ref={this.handleContextRef}>
          <EventAnswerList
            history={history}
            eventId={eventId}
            loading={loading}
            moreAnswers={moreAnswers}
            loadedAnswers={loadedAnswers}
            getNextAnswers={this.getNextAnswers}
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
  firebaseConnect())(EventAnswerSection);


