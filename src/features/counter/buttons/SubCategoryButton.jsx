import React, {Component} from 'react'
import { Button, Icon, Label, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
  static propTypes = {
    juniorVote: PropTypes.bool,
    mediorVote: PropTypes.bool,
    seniorVote: PropTypes.bool,

    juniorCount: PropTypes.number,
    mediorCount: PropTypes.number,
    seniorCount: PropTypes.number,

  }

    constructor(props) {
      super(props)

      this.state = {
        currentUpvoteJunior: {},
        currentUpvoteMedior: {},
        currentUpvoteSenior: {},

        currentJuniorCount: {},
        currentMediorCount: {},
        currentSeniorCount: {}
      };

      this.handleJuniorClick = this.handleJuniorClick.bind(this);
      this.handleMediorClick = this.handleMediorClick.bind(this);
      this.handleSeniorClick = this.handleSeniorClick.bind(this);
    }

    handleJuniorClick() {
      const {juniorCount, mediorCount, seniorCount} = this.props.event
      const {juniorVote, mediorVote, seniorVote } = this.props

      console.log(juniorCount)
      console.log(this.props.mediorVote)
      if (
        juniorVote === false
        && mediorVote === false
        && seniorVote === false
        ) {
          return this.setState({
          currentJuniorCount: juniorCount + 1,
          currentMediorCount: mediorCount,
          currentSeniorCount: seniorCount,
          currentUpvoteJunior: true,
          currentUpvoteMedior: mediorVote,
          currentUpvoteSenior: seniorVote
          })
        } else if (
          juniorVote === true
        && mediorVote === false
        && seniorVote === false
          ) {
          return this.setState({
            currentJuniorCount: juniorCount -1,
            currentMediorCount: mediorCount,
            currentSeniorCount: seniorCount,
            currentUpvoteJunior: false,
            currentUpvoteMedior: mediorVote,
            currentUpvoteSenior: seniorVote
            })
        } else if (
          juniorVote === false
          && mediorVote === true
          && seniorVote === false
          ) {
          return this.setState({
            currentJuniorCount: juniorCount + 1,
            currentMediorCount: mediorCount -1,
            currentSeniorCount: seniorCount,
            currentUpvoteJunior: true,
            currentUpvoteMedior: false,
            currentUpvoteSenior: seniorVote
            })
         } else if (
          juniorVote === false
          && mediorVote === false
          && seniorVote === true
          ) {
          return this.setState({
            currentJuniorCount: juniorCount + 1,
            currentMediorCount: mediorCount,
            currentSeniorCount: seniorCount -1,
            currentUpvoteJunior: true,
            currentUpvoteMedior: mediorVote,
            currentUpvoteSenior: false
            })
          } 
        }

    handleMediorClick() {
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
          currentUpvoteSenior: seniorVote
          });
        } else if (
          juniorVote === false
        && mediorVote === true
        && seniorVote === false
          ) {
          return this.setState({
            currentJuniorCount: juniorCount,
            currentMediorCount: mediorCount -1,
            currentSeniorCount: seniorCount,
            currentUpvoteJunior: juniorVote,
            currentUpvoteMedior: false,
            currentUpvoteSenior: seniorVote
            })
        } else if (
          juniorVote === true
          && mediorVote === false
          && seniorVote === false
          ) {
          return this.setState({
            currentJuniorCount: juniorCount -1,
            currentMediorCount: mediorCount + 1,
            currentSeniorCount: seniorCount,
            currentUpvoteJunior: false,
            currentUpvoteMedior: true,
            currentUpvoteSenior: seniorVote
            })
         } else if (
          juniorVote === false
          && mediorVote === false
          && seniorVote === true
          ) {
          return this.setState({
            currentJuniorCount: juniorCount,
            currentMediorCount: mediorCount + 1,
            currentSeniorCount: seniorCount -1,
            currentUpvoteJunior: juniorVote,
            currentUpvoteMedior: true,
            currentUpvoteSenior: false
            })
            }
        }

      handleSeniorClick() {

        const {juniorCount, mediorCount, seniorCount} = this.props.event
        const {juniorVote, mediorVote, seniorVote } = this.props

          if (
            juniorVote === false
            && mediorVote === false
            && seniorVote === false
            ) {
              return this.setState({
              currentJuniorCount: juniorCount,
              currentMediorCount: mediorCount,
              currentSeniorCount: seniorCount + 1,
              currentUpvoteJunior: juniorVote,
              currentUpvoteMedior: mediorVote,
              currentUpvoteSenior: true
              })
            } else if (
              juniorVote === false
            && mediorVote === false
            && seniorVote === true
              ) {
              return this.setState({
                currentJuniorCount: juniorCount,
                currentMediorCount: mediorCount,
                currentSeniorCount: seniorCount -1,
                currentUpvoteJunior: juniorVote,
                currentUpvoteMedior: mediorVote,
                currentUpvoteSenior: false
                })
            } else if (
              juniorVote === false
              && mediorVote === true
              && seniorVote === false
              ) {
              return this.setState({
                currentJuniorCount: juniorCount,
                currentMediorCount: mediorCount -1,
                currentSeniorCount: seniorCount + 1,
                currentUpvoteJunior: juniorVote,
                currentUpvoteSenior: true,
                currentUpvoteMedior: false
                })
             } else if (
              juniorVote === true
              && mediorVote === false
              && seniorVote === false
              ) {
              return this.setState({
                currentJuniorCount: juniorCount -1,
                currentMediorCount: mediorCount,
                currentSeniorCount: seniorCount + 1,
                currentUpvoteJunior: false,
                currentUpvoteMedior: mediorVote,
                currentUpvoteSenior: true
                })
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
    const newProps = {
      ...this.props.event, 
      juniorVote, 
      mediorVote,
      seniorVote,
      juniorCount,
      mediorCount,
      seniorCount
    }

    return (
      <Segment clearing>
      <SubCategoryButtonJunior
        event={this.props.event}
        newEvent={newProps}
        juniorClick={this.handleJuniorClick}
      />
      
      <SubCategoryButtonMedior
        event={this.props.event}
        newEvent={newProps}
        mediorClick={this.handleMediorClick}
      />

      <SubCategoryButtonSenior
        event={this.props.event}
        newEvent={newProps}
        seniorClick={this.handleSeniorClick}
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