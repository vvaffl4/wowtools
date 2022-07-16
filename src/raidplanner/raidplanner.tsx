import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
// import { gql, GraphQLClient } from 'graphql-request'

import { AppBar, Avatar, AvatarGroup, Badge, Container, IconButton, Paper, styled, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import firebase from 'firebase';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import RaidCharacter from './raidCharacter';
import { Character } from './raidCharacterInterface';
import RaidStatistics from './raidStatistics';

const RaidSizeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        content: '"25"',
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0
      }
    }, 
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: '"10"',
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0
    },
  },
  '& .MuiSwitch-track': {
    borderRadius: 20 / 2
  },
}));

// Required for side-effects
require("firebase/firestore");

function RaidPlanner() {
  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const guildDropRef = useRef<HTMLDivElement>(null);
  const raidDropRef = useRef<HTMLDivElement>(null);
  const tankDropRef = useRef<HTMLDivElement>(null);
  const healerDropRef = useRef<HTMLDivElement>(null);
  const dpsDropRef = useRef<HTMLDivElement>(null);
  const flexDropRef = useRef<HTMLDivElement>(null);

  // State
  const [phase, setPhase] = useState(0);
  const [guildMembers, setGuildMembers] = useState<Character[]>([]);
  const [raidMembers, setRaidMembers] = useState<Character[]>([]);
  const [tankRaidMembers, setTankRaidMembers] = useState<Character[]>([]);
  const [healerRaidMembers, setHealerRaidMembers] = useState<Character[]>([]);
  const [dpsRaidMembers, setDpsRaidMembers] = useState<Character[]>([]);
  const [flexRaidMembers, setFlexRaidMembers] = useState<Character[]>([]);

  React.useEffect(() => {
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration

    const firebaseConfig = {
      apiKey: "AIzaSyCmQAULCvHMFe6FOBc9uO3wRbMlPE06BY4",
      authDomain: "navi-3f880.firebaseapp.com",
      databaseURL: "https://navi-3f880.firebaseio.com",
      projectId: "navi-3f880",
      storageBucket: "navi-3f880.appspot.com",
      messagingSenderId: "473308055667",
      appId: "1:473308055667:web:21772ff9e097e4b4688206"
    };

    // Initialize Firebase
    // const app = firebase.initializeApp(firebaseConfig);
    // // Initialize Cloud Firestore and get a reference to the service
    // const db = firebase.firestore(app);

    // const querySnapshot = db.collection('wowtools').get()
    //   .then((querySnapshot) => {

    //     querySnapshot.forEach((docSnapshot) => {
    //       console.log(docSnapshot.get('name'));
    //     })
    //   });
  
    setGuildMembers([
      {
        name: 'Sumire',
        race: 'draenei',
        gender: 'female',
        class: 'paladin',
        spec: 'holy' 
      },
      {
        name: 'Takforkaffe',
        race: 'gnome',
        gender: 'female',
        class: 'warrior',
        spec: 'fury'
      },
      {
        name: 'Iskii',
        race: 'nightelf',
        gender: 'female',
        class: 'druid',
        spec: 'restoration'
      }
    ])

  }, []);

  const handleDrop = (
    character: Character, 
    e: DraggableEvent,
    data: DraggableData) => {
      
      const dragRect = data.node.getBoundingClientRect()

      if (guildDropRef.current) {
        const rect = guildDropRef.current.getBoundingClientRect();

        console.log(rect);

        if (rect.left <= dragRect.x && rect.top <= dragRect.y 
         && rect.right >= dragRect.x && rect.bottom >= dragRect.y) {
          setRaidMembers(raidMembers.filter(raidMember => raidMember.name !== character.name))
        }
      }
      if (raidDropRef.current) {
        const rect = raidDropRef.current.getBoundingClientRect();

        if (rect.left <= dragRect.x && rect.top <= dragRect.y 
         && rect.right >= dragRect.x && rect.bottom >= dragRect.y) {
          setRaidMembers([
            ...raidMembers.filter(raidMember => raidMember.name !== character.name),
            character
          ])
        }
      }
      if (tankDropRef.current) {
        const rect = tankDropRef.current.getBoundingClientRect();

        if (rect.left <= dragRect.x && rect.top <= dragRect.y 
         && rect.right >= dragRect.x && rect.bottom >= dragRect.y) {
          setTankRaidMembers([
            ...tankRaidMembers.filter(raidMember => raidMember.name !== character.name),
            character
          ])
          setHealerRaidMembers(healerRaidMembers.filter(raidMember => raidMember.name !== character.name))
          setDpsRaidMembers(dpsRaidMembers.filter(raidMember => raidMember.name !== character.name))
          setFlexRaidMembers(flexRaidMembers.filter(raidMember => raidMember.name !== character.name))
        }
      }
      if (healerDropRef.current) {
        const rect = healerDropRef.current.getBoundingClientRect();

        if (rect.left <= dragRect.x && rect.top <= dragRect.y 
         && rect.right >= dragRect.x && rect.bottom >= dragRect.y) {
          setHealerRaidMembers([
            ...healerRaidMembers.filter(raidMember => raidMember.name !== character.name),
            character
          ])
          setTankRaidMembers(tankRaidMembers.filter(raidMember => raidMember.name !== character.name))
          setDpsRaidMembers(dpsRaidMembers.filter(raidMember => raidMember.name !== character.name))
          setFlexRaidMembers(flexRaidMembers.filter(raidMember => raidMember.name !== character.name))
        }
      }
      if (dpsDropRef.current) {
        const rect = dpsDropRef.current.getBoundingClientRect();

        if (rect.left <= dragRect.x && rect.top <= dragRect.y 
         && rect.right >= dragRect.x && rect.bottom >= dragRect.y) {
          setDpsRaidMembers([
            ...dpsRaidMembers.filter(raidMember => raidMember.name !== character.name),
            character
          ])
          setHealerRaidMembers(healerRaidMembers.filter(raidMember => raidMember.name !== character.name))
          setTankRaidMembers(tankRaidMembers.filter(raidMember => raidMember.name !== character.name))
          setFlexRaidMembers(flexRaidMembers.filter(raidMember => raidMember.name !== character.name))
        }
      }
      if (flexDropRef.current) {
        const rect = flexDropRef.current.getBoundingClientRect();

        if (rect.left <= dragRect.x && rect.top <= dragRect.y 
         && rect.right >= dragRect.x && rect.bottom >= dragRect.y) {
          setFlexRaidMembers([
            ...flexRaidMembers.filter(raidMember => raidMember.name !== character.name),
            character
          ])
          setHealerRaidMembers(healerRaidMembers.filter(raidMember => raidMember.name !== character.name))
          setDpsRaidMembers(dpsRaidMembers.filter(raidMember => raidMember.name !== character.name))
          setTankRaidMembers(tankRaidMembers.filter(raidMember => raidMember.name !== character.name))
        }
      }
  };

  const handleNext = [
    () => {
      setPhase(phase + 1);
    },
    () => {
      setPhase(phase + 1);
    },
    () => {

    }
  ];

  const handleBack = [
    () => {

    },
    () => {
      setPhase(phase - 1)
    },
    () => {
      setPhase(phase - 1)
    }
  ];

  const handleReset = [
    () => {
      setRaidMembers([]);
    },
    () => {
      setTankRaidMembers([]);
      setHealerRaidMembers([]);
      setDpsRaidMembers([]);
      setFlexRaidMembers([]);
    },
    () => {

    }
  ]

  useEffect(() => {
    if (phase === 0) {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: 'smooth'});
      }
    }
    if (phase === 1) {
      if (scrollRef.current && raidDropRef.current) {
        scrollRef.current.scrollTo({ top: raidDropRef.current.offsetTop, behavior: 'smooth'});
      }
    }
    else if (phase === 2) {
      if (scrollRef.current && tankDropRef.current) {
        scrollRef.current.scrollTo({ top: tankDropRef.current.offsetTop, behavior: 'smooth'});
      }
    }

  }, [phase])
  
  return (
    <Container
      sx={{ 
        position: 'relative',
        height: '100%'
      }}
    >
      <div ref={scrollRef} style={{ position: 'absolute', top: 8, left: 0, right: 0, height: '60%', overflowY: 'hidden' }}>
        <div className='container' style={{ height: '150%' }}>
          <div ref={guildDropRef} style={{ width: '100%', height: '33%', border: '1px solid white', boxSizing: 'border-box' }}>

          </div>
          <div ref={raidDropRef} style={{ width: '100%', height: '33%', border: '1px solid white', boxSizing: 'border-box' }}>

          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '33%', border: '1px solid white', boxSizing: 'border-box' }}>
            <Paper 
              ref={tankDropRef}
              variant="outlined"
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%', height: '100%' }}
            >
              <Avatar 
                sx={{ width: 60, height: 60 }}
                src='https://wow.zamimg.com/images/wow/icons/large/inv_shield_06.jpg'/>
            </Paper>
            <Paper 
              ref={healerDropRef}
              variant="outlined"
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%', height: '100%' }}
            >
              <Avatar 
                sx={{ width: 60, height: 60 }}
                src='https://wow.zamimg.com/images/wow/icons/large/inv_staff_10.jpg'/>
            </Paper>
            <Paper 
              ref={dpsDropRef}
              variant="outlined"
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '40%', height: '100%' }}
            >
              <Avatar 
                sx={{ width: 60, height: 60 }}
                src='https://wow.zamimg.com/images/wow/icons/large/inv_sword_27.jpg'/>
            </Paper>
            <Paper 
              ref={flexDropRef}
              variant="outlined"
              sx={{ width: '20%', height: '100%' }}
            > 
            </Paper>
          </div>
          { guildMembers.map((character) => (
            <RaidCharacter
              onDrop={handleDrop}
              {...character} />
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', border: '1px solid white', color: 'white', overflowY: 'auto' }}>
        <AppBar position="absolute">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit" component="div">
              Members: { raidMembers.length } / <RaidSizeSwitch/>
            </Typography>
            <IconButton color="inherit" aria-label="menu" sx={{ mr: 2 }}
              onClick={handleBack[phase]}
            > 
              <ArrowBackIcon />
            </IconButton>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}
              onClick={handleNext[phase]}>
              <CheckIcon />
            </IconButton> 
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} 
              onClick={handleReset[phase]}
            >
              <RestartAltIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <RaidStatistics 
          members={raidMembers}
          tanks={tankRaidMembers}
          healers={healerRaidMembers}
          dps={dpsRaidMembers}
          flex={flexRaidMembers}
          />
      </div>
    </Container>
  );
}

export default RaidPlanner;
