/*global google*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { withFirestore } from 'react-redux-firebase';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import {updateComment, setComment } from '../commentActions';
import TextInput from '../../../../app/common/form/TextInput';
import TextArea from '../../../../app/common/form/TextArea';
import SelectInput from '../../../../app/common/form/SelectInput';
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from 'revalidate';

//logica (validate, knoppen, updates moeten in formulier nog worden toegevoegd 
//updateanswer action maken etc. 

const mapState = (state, ownProps) => {
  let comment = {}

//na aanpassing werkt het niet meer
  if (state.firestore.ordered.event_comment && state.firestore.ordered.event_comment[0] && ownProps.eventId != ownProps.match.params.id) {
    const commentInArray = state.firestore.ordered.event_comment.filter(e => e.id === ownProps.match.params.id);
    comment = commentInArray[0]
  } else {
    comment = {}
  }

  return {
    initialValues: comment,
    loading: state.async.loading
    
  };
};

const actions = {
  setComment,
  updateComment
};

const validate = combineValidators({
  title_link: isRequired({ message: 'Add a title for the url you are sharing' }),
  url: isRequired({ message: 'Please add a url to the resource you are sharing' }),
  description: composeValidators(
    isRequired({ message: 'Please enter a description' }),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least 5 characters'
    })
  )()
});


class CommentForm extends Component {

  onFormSubmit = async values => {

    if (this.props.initialValues.id) {
      this.props.updateComment(values);
      this.props.history.goBack();

    } else {
      //hoe zorg ik ervoor dat gelijk het geneste like object erin komt? net zoals nu gebeurd bij event_attendees??
      await this.props.setComment(values, this.props.eventId);
      return this.props.history.go();

    }
  };


  render() {
    const { invalid, submitting, match, history, eventId , pristine, cancelToggle, loading } = this.props;
   
    return (
      <Grid>
        <Grid.Column width={16}>
          <Segment>
            <Header sub color="teal" content={"Comment and help find the best resource!"}  />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Field
                name="description"
                type="text"
                component={TextArea}
                rows={3}
                placeholder="Descripe your comment"
              />
              <Button
                loading={loading}
                disabled={invalid || submitting || pristine}
                positive
                type="submit"
              >
                Submit
              </Button>

            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default withFirestore(
  connect(mapState, actions)(
    reduxForm({ form: 'commentForm', enableReinitialize: true, validate })(
      CommentForm
    )
  )
);
