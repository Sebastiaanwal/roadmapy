/*global google*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { withFirestore } from 'react-redux-firebase';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import {cancelToggle, setAnswer } from '../commentActions';
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
  let answer = {}

  if (state.firestore.ordered.event_answer && state.firestore.ordered.event_answer[0] && ownProps.eventId != ownProps.match.params.id) {
    answer = state.firestore.ordered.event_answer[0];
  } else {
    answer = {}
  }

  return {
    initialValues: answer,
    loading: state.async.loading
    
  };
};

const actions = {
  setAnswer
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

   /*  if (this.props.initialValues.id) {
      this.props.updateAnswer(values, this.props.event);
    } else { */
      //hoe zorg ik ervoor dat gelijk het geneste like object erin komt? net zoals nu gebeurd bij event_attendees??
      await this.props.setAnswer(values, this.props.eventId);
    //}
  };

  render() {
    const { invalid, submitting, pristine, cancelToggle, loading } = this.props;
    return (
      <Grid>
        <Grid.Column width={16}>
          <Segment>
            <Header sub color="teal" content={"Answer and help find the best resource!"}  />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Field
                name="description"
                type="text"
                component={TextArea}
                rows={3}
                placeholder="Descripe your resource"
              />
              <Field
                name="title_link"
                type="text"
                component={TextInput}
                placeholder="What is title of the link you share?"
              />
              <Field
                name="url"
                type="text"
                component={TextInput}
                rows={1}
                placeholder="what is the url of link to the resource?"
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
