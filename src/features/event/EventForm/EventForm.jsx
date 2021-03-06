/*global google*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { withFirestore } from 'react-redux-firebase';
import Script from 'react-load-script';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from 'revalidate';
import { createEvent, updateEvent, cancelToggle } from '../eventActions';
import {updatingCategoryLike} from '../../user/userActions'
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';

const mapState = (state, ownProps) => {
  let event = {};

  if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
    event = state.firestore.ordered.events[0];
  }

  return {
    initialValues: event,
    event,
    loading: state.async.loading
  };
};

const actions = {
  createEvent,
  updateEvent,
  cancelToggle,
  updatingCategoryLike
};

const category = [
  { key: 'seo', text: 'SEO', value: 'seo' },
  { key: 'react', text: 'ReactJS', value: 'react' },
  { key: 'sea', text: 'SEA', value: 'sea' },
  { key: 'css3', text: 'CSS3', value: 'css3' },
  { key: 'html5', text: 'HTML5', value: 'html5' },
  { key: 'graphql', text: 'Graphql', value: 'graphql' }
];

const subCategory = [
  { key: 'junior', text: 'Junior', value: 'junior' },
  { key: 'medior', text: 'Medior', value: 'medior' },
  { key: 'senior', text: 'Senior', value: 'senior' }
];

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired({ message: 'Please provide a category' }),
  sub_category: isRequired({ message: 'Please provide a sub_category' }),
  description: composeValidators(
    isRequired({ message: 'Please enter a description' }),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least 5 characters'
    })
  )(),
  city: isRequired('city'),
});

class EventForm extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {},
    scriptLoaded: false
  };

  async componentDidMount() {
    const {firestore, match} = this.props;
    await firestore.setListener(`events/${match.params.id}`);
  }

  async componentWillUnmount() {
    const {firestore, match} = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

 

  initalCountSubCategory = values => {
    const deleted = false
    let newValues
    const totalCount = 1
    if (values.subCategory === 'junior') {
      const juniorCount = 1
      const mediorCount = 0
      const seniorCount = 0
      const juniorVote = true
      const mediorVote = false
      const seniorVote = false
      newValues = {...values, juniorCount, mediorCount, seniorCount, totalCount, juniorVote, mediorVote, seniorVote, deleted}
    } else if (values.subCategory === 'medior') {
      const juniorCount = 0
      const mediorCount = 1
      const seniorCount = 0
      const juniorVote = false
      const mediorVote = true
      const seniorVote = false
      newValues = {...values, juniorCount, mediorCount, seniorCount, totalCount, juniorVote, mediorVote, seniorVote, deleted}
    } else if (values.subCategory === 'senior') {
      const juniorCount = 0
      const mediorCount = 0
      const seniorCount = 1
      const juniorVote = false
      const mediorVote = false
      const seniorVote = true
      newValues = {...values, juniorCount, mediorCount, seniorCount, totalCount, juniorVote, mediorVote, seniorVote, deleted}
    } return {
      newValues
    }
  }

  onFormSubmit = async values => {
    console.log(values)
    const newCountValues = this.initalCountSubCategory(values)
    const newerCountValues = newCountValues.newValues

    if (this.props.initialValues.id) {
      this.props.updateEvent(values);
      this.props.history.goBack();
    } else {
      //hoe zorg ik ervoor dat gelijk het geneste like object erin komt? net zoals nu gebeurd bij event_attendees??
      await this.props.createEvent(newerCountValues);
      this.props.history.goBack();
    }
  };

  render() {
    const { invalid, submitting, pristine, event, cancelToggle, loading } = this.props;
    return (
      <Grid>
       
        <Grid.Column width={10}>
          <Segment>
            <Header sub color="teal" content="Event Details" />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Field
                name="title"
                type="text"
                component={TextInput}
                placeholder="Give your event a name"
              />
              <Field
                name="category"
                type="text"
                component={SelectInput}
                options={category}
                placeholder="Select your skill"
              />
               <Field
                name="subCategory"
                type="text"
                component={SelectInput}
                options={subCategory}
                placeholder="To which level does your question fit?"
              />
              <Field
                name="description"
                type="text"
                component={TextArea}
                rows={3}
                placeholder="Tell us about your event"
              />
              
              <Button
                loading={loading}
                disabled={invalid || submitting || pristine}
                positive
                type="submit"
              >
                Submit
              </Button>
              <Button disabled={loading} onClick={this.props.history.goBack} type="button">
                Cancel
              </Button>
              {event.id &&
              <Button

                onClick={() => cancelToggle(!event.deleted, event.id)}
                type='button'
                color={event.deleted ?  'red' : 'green' }
                floated='right'
                content={event.deleted ? 'delete Event' : 'Reactivate Event' }
              />}
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default withFirestore(
  connect(mapState, actions)(
    reduxForm({ form: 'eventForm', enableReinitialize: true, validate })(
      EventForm
    )
  )
);
