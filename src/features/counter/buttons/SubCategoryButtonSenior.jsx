/* import React, { Component } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react';


class SubCategoryButtonSenior extends Component {
  async handleAsyncUpvote() {
    const name = 'senior'
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
    const name = 'senior'
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
    const name = 'senior'
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
    const name = 'senior'
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
          color='red'
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
        senior
        </Button>
        <Label as='a' basic color='red' pointing='left'>
        {event.seniorCount}   
        </Label>  
        </Button> 
    )
  }
}

export default SubCategoryButtonSenior */