import React, {Component} from 'react'
import debounce from 'debounce'
import { Button, Icon, Label, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {updateEvent} from '../../event/eventActions';
import {updatingCategoryLike} from '../../user/userActions'
import SubCategoryButtonJunior from './SubCategoryButtonJunior'
import SubCategoryButtonMedior from './SubCategoryButtonMedior'
import SubCategoryButtonSenior from './SubCategoryButtonSenior'

const actions = {
  updateEvent, 
  updatingCategoryLike
};

class SubCategoryButton extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        currentUpvoteJunior: this.props.event.juniorVote,
        currentUpvoteMedior: this.props.event.mediorVote,
        currentUpvoteSenior: this.props.event.seniorVote,

        initialUpvoteJunior: this.props.event.juniorVote,
        initialUpvoteMedior: this.props.event.mediorVote,
        initialUpvoteSenior: this.props.event.seniorVote,

        currentJuniorCount: this.props.event.juniorCount,
        currentMediorCount: this.props.event.mediorCount,
        currentSeniorCount: this.props.event.seniorCount,

        initialCountJunior: this.props.event.juniorCount,
        initialCountMedior: this.props.event.mediorCount,
        initialCountSenior: this.props.event.seniorCount,

        initialSubCategory: this.props.event.subCategory,
        currentSubCategory: this.props.event.subCategory
      };

      this.handleCategory = this.handleCategory.bind(this);
      this.handleUpVote = this.handleUpVote.bind(this);
      this.handleDownVote = this.handleDownVote.bind(this);
      this.handleBackVoteUp = this.handleBackVoteUp.bind(this);
      this.handleBackVoteDown = this.handleBackVoteDown.bind(this);
      this.updateCategoryUp = this.updateCategoryUp.bind(this);
      this.onClickEventsUp = this.onClickEventsUp.bind(this)
      this.updateCategoryDown = this.updateCategoryDown.bind(this)
      this.onClickEventsDown = this.onClickEventsDown.bind(this)
      this.updateCategoryBackVote = this.updateCategoryBackVote.bind(this)
      this.onClickEventsBackVoteUp = this.onClickEventsBackVoteUp.bind(this)
      this.handleBackVoteDown = this.handleBackVoteDown.bind(this)

    }
  

  handleCategory(name) {
      this.setState({
        currentSubCategory: name
      })
    }


    juniorClick() {
      const {currentUpvoteJunior, currentUpvoteMedior, currentUpvoteSenior, 
        initialUpvoteJunior, initialUpvoteMedior, initialUpvoteSenior
      } = this.state
      if (
        currentUpvoteJunior === false
        && currentUpvoteMedior === false
        && currentUpvoteSenior === false
        ) {
          return this.setState({
          currentJuniorCount: initialCountMedior + 1,
          currentMediorCount: initialCountMedior,
          currentSeniorCount: initialCountSenior,
          currentUpvoteJunior: true
          })
        } else if (
        currentUpvoteJunior === true
        && currentUpvoteMedior === false
        && currentUpvoteSenior === false
          ) {
          return this.setState({
            currentJuniorCount: currentJuniorCount - 1,
            currentMediorCount: initialCountMedior,
            currentSeniorCount: initialCountSenior,
            currentUpvoteJunior: false
            })
        } else if (
          currentUpvoteJunior === false
          && currentUpvoteMedior === true
          && currentUpvoteSenior === false
          ) {
          return this.setState({
            currentJuniorCount: currentJuniorCount + 1,
            currentMediorCount: initialCountMedior - 1,
            currentSeniorCount: initialCountSenior,
            currentUpvoteJunior: true,
            currentUpvoteMedior: false
            })
         } else if (
          currentUpvoteJunior === false
          && currentUpvoteMedior === false
          && currentUpvoteSenior === true
          ) {
          return this.setState({
            currentJuniorCount: currentJuniorCount + 1,
            currentMediorCount: initialCountMedior,
            currentSeniorCount: initialCountSenior - 1,
            currentUpvoteJunior: true,
            currentUpvoteSenior: false
            })
          } 
        }




updateCategoryUp = (event) => {
    return {
      ...event,
      subCategory: this.state.currentSubCategory,
      juniorCount: this.state.currentJuniorCount + 1, 
      upvoted: this.state.upvoted
    }
}

updateCategoryDown = () => {
  const {event} = this.props
    return {
      ...event,
      subCategory: this.state.currentSubCategory,
      juniorCount: this.state.currentJuniorCount - 1, 
      upvoted: this.state.upvoted
    }
  
}

updateCategoryBackVote = () => {
  const {event} = this.props

    return {
      ...event,
      subCategory: this.state.currentSubCategory,
      juniorCount: this.state.initialCountJunior, 
      upvoted: this.state.upvoted 
    }
  
}


onClickEventsUp = (event, handleUpvote, updateCategoryUp) => {
  const { updateEvent, updatingCategoryLike} = this.props;
    
      updateEvent(event)
      updatingCategoryLike(event)
  }

onClickEventsDown = (event) => {
    const { updateEvent, updatingCategoryLike} = this.props;
     
    updateEvent(event)
    updatingCategoryLike(event)
  }

onClickEventsBackVoteUp = (event) => {
    const { updateEvent, updatingCategoryLike} = this.props;
     
    updateEvent(event)
    updatingCategoryLike(event)
  }
//this van updatecategory ook via propssss in knop!!!
onClickEventsBackVoteDown = (event) => {
    const { updateEvent, updatingCategoryLike} = this.props;
  
    updateEvent(event)
    updatingCategoryLike(event)
  }
  

  render() {
    const {event} = this.props;
    return (
      <Segment clearing>
      <SubCategoryButtonJunior
        event={event}
        handleCategory={this.handleCategory}
        onClickEventsUp={this.onClickEventsUp}
        onClickEventsDown={this.onClickEventsDown}
        onClickEventsBackVoteUp={this.onClickEventsBackVoteUp}
        onClickEventsBackVoteDown={this.onClickEventsBackVoteDown}

        juniorClick={this.juniorClick}
       
        updateCategoryUp={this.updateCategoryUp}
        updateCategoryDown={this.updateCategoryDown}
        updateCategoryBackVote={this.updateCategoryBackVote}
        currentJuniorCount={this.state.currentJuniorCount}
      />
      
      <SubCategoryButtonMedior
        event={event}
        handleCategory={this.handleCategory}
        onClickEventsUp={this.onClickEventsUp}
        onClickEventsDown={this.onClickEventsDown}
        onClickEventsBackVoteUp={this.onClickEventsBackVoteUp}
        onClickEventsBackVoteDown={this.onClickEventsBackVoteDown}
        initialUpvote={this.state.initialUpvote}
        upvoted={this.state.upvoted}
        handleUpVote={this.handleUpVote}
        handleDownVote={this.handleDownVote}
        handleBackVoteUp={this.handleBackVoteUp}
        handleBackVoteDown={this.handleBackVoteDown}
        updateCategoryUp={this.updateCategoryUp}
        updateCategoryDown={this.updateCategoryDown}
        updateCategoryBackVote={this.updateCategoryBackVote}
        currentMediorCount={this.state.currentMediorCount}
      />

      <SubCategoryButtonSenior
        event={event}
        handleCategory={this.handleCategory}
        onClickEventsUp={this.onClickEventsUp}
        onClickEventsDown={this.onClickEventsDown}
        onClickEventsBackVoteUp={this.onClickEventsBackVoteUp}
        onClickEventsBackVoteDown={this.onClickEventsBackVoteDown}
        initialUpvote={this.state.initialUpvote}
        upvoted={this.state.upvoted}
        handleUpVote={this.handleUpVote}
        handleDownVote={this.handleDownVote}
        handleBackVoteUp={this.handleBackVoteUp}
        handleBackVoteDown={this.handleBackVoteDown}
        updateCategoryUp={this.updateCategoryUp}
        updateCategoryDown={this.updateCategoryDown}
        currentSeniorCount={this.state.currentSeniorCount}
        updateCategoryBackVote={this.updateCategoryBackVote}
      />
      </Segment>
    )
  }
}


export default 
  connect(null, actions)(
    (
      SubCategoryButton
    )
);