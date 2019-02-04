import React, {Component} from 'react'
import debounce from 'debounce'
import { Button, Icon, Label, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {updateEvent} from '../../event/eventActions';
import {updatingCategoryLike} from '../../user/userActions'
import SubCategoryButtonJunior from './SubCategoryButtonJunior'
/* import SubCategoryButtonMedior from './SubCategoryButtonMedior'
import SubCategoryButtonSenior from './SubCategoryButtonSenior' */

const actions = {
  updateEvent, 
  updatingCategoryLike
};




class SubCategoryButton extends Component {
  
  state = {
    upvoted: this.props.upVoted,
    initialUpvote: this.props.upVoted,
    currentJuniorCount: this.props.event.juniorCount,
    currentMediorCount: this.props.event.mediorCount,
    currentSeniorCount: this.props.event.seniorCount,
    initialCountJunior: this.props.event.juniorCount,
    initialCountMedior: this.props.event.mediorCount,
    initialCountSenior: this.props.event.seniorCount,
    initialSubCategory: this.props.event.subCategory,
    currentSubCategory: this.props.event.subCategory
  };

  handleCategory = (name) => {
      this.setState({
        currentSubCategory: name
      })
    }

  handleUpVote = () => {

    if (this.state.currentSubCategory === 'junior') {
      this.setState({
      currentJuniorCount: this.state.initialCountJunior + 1,
      upvoted: true
      })
    } else if (this.state.currentSubCategory === 'medior') {
      this.setState({
        currentMediorCount: this.state.initialCountMedior + 1,
        upvoted: true
      })
    } else if (this.state.currentSubCategory === 'senior') {
      this.setState({
        currentSeniorCount: this.state.initialCountSenior + 1,
        upvoted: true
      })
  } else {
    console.log("error")
  }
}

  handleDownVote = (state) => {
    
  if (this.state.currentSubCategory === 'junior') {
    this.setState({
      currentJuniorCount: this.state.initialCountJunior - 1,
      upvoted: false
    })
  } else if (this.state.currentSubCategory === 'medior') {
    this.setState({
      currentMediorCount: this.state.initialCountMedior - 1,
      upvoted: false
    })
  } else if (this.state.currentSubCategory === 'senior') {
      this.setState({
        currentSeniorCount: this.state.initialCountSenior - 1,
        upvoted: false
      })
  } else {
    console.log("error")
  }
}

  handleBackVoteUp = () => {
    
      if (this.state.currentSubCategory === 'junior') {
      this.setState({
        currentJuniorCount: this.state.initialCountJunior,
        upvoted: true
      })
    } else if (this.state.currentSubCategory === 'medior') {
      this.setState({
        currentMediorCount: this.state.initialCountMedior,
        upvoted: true
      })
    } else if (this.state.currentSubCategory === 'senior') {
         this.setState({
          currentSeniorCount: this.state.initialCountSenior,
          upvoted: true
        })
    } else {
      console.log("error")
    }
  }

  handleBackVoteDown = () => {
    
    if (this.state.currentSubCategory === 'junior') {
      this.setState({
        currentJuniorCount: this.state.initialCountJunior,
        upvoted: false
      })
    } else if (this.state.currentSubCategory === 'medior') {
      this.setState({
        currentMediorCount: this.state.initialCountMedior,
        upvoted: false
      })
    } else if (this.state.currentSubCategory === 'senior') {
        this.setState({
          currentSeniorCount: this.state.initialCountSenior,
          upvoted: false
        })
    } else {
      console.log("error")
    }
  }

updateCategoryUp = () => {
  
  const {event} = this.props
  if (this.state.currentSubCategory === 'junior') {
    return {
      ...event,
      subCategory: this.state.currentSubCategory,
      juniorCount: this.state.currentJuniorCount + 1, 
      upvoted: this.state.upvoted
    }
  } else if (this.state.currentSubCategory === 'medior') {
    return {
      ...event,
      subCategory: this.state.currentSubCategory,
      mediorCount: this.state.currentMediorCount + 1, 
      upvoted: this.state.upvoted
    } 
  } else if (this.state.currentSubCategory === 'senior') {
      return {
      ...event,
      subCategory: this.state.currentSubCategory,
      seniorCount: this.state.currentSeniorCount + 1, 
      upvoted: this.state.upvoted
    }
  }
}

updateCategoryDown = () => {
  const {event} = this.props

  if (this.state.currentSubCategory === 'junior') {
    return {
      ...event,
      subCategory: this.state.currentSubCategory,
      juniorCount: this.state.currentJuniorCount - 1, 
      upvoted: this.state.upvoted
    }
  } else if (this.state.currentSubCategory === 'medior') {
    return {
      ...event,
      subCategory: this.state.currentSubCategory,
      mediorCount: this.state.currentMediorCount - 1, 
      upvoted: this.state.upvoted
    } 
  } else if (this.state.currentSubCategory === 'senior') {
      return {
      ...event,
      subCategory: this.state.currentSubCategory,
      seniorCount: this.state.currentSeniorCount - 1, 
      upvoted: this.state.upvoted
    }
  }
}

updateCategoryBackVote = () => {
  const {event} = this.props

  if (this.state.currentSubCategory === 'junior') {
    return {
      ...event,
      subCategory: this.state.currentSubCategory,
      juniorCount: this.state.initialCountJunior, 
      upvoted: this.state.upvoted 
    }
  } else if (this.state.currentSubCategory === 'medior') {
    return {
      ...event,
      subCategory: this.state.currentSubCategory,
      mediorCount: this.state.initialCountMedior, 
      upvoted: this.state.upvoted
    } 
  } else if (this.state.currentSubCategory === 'senior') {
      return {
      ...event,
      subCategory: this.state.currentSubCategory,
      seniorCount: this.state.initialCountSenior, 
      upvoted: this.state.upvoted
    }
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
        initialUpvote={this.state.initialUpvote}
        upvoted={this.state.upvoted}
        handleUpVote={this.handleUpVote}
        handleDownVote={this.handleDownVote}
        handleBackVoteUp={this.handleBackVoteUp}
        handleBackVoteDown={this.handleBackVoteDown}
        updateCategoryUp={this.updateCategoryUp}
        updateCategoryDown={this.updateCategoryDown}
        updateCategoryBackVote={this.updateCategoryBackVote}
      />
      
      {/* <SubCategoryButtonMedior
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
        updateCategoryBackVote={this.updateCategoryBackVote}
      /> */}
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