import * as React from 'react';
import { useRef } from 'react';
// import { gql, GraphQLClient } from 'graphql-request'

import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Paper, Container, Grid, Autocomplete, Chip, TextField, Button, Typography, Stepper, Step, StepLabel, Box } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import axios from 'axios';
import { Stats } from '../gear/GearPiece';
import { QontoStepIcon } from './stepperElements';
import { QontoConnector } from './stepperElements';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2), 
  textAlign: 'center',
  cursor: 'pointer',
  ":hover": { 
    backgroundColor: '#ffffff21',
    transition: 'background-color 200ms'
  },
  ":only-of-type": {
    backgroundColor: '#ffffff21',
    transition: 'background-color 200ms'
  },
  ":disabled": {
    backgroundColor: '#ffffff1',
    transition: 'background-color 200ms'
  },
  transition: 'background-color 200ms',
  color: theme.palette.text.secondary,
  userSelect: 'none'
}));

interface Gem {
  Name: string;
  Icon: string;
  Stats: Stats[];
}

function Gems() {
  const gemRef = useRef<HTMLInputElement>();
  const buttonRef = useRef<HTMLButtonElement>(null);
  // const theme = useTheme();
  const [foundGems, setFoundGems] = React.useState<Gem[]>([]);
  const [gear, setGear] = React.useState<string[]>([]);
  const [selectedGear, setSelectedGear] = React.useState<string>('');
  const [gems, setGems] = React.useState<Gem[]>([]);
  const [selected, setSelected] = React.useState<Gem[]>([]);

  const [progress, setProgress] = React.useState(0);
  const [buttonText, setButtonText] = React.useState('Copy Request');

  React.useEffect(() => {
    axios.get('/wowtools/gems.json')
      .then((response) => {
        setGems(response.data);
        setFoundGems(response.data);
      })
      
    axios.get('/wowtools/gear.json')
      .then((response) => setGear(response.data))
  }, [])

  const handleGemAdd = (gem: Gem) => {

    if (selected.length < 3) {
      setSelected([
        ...selected,
        gem
      ])
    }
  }

  const handleSearchTermsChange = (searchTerm: string) => {
    const searchTerms = searchTerm.split(' ')
    setFoundGems(gems
      .filter((gem) => 
        searchTerms.some(searchTerm => 
              gem.Name.toLowerCase().includes(searchTerm.toLowerCase())
          || gem.Stats.some((stat) => (
                Object.keys(stat)[0].toLowerCase().includes(searchTerm.toLowerCase()
              ))
        ))
      )
    );
  }

  const handleRequestCopy = () => {
    const requestGems = selected.reduce<{ [i: string]: number }>((total, { Name }) => {
      if(total[Name]) {
        ++total[Name];
      } else {
        total[Name] = 1;
      }

      return total;
    }, {});

    const request = `${selectedGear} \n${Object.entries(requestGems)
      .reduce((total, [gemName, amount], index, array) => 
        `${total}${amount}x ${gemName}${ index + 1 < array.length ? '\n': '' }`, '')}`;

    navigator.clipboard.writeText(request);
  }

  return (
    <Container
      sx={{ position: 'relative', paddingTop: 8, height: '100%' }}
    >
      <Stepper 
        sx={{ paddingBottom: 4 }}
        activeStep={progress}
        connector={<QontoConnector />}
      >
        <Step key={"findGear"}>
          <StepLabel 
            StepIconComponent={QontoStepIcon}
          >
            Find your gear piece
          </StepLabel>
        </Step>
        <Step key={"socketGems"}>
          <StepLabel StepIconComponent={QontoStepIcon}>Socket it with gems</StepLabel>
        </Step>
        <Step key={"copyRequest"}>
          <StepLabel StepIconComponent={QontoStepIcon}>Copy your request</StepLabel>
        </Step>
      </Stepper>
      <Grid container>
        <Grid item xs={4}>
          <Autocomplete
            id="size-small-filled"
            sx={{
              '.MuiAutocomplete-inputRoot' : { borderRadius: '5px 0 0 0' }
            }}
            freeSolo
            options={gear}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                label="Gear piece"
                placeholder="Search"
              />
            )}
            onChange={(event, newValue) => {
              console.log(newValue);
              if(newValue !== null) {
                
                setSelectedGear(newValue);
                setProgress(1);
                gemRef.current?.focus();
              } else {
                setProgress(0);
              }
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            multiple
            id="size-small-filled"
            sx={{
              '.MuiAutocomplete-inputRoot' : { borderRadius: '0' }
            }}
            forcePopupIcon={false}
            autoComplete={false}
            open={false}
            onChange={(event, newValue) => {
              setSelected(newValue);
              gemRef.current?.focus();
              
              if (newValue.length > 0) {
                setProgress(2);
              } else {
                setProgress(1);
              }
            }}
            options={[] as Gem[]}
            value={selected}
            getOptionLabel={(option) => option.Name}
            limitTags={3}
            renderTags={(tagValue, getTagProps) => {              
              return tagValue.map((option, index) => (
                <Chip
                  size='small'
                  avatar={<Avatar alt={option.Name} src={`https://wow.zamimg.com/images/wow/icons/large/${option.Icon}.jpg`} />}
                  label={option.Name.split(' ')[0]}
                  {...getTagProps({ index })}
                />
              ))}
            }
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={gemRef}
                variant="filled"
                label="Gems"
                placeholder="Gem name or stat"
                disabled={selected.length > 2}
                onChange={(event) => {
                  handleSearchTermsChange(event.target.value);
                  gemRef.current?.focus();
                }}
                onKeyUp={(event) => {
                  if (event.code === 'Enter' && foundGems.length < 2) {
                    handleGemAdd(foundGems[0]);
                  } else if (event.code === 'Enter') {
                    buttonRef.current?.focus();
                  }
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            ref={buttonRef}
            fullWidth 
            sx={{ 
              height: '100%',
              borderRadius: '0 5px 0 0',
              borderBottom: '1px solid #ffffffb3',
              ':disabled': {
                backgroundColor: '#ffffff17',
              }
            }}
            size='large' 
            variant="contained"
            disabled={selectedGear === '' || selected.length < 1}
            onClick={(event) => {
              handleRequestCopy();
              setButtonText('Request Copied')
              setTimeout(() => setButtonText('Copy Request'), 2000);
            }}
          > 
            { buttonText } 
          </Button>
        </Grid>
      </Grid>
      <Box
        sx={{ 
          position: 'absolute', 
          inset: '24px', 
          top: '175px', 
          overflowY: 'scroll',
          '::-webkit-scrollbar' : {
            display: 'none'
          },
          'msOverflowStyle': 'none',  /* IE and Edge */
          'scrollbarWidth': 'none'  /* Firefox */
        }}
      >
        <Masonry 
          columns={{ xs: 2, sm: 4, md: 5, xl: 6 }} 
          spacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ margin: 0, backgroundColor: '#ffffff0c' }}>
          { foundGems
            .map((gem, index) => (
            <Item
              key={index} 
              onClick={() => {
                handleGemAdd(gem);
                gemRef.current?.focus();
                
                setProgress(2);
              }}
            >
              <Grid
                container
                direction="row" 
                justifyContent="center"
                alignItems="center"
              >
                <Avatar 
                  sx={{ marginBottom: 2, width: 56, height: 56 }}
                  src={`https://wow.zamimg.com/images/wow/icons/large/${gem.Icon}.jpg`}/>
              </Grid>
              <Typography 
                component="p"
                sx={{ textDecoration: 'underline' }} 
              >
                { gem.Name }
              </Typography>
              { gem.Stats.map((stat, index) => (
                <Typography 
                  key={index}
                  variant="overline" 
                  component="p"
                  sx={{ lineHeight: 1.5 }}
                >
                  { Object.entries(stat).reduce((_, [statName, amount]) => `${statName.replace(/([A-Z])/g, ' $1').trim()} ${amount}`, '') }
                </Typography>
              )) }
            </Item>
          ))}
        </Masonry>
      </Box>
    </Container>
  );
}

export default Gems;
