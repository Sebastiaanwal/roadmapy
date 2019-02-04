/* import React, { Component } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react';

class SubCategoryButtonMedior extends Component {
  async handleAsyncUpvote() {
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

  async handleAsyncDownvote() {
    const name = 'medior'
    const { 
      event,
      handleCategory,
      onClickEventsDown, 
      handleDownVote, 
      updateCategoryDown
    } = this.props
    await handleCategory(name)
    await handleDownVote()
    await updateCategoryDown(event)
    await onClickEventsDown(event)
  }

  async handleAsyncBackVoteUp() {
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

  async handleAsyncBackVoteDown() {
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

  render() {
    const { 
      event, initialUpvote, upvoted
    } = this.props

    return (
        <Button as='div' labelPosition='right' >
        <Button 
          color='orange'
          onClick={()  => {
          if (!initialUpvote && !upvoted) {
            return this.handleAsyncUpvote()
          } else if (initialUpvote && upvoted) {
            return this.handleAsyncDownvote()
          } else if (!initialUpvote && upvoted) {
            return this.handleAsyncBackVoteUp()
          } else if (initialUpvote && !upvoted)  {
            return this.handleAsyncBackVoteDown()
          }
          }}
          >
        <Icon name='heart' />
        Medior
        </Button>
        <Label as='a' basic color='orange' pointing='left'>
        {event.mediorCount}   
        </Label>  
        </Button> 
    )
  }
}

export default SubCategoryButtonMedior */