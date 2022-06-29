import * as React from 'react';
// import { gql, GraphQLClient } from 'graphql-request'

import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Paper, Container, Grid, Autocomplete, Chip, TextField, Button, Typography } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import axios from 'axios';
import { Stats } from '../gear/GearPiece';

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
  // const theme = useTheme();
  const [foundGems, setFoundGems] = React.useState<Gem[]>([]);
  const [gear, setGear] = React.useState<string[]>([]);
  const [selectedGear, setSelectedGear] = React.useState<string>('');
  const [gems, setGems] = React.useState<Gem[]>([]);
  const [selected, setSelected] = React.useState<Gem[]>([]);

  React.useEffect(() => {
    axios.get('/gems.json')
      .then((response) => {
        setGems(response.data);
        setFoundGems(response.data);
      })
      
    axios.get('/gear.json')
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
      sx={{paddingTop: 8}}>
      <Grid container>
        <Grid item xs={4}>
          <Autocomplete
            id="size-small-filled"
            size="small"
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
              if(newValue !== null) {
                setSelectedGear(newValue);
              }
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            multiple
            id="size-small-filled"
            size="small"
            sx={{
              '.MuiAutocomplete-inputRoot' : { borderRadius: '0' }
            }}
            forcePopupIcon={false}
            autoComplete={false}
            open={false}
            onChange={(event, newValue) => {
              setSelected(newValue);
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
                variant="filled"
                label="Gems"
                placeholder="Gem name or stat"
                disabled={selected.length > 2}
                onChange={(event) => {
                  handleSearchTermsChange(event.target.value);
                }}
                onKeyUp={(event) => {
                  if (event.code === 'Enter' && foundGems.length < 2) {
                    handleGemAdd(foundGems[0]);
                  }
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <Button 
            fullWidth 
            sx={{ 
              height: '100%',
              borderRadius: '0 5px 0 0' 
            }}
            size='large' 
            variant="contained"
            disabled={selectedGear === '' || selected.length < 1}
            onClick={handleRequestCopy}
          > 
            Copy Request 
          </Button>
        </Grid>
      </Grid>
      <Masonry 
        columns={{ xs: 2, sm: 4, md: 5, xl: 6 }} 
        spacing={{ xs: 1, sm: 2, md: 3 }}
        style={{ margin: 0, backgroundColor: '#ffffff0c' }}>
        { foundGems
          .map((gem, index) => (
          <Item 
            sx={{ 
              
            }} 
            key={gem.Name} 
            onClick={() => handleGemAdd(gem)}
          >
            <Grid
              container
              direction="row" 
              justifyContent="center"
              alignItems="center"
            >
              <Avatar 
              sx={{ marginBottom: 2 }}
                src={`https://wow.zamimg.com/images/wow/icons/large/${gem.Icon}.jpg`}/>
            </Grid>
            <Typography>
              { gem.Name }
            </Typography>
            { gem.Stats.map((stat) => (
              <Typography variant='overline'>
                { Object.entries(stat).reduce((_, [statName, amount]) => `${statName.replace(/([A-Z])/g, ' $1').trim()} ${amount}`, '') }
              </Typography>
            )) }
          </Item>
        ))}
      </Masonry>
    </Container>
  );
}

export default Gems;
