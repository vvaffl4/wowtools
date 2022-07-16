import * as React from 'react';
import { useRef } from 'react';

import { Avatar, AvatarGroup, styled, Typography } from '@mui/material';

import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Character } from './raidCharacterInterface';

interface RaidCharacterProps extends Character {
  onDrop: (
    character: Character,
    e: DraggableEvent,
    data: DraggableData) => void
}

const RaidCharacter: React.FC<RaidCharacterProps> = ({ name, race, gender, class: charClass, spec, onDrop }) => {
  
  const handleDrop = (e: DraggableEvent, data: DraggableData) => onDrop({name, race, gender, class: charClass, spec}, e, data);

  return (
    <Draggable
      // handle=".handle"
      defaultPosition={{x: 0, y: 0}}
      scale={1}
      bounds='.container'
      onStop={handleDrop}
    >
      <div style={{ 
        position: 'absolute',
        top: '50px',
        display: 'inline-block',
        userSelect: 'none'
      }}
      >  
        <Avatar
          sx={{ width: 56, height: 56, userSelect: 'none' }}
          imgProps={{
            draggable: false
          }}
          alt="Travis Howard" 
          src={`https://wow.zamimg.com/images/wow/icons/large/classicon_${charClass}.jpg`}
        >
          Su
        </Avatar>
        <AvatarGroup 
          sx={{ 
            marginTop: '-75px', 
            justifyContent: 'center', 
            alignItems: 'center'
          }}
        >
          <Avatar 
            sx={{ width: 24, height: 24 }}
            alt="Remy Sharp" 
            src={`https://wow.zamimg.com/images/wow/icons/large/race_${race}_${gender}.jpg`} />
        </AvatarGroup>
        <AvatarGroup 
          sx={{ marginTop: '40px', justifyContent: 'center', alignItems: 'center' }}
        >
          <Avatar 
            sx={{ width: 18, height: 18 }}
            alt="Remy Sharp" 
            src="https://wow.zamimg.com/images/wow/icons/medium/spell_holy_holybolt.jpg" />
          <Avatar 
            sx={{ width: 18, height: 18 }}
            alt="Travis Howard" 
            src="https://wow.zamimg.com/images/wow/icons/medium/spell_holy_auraoflight.jpg" />
        </AvatarGroup>
      </div>
    </Draggable>
  );
}

export default RaidCharacter;
