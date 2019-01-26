import React from 'react';
import { Card, Grid, Header, Image, Segment, Tab, Label, Item, Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import format from 'date-fns/format'
import DecrementButton from '../../counter/buttons/DecrementButton'
import IncrementButton from '../../counter/buttons/IncrementButton'
import EventListCounter from '../EventList/EventListCounter'

const panes = [
  {menuItem: 'Alle vragen', pane: {key: 'allQuestions'}},
  {menuItem: 'Junior', pane: {key: 'junior'}},
  {menuItem: 'Medior', pane: {key: 'medior'}},
  {menuItem: 'Senior', pane: {key: 'hosted'}},
]

const CategoryDetailedEvents = ({ events, eventsLoading, changeTab }) => {
  return (
    <Grid.Column width={10}>
        <Header icon="sitemap" content="What questions does a junior, medior of senior in ... has to be able  'to answer?" />
        <Tab onTabChange={(e, data) => changeTab(e, data)} panes={panes} menu={{secondary: true, pointing: true}}/>

        <Segment.Group>
        {events &&
            events.map(event => (
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={event.hostPhotoURL} />
              <Item.Content>
                <Item.Header as={Link} to={`/event/${event.id}`}>{event.title}</Item.Header>
                <Item.Description>
                  Hosted by <Link to={`/profile/${event.hostUid}`}>{event.hostedBy}</Link>
                </Item.Description>
                {event.cancelled &&
                <Label style={{top: '-40px'}} ribbon='right' color='red' content='This event has been cancelled'/>}
              </Item.Content>
            </Item>
          </Item.Group>
       
          <IncrementButton   />
          <DecrementButton />
          <Button as={Link} to={`/event/${event.id}`} color="teal" floated="right" content="View" />
        </Segment>
            ))}
      </Segment.Group>
       
    </Grid.Column>
  );
};

export default CategoryDetailedEvents;
