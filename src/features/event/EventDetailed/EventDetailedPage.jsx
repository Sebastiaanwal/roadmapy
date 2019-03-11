import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux';
import { withFirestore, firebaseConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { objectToArray, createDataTree } from '../../../app/common/util/helpers';
import {getAnswers} from '../EventComment/commentActions'
import { updatingCategoryLike, cancelGoingToEvent } from '../../user/userActions';
import { addEventComment } from '../eventActions';
import { openModal } from '../../modals/modalActions'
import EventAnswerSection from '../EventAnswer/Components/EventAnswerSection';
import AnswerForm from '../EventAnswer/Components/AnswerForm';
import EventCommentSection from '../EventComment/Components/EventCommentSection';
import CommentForm from '../EventComment/Components/CommentForm';


const mapState = (state, ownProps) => {

  let userDidAnswer = true
  let event = {};
  let juniorVote = {};
  let mediorVote = {};
  let seniorVote = {};
  let findLikeId = {};
  let findAnswerId = {};


  //waarschijnlijk bug/anti patern en daardoor traag bij laden page. 
  //evenCommentPage en eventCommentForm brengen ook firestoreconnet in
  //het effect was dat eventdetailpage state ook herlade en een hele nieuwe array kreeg met eventid's
  //hierdoor pakte de pagina de verkeerde id bij de filter. CHECK wat antipatern is!
  

  
  if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
    const eventInArray = state.firestore.ordered.events.filter(e => e.id === ownProps.match.params.id);
    event = eventInArray[0]
  }

  if (event.likes) {
    findLikeId = objectToArray(event.likes).filter(e => e.id === state.firebase.auth.uid)
    } else {
      juniorVote = false
      mediorVote = false
      seniorVote = false
    }
  
    findLikeId = findLikeId[0]
  
    if (findLikeId) {
      juniorVote = findLikeId.juniorVote
      mediorVote = findLikeId.mediorVote
      seniorVote = findLikeId.seniorVote
      } else {
        juniorVote = false
        mediorVote = false
        seniorVote = false
      }

      if (event.answers) {
        findAnswerId = objectToArray(event.answers).filter(e => e.id === state.firebase.auth.uid)
        } else {
          userDidAnswer = true
        }
      
        findAnswerId = findAnswerId[0]
      
        if (findAnswerId) {
          userDidAnswer = false
          } else {
            userDidAnswer = true
          }

  return {
    userDidAnswer,
    answers: state.answers,
    requesting: state.firestore.status.requesting,
    event,
    loading: state.async.loading,
    auth: state.firebase.auth,
    juniorVote, 
    mediorVote,
    seniorVote,
    findLikeId,
    eventChat:
      !isEmpty(state.firebase.data.event_chat) &&
      objectToArray(state.firebase.data.event_chat[ownProps.match.params.id])
  };
};

const actions = {
  updatingCategoryLike,
  cancelGoingToEvent,
  addEventComment,
  openModal 
};

class EventDetailedPage extends Component {
  state = {
    initialLoading: true
  }

  async componentDidMount() {
    const { firestore, match } = this.props;
    let event = await firestore.get(`events/${match.params.id}`);
    if (!event.exists) {
      toastr.error('Not found', 'This is not the event you are looking for')
      this.props.history.push('/error')
    }
    await firestore.setListener(`events/${match.params.id}`);


    this.setState({
      initialLoading: false
    })
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }



  render() {
    
    const { match, requesting, openModal, userDidAnswer, answers, getAnswers,  loading, event, auth, juniorVote, mediorVote, seniorVote,   cancelGoingToEvent, addEventComment, eventChat } = this.props;
    const attendees = event && event.attendees && objectToArray(event.attendees).sort(function(a,b) {
      return a.joinDate - b.joinDate
    })
    const isHost = event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some(a => a.id === auth.uid);
    const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);
    const authenticated = auth.isLoaded && !auth.isEmpty;
    const loadingEvent = requesting[`events/${match.params.id}`]

    if (loadingEvent || this.state.initialLoading) return <LoadingComponent inverted={true}/>

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailedHeader
            event={event}
            loading={loading}
            isHost={isHost}
            isGoing={isGoing}
            cancelGoingToEvent={cancelGoingToEvent}
            authenticated={authenticated}
            openModal={openModal}
            juniorVote={juniorVote} 
            mediorVote={mediorVote} 
            seniorVote={seniorVote} 
          />
           <EventCommentSection 
            eventId={match.params.id}
          />
          <CommentForm 
          match={match}
          eventId={match.params.id}          
          />
          
          <EventDetailedInfo event={event} />
          
         
          <EventAnswerSection 
            eventId={match.params.id}
          />
          {userDidAnswer &&
          <AnswerForm 
          match={match}
          eventId={match.params.id}          
          />
          }

          
        </Grid.Column>
        <Grid.Column width={6}>
          <EventDetailedSidebar attendees={attendees} />
        </Grid.Column>
      </Grid>
    );
  }
}

export default compose(
  withFirestore,
  connect(mapState, actions),
  firebaseConnect(props => props.auth.isLoaded && !props.auth.isEmpty && [`event_chat/${props.match.params.id}`])
)(EventDetailedPage);
