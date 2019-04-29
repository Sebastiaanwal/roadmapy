import React from 'react'
import { Header, Segment, Image, Feed, Sticky, List } from 'semantic-ui-react'
import EventActivityItem from './EventActivityItem'


const EventActivity = ({activities, contextRef}) => {
  return (
    <Sticky context={contextRef} offset={100}>
      <Header attached='top' content='How tha fuck does this little app work?'/>
      <Segment attached>
          <List ordered>
            <List.Item as='a'>Help other people in SEO by completing, voting and answering the knowledge list!</List.Item>
            <List.Item as='a'>Create a question that you think people in SEO should be able to answer as a junior, medior or senior.</List.Item>
            <List.Item as='a'>Vote +1 by clicking on the junior, medior or senior button of the questions you think belongs to a certain category.</List.Item>
            <List.Item as='a'>Answer or comment on the question by clicking on the title or "view".</List.Item>
            <List.Item as='a'>It's maybe impossible to categorize all junior, medior or senior SEO knowledge, 
            but let's give it a shot! </List.Item>
            <List.Item as='a'>This web-app is a concept, please help me out in figuring out how I can improve the app! Go the "Give Feedback" menu-tem.</List.Item>
          </List>
      </Segment>


     
      <Header attached='top' content='Top contributers to the list'/>
      <Segment attached>
      <List relaxed>
    <List.Item>
      <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
      <List.Content>
        <List.Header as='a'>Daniel Louise</List.Header>
        <List.Description>
          323 votes
        </List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
      <Image avatar src='https://react.semantic-ui.com/images/avatar/small/stevie.jpg' />
      <List.Content>
        <List.Header as='a'>Stevie Feliciano</List.Header>
        <List.Description>
           323 votes
        </List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
      <Image avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
      <List.Content>
        <List.Header as='a'>Elliot Fu</List.Header>
        <List.Description>
          323 votes
        </List.Description>
      </List.Content>
    </List.Item>
  </List>
      </Segment>
    </Sticky>
  )
}

export default EventActivity
