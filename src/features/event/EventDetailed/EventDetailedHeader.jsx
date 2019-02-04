import React from 'react';
import { Segment, Image, Item, Header, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import DecrementButton from '../../counter/buttons/DecrementButton'
import IncrementButton from '../../counter/buttons/IncrementButton'
import EventCounter from './EventCounter'
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

const EventDetailedHeader = ({ openModal, authenticated, loading, event, isHost, isGoing, updatingCategoryLike, cancelupdatingCategoryLike }) => {
  
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
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment attached="bottom">
        {!isHost && (
          <div>
              {isGoing && !event.cancelled &&
              <Button onClick={() => cancelupdatingCategoryLike(event)}>Cancel My Place</Button>}

              {!isGoing && authenticated && !event.cancelled &&
              <Button loading={loading} onClick={() => updatingCategoryLike(event)} color="teal">JOIN THIS EVENT</Button>}
              
              {!authenticated && !event.cancelled &&
              <Button loading={loading} onClick={() => openModal('UnauthModal')} color="teal">JOIN THIS EVENT</Button>}
              
              {event.cancelled && !isHost &&
              <Label size='large' color='red' content='This event has been cancelled'/>}
          </div>
        )}

        {isHost && (
          <Button
            as={Link}
            to={`/manage/${event.id}`}
            color="orange"
          >
            Manage Event
          </Button>
        )}
      {/*   <IncrementButton event={event}  />
        <DecrementButton event={event}/>
        <EventCounter event={event}/> */}
        <SubCategoryButton event={event} sub={'junior'} openModel={openModal} updatingCategoryLike={updatingCategoryLike}
            loading={loading}
            isHost={isHost}
            isGoing={isGoing}
            updatingCategoryLike={updatingCategoryLike}
            cancelupdatingCategoryLike={cancelupdatingCategoryLike}
            authenticated={authenticated}
        />
        <SubCategoryButton event={event} sub={'medior'} openModel={openModal} updatingCategoryLike={updatingCategoryLike}
         loading={loading}
         isHost={isHost}
         isGoing={isGoing}
         updatingCategoryLike={updatingCategoryLike}
         cancelupdatingCategoryLike={cancelupdatingCategoryLike}
         authenticated={authenticated}
        
        />
        <SubCategoryButton event={event} sub={'senior'} openModel={openModal} updatingCategoryLike={updatingCategoryLike}
         loading={loading}
         isHost={isHost}
         isGoing={isGoing}
         updatingCategoryLike={updatingCategoryLike}
         cancelupdatingCategoryLike={cancelupdatingCategoryLike}
         authenticated={authenticated}

        />
        
      </Segment>

    </Segment.Group>
  );
};

export default EventDetailedHeader;
