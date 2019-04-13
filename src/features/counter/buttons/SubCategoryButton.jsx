import React, {Component} from 'react'
import { Button, Icon, Label, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import {updateEvent} from '../../event/eventActions';
import {updatingCategoryLike} from '../../user/userActions'
import SubCategoryButtonJunior from './SubCategoryButtonJunior'
import SubCategoryButtonMedior from './SubCategoryButtonMedior'
import SubCategoryButtonSenior from './SubCategoryButtonSenior'
import { debounce } from "debounce";


const actions = {
  updateEvent, 
  updatingCategoryLike
};

class SubCategoryButton extends React.Component {
  static propTypes = {
    juniorVote: PropTypes.bool,
    mediorVote: PropTypes.bool,
    seniorVote: PropTypes.bool,

    juniorCount: PropTypes.number,
    mediorCount: PropTypes.number,
    seniorCount: PropTypes.number,

  }
      state = {
        currentUpvoteJunior: {},
        currentUpvoteMedior: {},
        currentUpvoteSenior: {},

        currentJuniorCount: {},
        currentMediorCount: {},
        currentSeniorCount: {},

        clickedCategory: {}
      };

  handleClick = debounce((button) => {
    if (button === 'junior') {
      this.handleJuniorClick(button)
    } else if (button === 'medior') {
      this.handleMediorClick(button)
    } else if (button === 'senior'){
      this.handleSeniorClick(button)
    }
  }, 2000)

  handleJuniorClick(button) {
      const {juniorCount, mediorCount, seniorCount} = this.props.event
      const {juniorVote, mediorVote, seniorVote } = this.props

      console.log(juniorCount)
      console.log(this.props.mediorVote)
      if (
        juniorVote === false
        && mediorVote === false
        && seniorVote === false
        ) {
           this.setState({
          currentJuniorCount: juniorCount + 1,
          currentMediorCount: mediorCount,
          currentSeniorCount: seniorCount,
          currentUpvoteJunior: true,
          currentUpvoteMedior: mediorVote,
          currentUpvoteSenior: seniorVote,
          clickedCategory: button
          })
        } else if (
          juniorVote === true
        && mediorVote === false
        && seniorVote === false
          ) {
           this.setState({
            currentJuniorCount: juniorCount -1,
            currentMediorCount: mediorCount,
            currentSeniorCount: seniorCount,
            currentUpvoteJunior: false,
            currentUpvoteMedior: mediorVote,
            currentUpvoteSenior: seniorVote,
            clickedCategory: button
            })
        } else if (
          juniorVote === false
          && mediorVote === true
          && seniorVote === false
          ) {
           this.setState({
            currentJuniorCount: juniorCount + 1,
            currentMediorCount: mediorCount -1,
            currentSeniorCount: seniorCount,
            currentUpvoteJunior: true,
            currentUpvoteMedior: false,
            currentUpvoteSenior: seniorVote,
            clickedCategory: button
            })
         } else if (
          juniorVote === false
          && mediorVote === false
          && seniorVote === true
          ) {
           this.setState({
            currentJuniorCount: juniorCount + 1,
            currentMediorCount: mediorCount,
            currentSeniorCount: seniorCount -1,
            currentUpvoteJunior: true,
            currentUpvoteMedior: mediorVote,
            currentUpvoteSenior: false,
            clickedCategory: button
            })
          } 
        }

    handleMediorClick(button) {
      const {juniorCount, mediorCount, seniorCount} = this.props.event
      const {juniorVote, mediorVote, seniorVote } = this.props

      if (
        juniorVote === false
        && mediorVote === false
        && seniorVote === false
        ) {
          this.setState({
          currentJuniorCount: juniorCount,
          currentMediorCount: mediorCount + 1,
          currentSeniorCount: seniorCount,
          currentUpvoteJunior: juniorVote,
          currentUpvoteMedior: true,
          currentUpvoteSenior: seniorVote,
          clickedCategory: button
          });
        } else if (
          juniorVote === false
        && mediorVote === true
        && seniorVote === false
          ) {
           this.setState({
            currentJuniorCount: juniorCount,
            currentMediorCount: mediorCount -1,
            currentSeniorCount: seniorCount,
            currentUpvoteJunior: juniorVote,
            currentUpvoteMedior: false,
            currentUpvoteSenior: seniorVote,
            clickedCategory: button
            })
        } else if (
          juniorVote === true
          && mediorVote === false
          && seniorVote === false
          ) {
           this.setState({
            currentJuniorCount: juniorCount -1,
            currentMediorCount: mediorCount + 1,
            currentSeniorCount: seniorCount,
            currentUpvoteJunior: false,
            currentUpvoteMedior: true,
            currentUpvoteSenior: seniorVote,
            clickedCategory: button
            })
         } else if (
          juniorVote === false
          && mediorVote === false
          && seniorVote === true
          ) {
           this.setState({
            currentJuniorCount: juniorCount,
            currentMediorCount: mediorCount + 1,
            currentSeniorCount: seniorCount -1,
            currentUpvoteJunior: juniorVote,
            currentUpvoteMedior: true,
            currentUpvoteSenior: false,
            clickedCategory: button
            })
            }
        }

      handleSeniorClick(button) {

        const {juniorCount, mediorCount, seniorCount} = this.props.event
        const {juniorVote, mediorVote, seniorVote } = this.props

          if (
            juniorVote === false
            && mediorVote === false
            && seniorVote === false
            ) {
               this.setState({
              currentJuniorCount: juniorCount,
              currentMediorCount: mediorCount,
              currentSeniorCount: seniorCount + 1,
              currentUpvoteJunior: juniorVote,
              currentUpvoteMedior: mediorVote,
              currentUpvoteSenior: true,
              clickedCategory: button
              })
            } else if (
              juniorVote === false
            && mediorVote === false
            && seniorVote === true
              ) {
               this.setState({
                currentJuniorCount: juniorCount,
                currentMediorCount: mediorCount,
                currentSeniorCount: seniorCount -1,
                currentUpvoteJunior: juniorVote,
                currentUpvoteMedior: mediorVote,
                currentUpvoteSenior: false,
                clickedCategory: button
                })
            } else if (
              juniorVote === false
              && mediorVote === true
              && seniorVote === false
              ) {
               this.setState({
                currentJuniorCount: juniorCount,
                currentMediorCount: mediorCount -1,
                currentSeniorCount: seniorCount + 1,
                currentUpvoteJunior: juniorVote,
                currentUpvoteSenior: true,
                currentUpvoteMedior: false,
                clickedCategory: button
                })
             } else if (
              juniorVote === true
              && mediorVote === false
              && seniorVote === false
              ) {
               this.setState({
                currentJuniorCount: juniorCount -1,
                currentMediorCount: mediorCount,
                currentSeniorCount: seniorCount + 1,
                currentUpvoteJunior: false,
                currentUpvoteMedior: mediorVote,
                currentUpvoteSenior: true,
                clickedCategory: button
                })
              } 
            }

            chooseSubCategory(juniorCount, mediorCount, seniorCount) {
              if (juniorCount > mediorCount && juniorCount > seniorCount ) {
                return 'junior'
              } else if (mediorCount > juniorCount && mediorCount > seniorCount) {
                return 'medior'
              } else if (seniorCount > juniorCount && seniorCount > mediorCount ) {
                return 'senior'
              } else {
                return 'evencount'
              } 
            }


  render() {
    const { currentUpvoteJunior, currentUpvoteMedior, currentUpvoteSenior,
      currentJuniorCount, currentMediorCount, currentSeniorCount } = this.state
    const juniorVote = currentUpvoteJunior
    const mediorVote = currentUpvoteMedior
    const seniorVote = currentUpvoteSenior
    
    const juniorCount = currentJuniorCount
    const mediorCount = currentMediorCount
    const seniorCount = currentSeniorCount
    
    const subCategory = this.chooseSubCategory(currentJuniorCount, currentMediorCount, currentSeniorCount)

    const totalCount = juniorCount + mediorCount + seniorCount
    const newProps = {
      ...this.props.event, 
      juniorVote, 
      mediorVote,
      seniorVote,
      juniorCount,
      mediorCount,
      seniorCount, 
      totalCount,
      subCategory
      }

    return (
      <Segment clearing>
      <SubCategoryButtonJunior
        clickedCategory={this.state.clickedCategory}
        event={this.props.event}
        newEvent={newProps}
        onClick={this.handleClick}
      />
      
      <SubCategoryButtonMedior
        clickedCategory={this.state.clickedCategory}
        event={this.props.event}
        newEvent={newProps}
        onClick={this.handleClick}
      />

      <SubCategoryButtonSenior
        clickedCategory={this.state.clickedCategory}
        event={this.props.event}
        newEvent={newProps}
        onClick={this.handleClick}
      />
      <Button as={Link} to={`/event/${this.props.event.id}`} color="teal" floated="right" content="View" />

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