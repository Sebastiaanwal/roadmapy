import React, { Component } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react';


class SubCategoryButtonMedior extends React.Component {
  constructor(props) {
    super(props)

    this.handleAsyncUpvote = this.handleAsyncUpvote.bind(this)
    this.handleAsyncDownvote = this.handleAsyncDownvote.bind(this)
    this.handleAsyncBackVoteUp = this.handleAsyncBackVoteUp.bind(this)
    this.handleAsyncBackVoteDown = this.handleAsyncBackVoteDown.bind(this)
    this.handleVoteLogic = this.handleVoteLogic.bind(this)
  }

  handleAsyncUpvote = async () => {
    const name = 'medior'
    const { 
      event,
      onClickEventsUp,
      handleUpVote,
      updateCategoryUp, 
      handleCategory
    } = this.props
    
    await handleCategory(name)
    await handleUpVote()
    await updateCategoryUp(event)
    await onClickEventsUp(event)
  }


  handleAsyncDownvote = async () => {
    const name = 'medior'
    const { 
      event,
      handleCategory,
      onClickEventsDown, 
      handleDownVote, 
      updateCategoryDown,
    } = this.props
    await handleCategory(name)
    await handleDownVote()
    await updateCategoryDown(event)
    await onClickEventsDown(event)
  }

  handleAsyncBackVoteUp = async () => {
    const name = 'medior'
    const { 
      event, 
      handleCategory, 
      onClickEventsBackVoteUp, 
      handleBackVoteUp, 
      updateCategoryBackVote
    } = this.props
    await handleCategory(name)
    await handleBackVoteUp()
    await updateCategoryBackVote(event)
    await onClickEventsBackVoteUp(event)
  }

  handleAsyncBackVoteDown = async () => {
    const name = 'medior'
    const { 
      event, 
      handleCategory,
      onClickEventsBackVoteDown,
      handleBackVoteDown, 
      updateCategoryBackVote
    } = this.props
    await handleCategory(name)
    await handleBackVoteDown() 
    await updateCategoryBackVote(event)
    await onClickEventsBackVoteDown(event)
  }

  handleVoteLogic() {
    const { 
      upvoted, initialUpvote
    } = this.props
    if (!initialUpvote && !upvoted) {
      return this.handleAsyncUpvote()
    } else if (initialUpvote && upvoted) {
      return this.handleAsyncDownvote()
    } else if (!initialUpvote && upvoted) {
      return this.handleAsyncBackVoteDown()
    } else if (initialUpvote && !upvoted)  {
      return this.handleAsyncBackVoteUp()
    }
  }
  
 

  render() {

    return (
        <Button as='div' labelPosition='right' >
        <Button 
          color='orange'
          onClick={this.handleVoteLogic}
          >
        <Icon name='heart' />
        Medior
        </Button>
        <Label as='a' basic color='orange' pointing='left'>
        {this.props.currentMediorCount}  
        </Label>  
        </Button> 
    )
  }
}

export default SubCategoryButtonMedior