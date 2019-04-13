import React from 'react';
import { Segment, Image, Item, Header, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import distanceInWords from 'date-fns/distance_in_words';
import SubCategoryButton from '../../counter/buttons/SubCategoryButton';

const eventImageStyle = {
  filter: 'brightness(30%)'
};

const eventImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

const EventDetailedHeader = ({ openModal, cancelToggle, history,  authenticated, juniorVote, mediorVote, seniorVote, loading, event, isHost, isGoing, updatingCategoryLike, cancelupdatingCategoryLike }) => {
  
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: '0' }}>
        <Image
          src={`/assets/categoryImages/${event.category}.jpg`}
          fluid
          style={eventImageStyle}
        />

        <Segment basic style={eventImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={event.title}
                  style={{ color: 'white' }}
                />
                <p>
                  Hosted by <strong>{event.hostedBy}</strong>
                </p>
                <p>
                {distanceInWords(event.created, Date.now())} ago
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment attached="bottom">
        {isHost && (
          <Button
            as={Link}
            to={`/manage/${event.id}`}
            color="orange"
          >
            Edit
          </Button>
        )}
          {isHost && (
          <Button
            onClick={() => cancelToggle(!event.deleted, event.id, history)}
            type='button'
            color={event.deleted ? 'green' : 'red'  }
            floated='right'
            content={event.deleted ? 'Reactivate Event' : 'delete Event' }
            />
            )}
        <SubCategoryButton 
          event={event} 
          juniorVote={juniorVote} 
          mediorVote={mediorVote} 
          seniorVote={seniorVote} 
          authenticated={authenticated}
          />
        
      </Segment>

    </Segment.Group>
  );
};

export default EventDetailedHeader;
