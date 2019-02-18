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
  venue: isRequired('venue'),
  date: isRequired('date')
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

  handleScriptLoaded = () => this.setState({ scriptLoaded: true });

  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        });
      })
      .then(() => {
        this.props.change('city', selectedCity);
      });
  };

  handleVenueSelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          venueLatLng: latlng
        });
      })
      .then(() => {
        this.props.change('venue', selectedVenue);
      });
  };

  initalCountSubCategory = values => {
    let newValues
    const totalCount = 1
    if (values.subCategory === 'junior') {
      const juniorCount = 1
      const mediorCount = 0
      const seniorCount = 0
      const juniorVote = true
      const mediorVote = false
      const seniorVote = false
      newValues = {...values, juniorCount, mediorCount, seniorCount, totalCount, juniorVote, mediorVote, seniorVote}
    } else if (values.subCategory === 'medior') {
      const juniorCount = 0
      const mediorCount = 1
      const seniorCount = 0
      const juniorVote = false
      const mediorVote = true
      const seniorVote = false
      newValues = {...values, juniorCount, mediorCount, seniorCount, totalCount, juniorVote, mediorVote, seniorVote }
    } else if (values.subCategory === 'senior') {
      const juniorCount = 0
      const mediorCount = 0
      const seniorCount = 1
      const juniorVote = false
      const mediorVote = false
      const seniorVote = true
      newValues = {...values, juniorCount, mediorCount, seniorCount, totalCount, juniorVote, mediorVote, seniorVote}
    } return {
      newValues
    }
  }

  onFormSubmit = async values => {
    console.log(values)
    const newCountValues = this.initalCountSubCategory(values)
    const newerCountValues = newCountValues.newValues

    values.venueLatLng = this.state.venueLatLng;
    if (this.props.initialValues.id) {
      if (Object.keys(values.venueLatLng).length === 0) {
        values.venueLatLng = this.props.event.venueLatLng
      }
      this.props.updateEvent(values);
      this.props.history.goBack();
    } else {
      //hoe zorg ik ervoor dat gelijk het geneste like object erin komt? net zoals nu gebeurd bij event_attendees??
      await this.props.createEvent(newerCountValues);
      this.props.history.push('/events');
    }
  };

  render() {
    const { invalid, submitting, pristine, event, cancelToggle, loading } = this.props;
    return (
      <Grid>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyC1Oy3Ic6JyE6RR4eEbEFw2T-ynXjjWzTc&libraries=places"
          onLoad={this.handleScriptLoaded}
        />
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
              <Header sub color="teal" content="Event Location details" />
              <Field
                name="city"
                type="text"
                component={PlaceInput}
                options={{ types: ['(cities)'] }}
                placeholder="Event city"
                onSelect={this.handleCitySelect}
              />
              {this.state.scriptLoaded && (
                <Field
                  name="venue"
                  type="text"
                  component={PlaceInput}
                  options={{
                    location: new google.maps.LatLng(this.state.cityLatLng),
                    radius: 1000,
                    types: ['establishment']
                  }}
                  placeholder="Event venue"
                  onSelect={this.handleVenueSelect}
                />
              )}
              <Field
                name="date"
                type="text"
                component={DateInput}
                dateFormat="YYYY-MM-DD HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
                placeholder="Date and time of event"
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

                onClick={() => cancelToggle(!event.cancelled, event.id)}
                type='button'
                color={event.cancelled ? 'green' : 'red'}
                floated='right'
                content={event.cancelled ? 'Reactivate Event' : 'Cancel Event'}
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
