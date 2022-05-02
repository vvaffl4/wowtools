import React from 'react';

import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import { DataGrid, GridCell, GridColDef, GridRenderCellParams, GridRow, GridRowParams, useGridApiRef } from '@mui/x-data-grid';
import axios, { AxiosInstance } from 'axios';
import { debounce, DebouncedFunc } from 'lodash';

import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import { Autocomplete, Avatar, Backdrop, Breadcrumbs, Button, Card, CardContent, Divider, Fade, Paper, Stack, TextField, ToggleButton, Typography } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import Portal from '@mui/material/Portal';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ThemeProvider } from '@emotion/react';
import { SearchItem } from './SearchItem';
import { MarketItem } from './MarketItem';
import { GameItem } from './GameItem';

const columns: GridColDef[] = [
  {
    field: 'itemId',
    headerName: 'Item Id',
    type: 'number',
    width: 150
  },
  {
    field: 'name',
    headerName: 'Item',
    width: 150
  },
  {
    field: 'price',
    headerName: 'Current Price',
    type: 'number',
    width: 110,
    valueGetter: ({ row }: { row: MarketItem }) => row.data[row.data.length - 1].minBuyout
  },
  {
    field: 'marketprice',
    headerName: 'Market Price',
    type: 'number',
    width: 110,
    cellClassName: 'Full-Width',
    valueGetter: ({ row }: { row: MarketItem }) => row.data[row.data.length - 1].marketvalue
  }
];

const PriceDisplay: React.FC<{ price: number}> = ({price}) => {
  const goldPrice = Math.floor(price / 10000);
  const silverPrice = Math.floor((price - (goldPrice * 10000)) / 100);
  const copperPrice = (price - (goldPrice * 10000 + silverPrice * 100));
  
  return ( 
  <React.Fragment>
    <Typography color='gold' component="span" fontSize={22}>
    { goldPrice > 0 && goldPrice }
    </Typography>
    <img src="https://wow.zamimg.com/images/icons/money-gold.gif"/>
    <Typography marginLeft={0.5} color='silver' component="span" fontSize={22}>
      { silverPrice > 0 && silverPrice }
    </Typography>
      <img src="https://wow.zamimg.com/images/icons/money-silver.gif"/>
    <Typography marginLeft={0.5} color='brown' component="span" fontSize={22}>
      { copperPrice > 0 && copperPrice }
    </Typography>
      <img src="https://wow.zamimg.com/images/icons/money-copper.gif"/>
      <span style={{ paddingLeft: '3px', color: '#a52a2a', fontSize: '11pt', verticalAlign: 'super' }}>-16%</span>
  </React.Fragment>
)
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  maintainAspectRatio: false
};

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
];

const lineData = {
  labels: labels,
  datasets: [{
    label: 'Price',
    tension: 0.2,
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [20, 10, 5, 2, 20, 30, 45],
  },
  {
    label: 'Marketprice',
    tension: 0.2,
    backgroundColor: 'rgb(255, 132, 99)',
    borderColor: 'rgb(255, 132, 99)',
    data: [10, 25, 10, 2, 29, 40, 25],
  }]
};

const nexusHub = axios.create({
  baseURL: 'https://api.nexushub.co/wow-classic/v1',
  timeout: 1000,
});

const sendDebounce = debounce((value: string) => {
  return nexusHub.get('/search', { params: { query: value }})
}, 1000, { maxWait: 1500 });


//   nexusHub?.get('https://api.nexushub.co/wow-classic/v1/items/nethergarde-keep-alliance/2589/prices').then(data => {
//   console.log(data);
// }).catch((error) => {
//   console.log(error)
// })
function Auctions() {
  const apiRef = useGridApiRef();
  const theme = useTheme();
  
  const [focus, setFocus] = React.useState(false);

  const [searchData, setSearchData] = React.useState<SearchItem[]>()
  const [marketData, setMarketData] = React.useState<(GameItem & MarketItem)[]>([]);

  const [selectedRow, selectRow] = React.useState<(GameItem & MarketItem)>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleTextfieldFocus = () => {
    setFocus(true);
  }

  const handleTextfieldBlur = () => {
    setFocus(false);
  }

  const handleTextfieldChange = (event: any, value: string) => {
    console.log(value);
    
    if (value.length > 2 && sendDebounce) {
      sendDebounce(value)?.then((searchResult: { data: SearchItem[] }) => {
        const searchData = [...(searchResult.data).reduce((a, c)=> {
          a.set(c.itemId, c);
          return a;
        }, new Map()).values()];

        setSearchData(searchData);
      });
    }
  }

  const handleSearchResult = (_: any, value: SearchItem | null) => {
    if (value !== null) {
      axios.all([
        nexusHub.get(`/items/nethergarde-keep-alliance/${value.itemId}`),
        nexusHub.get(`/items/nethergarde-keep-alliance/${value.itemId}/prices`)
      ])
        .then(result => {
          const searchedItemData = result[0].data as GameItem;
          const searchedMarketData = result[1].data as MarketItem;
          
          setMarketData([...marketData, {...searchedItemData, ...searchedMarketData} as (GameItem & MarketItem)]);
        });
    }
  }

  const handleOpen = (params: GridRowParams, event: React.MouseEvent<HTMLElement>) => {
    selectRow(params.row as (GameItem & MarketItem))
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);

  return (
    <div className='Auctions'>
      <Paper
          sx={{ 
            position: 'fixed',
            left: 0,
            right: 0, 
            margin: 2,
            zIndex: (theme) => theme.zIndex.drawer + 2 
          }}
          elevation={3}
        >
          <Autocomplete
            id="tags-standard"
            fullWidth
            options={searchData ? searchData : []}
            getOptionLabel={(option: SearchItem) => option.name}
            isOptionEqualToValue={(option: SearchItem, value: SearchItem) => option.itemId === value.itemId}
            onFocus={handleTextfieldFocus}
            onBlur={handleTextfieldBlur}
            onInputChange={handleTextfieldChange}
            onChange={handleSearchResult}
            blurOnSelect={true}
            renderInput={(params) => (
              <TextField
                {...params}            
                variant="filled"
                label="Search Item"
              />
            )}
            renderOption={(params, value, state) => (
              <ListItemButton
                component="li"
                key={value.itemId}
                {...params}
                >
                <Stack 
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  spacing={2}
                  divider={<Divider orientation="vertical" flexItem />}>
                  <Avatar 
                    src={value.imgUrl}
                    variant="rounded"/>
                  <Typography>{value.name}</Typography>
                </Stack>
              </ListItemButton>
            )}
          />
        </Paper>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={focus}
        onClick={handleClose}/>
      <DataGrid
        rows={marketData}
        columns={columns}
        sx={{
          paddingTop: '80px'
        }}
        loading={!marketData || marketData.length === 0}
        getRowId={row => row.itemId}
        onRowClick={handleOpen}
        pageSize={17}
        rowsPerPageOptions={[5]}
      />
      { (open && selectedRow) && (
        <Popover 
          sx={{
            left: '15px'
          }}
          open={open}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          TransitionComponent={Fade}
          transitionDuration={500}
        >
          <Card
            sx={{ 
              width: `${anchorEl?.clientWidth}px`,
              // height: '500px',
              backgroundColor: '#efdecd'
            }}
          >
            <CardContent>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={5}
              marginX={1}
            >
              <div>
                <Avatar
                  sx={{ float: 'left', width: 56, height: 56 }}
                  src={selectedRow.icon}
                  variant="rounded"/>
                <div style={{ float: 'left'}}>
                  <Breadcrumbs sx={{ paddingLeft: 1.5 }} aria-label="breadcrumb">
                    { selectedRow.tags.map( tag => (
                      <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        { tag }
                      </Typography>
                    ))}
                  </Breadcrumbs>
                  <Typography sx={{ paddingLeft: 1.5 }} variant='h5'>
                    { selectedRow.name }
                  </Typography>
                </div>
              </div>
              <div>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Current server price
                </Typography>
                <PriceDisplay 
                  price={ selectedRow.stats.current.minBuyout }/>
              </div>
              <div>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Current marketprice
                  </Typography>
                  <Typography color='#b87333' variant='h5'>
                  { selectedRow.stats.current.marketValue / 10000 > 0 && Math.floor(selectedRow.stats.current.marketValue / 10000) }g
                    <span style={{ paddingLeft: '3px', color: '#a4c639', fontSize: '11pt', verticalAlign: 'super' }}>+16%</span>
                  </Typography>
              </div>
            </Stack>
            <div style={{ width: '50%', height: '200px'}}>
              <Line
                style={{ width: '100%' }}
                options={options}
                data={lineData}
                height='300px'
              />
            </div>
            </CardContent>
          </Card>
        </Popover>
      )}
    </div>
  );
}

export default Auctions;
