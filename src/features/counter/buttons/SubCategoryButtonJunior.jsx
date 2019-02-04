import React, { Component } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react';


class SubCategoryButtonJunior extends Component {
  
   handleAsyncUpvote = async () => {
    const name = 'junior'
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
    const name = 'junior'
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
    const name = 'junior'
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
    const name = 'junior'
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
          color='green'
          onClick={()  => {
          if (!initialUpvote && !upvoted) {
            this.handleAsyncUpvote()
          } else if (initialUpvote && upvoted) {
            this.handleAsyncDownvote()
          } else if (!initialUpvote && upvoted) {
            this.handleAsyncBackVoteUp()
          } else if (initialUpvote && !upvoted)  {
             this.handleAsyncBackVoteDown()
          }
          }}
          >
        <Icon name='heart' />
        Junior
        </Button>
        <Label as='a' basic color='green' pointing='left'>
        {event.juniorCount}  
        </Label>  
        </Button> 
    )
  }
}

export default SubCategoryButtonJunior