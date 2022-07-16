import React, { useCallback, useEffect } from 'react';

import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import { DataGrid, GridCell, GridColDef, GridRenderCellParams, GridRow, GridRowParams, useGridApiRef } from '@mui/x-data-grid';
import axios, { AxiosInstance } from 'axios';
import { debounce, DebouncedFunc } from 'lodash';

import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import { Autocomplete, Avatar, Backdrop, Breadcrumbs, Button, Card, CardContent, Divider, Fade, Paper, Stack, TextField, ToggleButton, Typography, TypographyProps } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import Portal from '@mui/material/Portal';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Decimation,
  DateAdapter,
  ChartOptions
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
    hide: true,
    width: 150
  },
  {
    field: 'name',
    headerName: 'Item',
    width: 150,
    valueGetter: ({ row }: { row: { ngk: GameItem } }) => ({ name: row.ngk.name, src: row.ngk.icon }),
    renderCell: (params: GridRenderCellParams<{ name: string, src: string }>) => (
      <React.Fragment>
        <Avatar sx={{
          }}
          variant='rounded'
          src={params.value.src}
        />
        <Typography
          sx={{
            textIndent: 10
          }}
        >
          { params.value.name }
        </Typography>
      </React.Fragment>
    )
  },
  {
    field: 'priceNGK',
    headerName: 'NGK Min Buyout',
    type: 'number',
    width: 180,
    valueGetter: ({ row }: { row: { ngk: GameItem } }) => row.ngk.stats.current.minBuyout,
    renderCell: (params: GridRenderCellParams<number>) => <PriceDisplay price={params.value} />
  },
  {
    field: 'marketpriceNGK',
    headerName: 'NGK Market Price',
    type: 'number',
    width: 180,
    cellClassName: 'Full-Width',
    valueGetter: ({ row }: { row: { ngk: GameItem } }) => row.ngk.stats.current.marketValue,
    renderCell: (params: GridRenderCellParams<number>) => <PriceDisplay price={params.value} />
  },
  {
    field: 'diffMinBuyout',
    headerName: 'Diff Min Buyout',
    type: 'number',
    width: 180,
    valueGetter: ({ row }: { row: { ngk: GameItem, pwv: GameItem }}) => row.ngk.stats.current.minBuyout - row.pwv.stats.current.minBuyout,
    renderCell: (params: GridRenderCellParams<number>) => (
      <PriceDisplay 
        price={params.value}
        props={{ color: params.value > 0 
          ? 'green' 
          : params.value < 0 
            ? 'red' 
            : 'white' }} 
      />
    )
  },
  {
    field: 'diffMarketprice',
    headerName: 'Diff Market Price',
    type: 'number',
    width: 180,
    valueGetter: ({ row }: { row: { ngk: GameItem, pwv: GameItem }}) => row.ngk.stats.current.marketValue - row.pwv.stats.current.marketValue,
    renderCell: (params: GridRenderCellParams<number>) => (
      <PriceDisplay 
        price={params.value}
        props={{ color: params.value > 0 
          ? 'green' 
          : params.value < 0 
            ? 'red' 
            : 'white' }} 
      />
    )
  },
  {
    field: 'pricePWV',
    headerName: 'PWV Min Buyout',
    type: 'number',
    width: 180,
    valueGetter: ({ row }: { row: { pwv: GameItem }}) => row.pwv.stats.current.minBuyout,
    renderCell: (params: GridRenderCellParams<number>) => <PriceDisplay price={params.value} />
  },
  {
    field: 'marketpricePWV',
    headerName: 'PWV Market Price',
    type: 'number',
    width: 180,
    cellClassName: 'Full-Width',
    valueGetter: ({ row }: { row: { pwv: GameItem }}) => row.pwv.stats.current.marketValue,
    renderCell: (params: GridRenderCellParams<number>) => <PriceDisplay price={params.value} />
  }
];

const PriceDisplay: React.FC<{ price: number, props?: TypographyProps}> = ({price, props}) => {
  const isMinus = price < 0;
  const absPrice = Math.abs(price);

  const goldPrice = Math.floor(absPrice / 10000);
  const silverPrice = Math.floor((absPrice - (goldPrice * 10000)) / 100);
  const copperPrice = (absPrice - (goldPrice * 10000 + silverPrice * 100));
  
  return ( 
  <React.Fragment>
    { isMinus && (
      <Typography component="span" {...props}>
        -
      </Typography>
    )}
    { goldPrice > 0 && (
      <React.Fragment>
        <Typography color='gold' component="span" {...props}>
        { goldPrice }
        </Typography>
        <img alt='gold' src="https://wow.zamimg.com/images/icons/money-gold.gif"/>
      </React.Fragment>
    ) }
    { silverPrice > 0 && (
      <React.Fragment>
        <Typography marginLeft={0.5} color='silver' component="span" {...props}>
          { silverPrice }
        </Typography>
        <img alt='silver' src="https://wow.zamimg.com/images/icons/money-silver.gif"/>
      </React.Fragment>
    ) }
    { copperPrice > 0 && (
      <React.Fragment>
        <Typography marginLeft={0.5} color='brown' component="span" {...props}>
          { copperPrice }
        </Typography>
        <img alt='copper' src="https://wow.zamimg.com/images/icons/money-copper.gif"/>
      </React.Fragment>
    ) }
  </React.Fragment>
)
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Decimation,
);

export const options: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    decimation: {
      enabled: false,
      algorithm: 'min-max',
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        callback: function(value) { 
          return new Date(this.getLabels()[value as number]).toLocaleDateString('en-GB', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
        },
      }
    },
    y: {
      ticks: {
        callback: function(value) {
          const price = value as number;

          const goldPrice = Math.floor(price / 10000);
          const silverPrice = Math.floor((price - (goldPrice * 10000)) / 100);
          const copperPrice = (price - (goldPrice * 10000 + silverPrice * 100));

          return `${goldPrice}g ${silverPrice}s ${copperPrice}c`;
        }
      }
    }
  },
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
}, 500, { maxWait: 1000 });


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
  const [marketData, setMarketData] = React.useState<({ ngk: GameItem & MarketItem, pwv: GameItem & MarketItem })[]>([]);

  const [selectedRow, selectRow] = React.useState<{ ngk: GameItem & MarketItem, pwv: GameItem & MarketItem }>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  useEffect(() => {
    if ( marketData.length > 0 ) {
      localStorage.setItem('data', JSON.stringify(marketData.map(item => item.ngk.itemId )));

      console.log(localStorage.getItem('data'));
    }
  }, [marketData]);

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

  const requestItemData = (itemId: number) => {
    return axios.all([
      nexusHub.get(`/items/nethergarde-keep-alliance/${itemId}`),
      nexusHub.get(`/items/nethergarde-keep-alliance/${itemId}/prices`),
      nexusHub.get(`/items/pyrewood-village-alliance/${itemId}`),
      nexusHub.get(`/items/pyrewood-village-alliance/${itemId}/prices`)
    ])
  }

  const handleSearchResult = (_: any, value: { itemId: number } | null) => {
    if (value !== null) {
      requestItemData(value.itemId)
        .then(result => {
          const searchedItemData = result[0].data as GameItem;
          const searchedMarketData = result[1].data as MarketItem;
          const PWVSearchedItemData = result[2].data as GameItem;
          const PWVSearchedMarketData = result[3].data as MarketItem;
          
          

          setMarketData([
            ...marketData, 
            { ngk: {...searchedItemData, ...searchedMarketData} as GameItem & MarketItem, 
              pwv: {...PWVSearchedItemData, ...PWVSearchedMarketData} as GameItem & MarketItem
            }]);
        });
    }
    return null;
  }

  useEffect(() => {
    console.log(localStorage.getItem('data'));

    if (marketData.length < 1 && localStorage.getItem('data') !== null) {
      const data: number[] = JSON.parse(localStorage.getItem('data')!);

      Promise.all(data.map(id => requestItemData( id )))
        .then(result => {
          setMarketData(result.map(itemData => {
            const searchedItemData = itemData[0].data as GameItem;
            const searchedMarketData = itemData[1].data as MarketItem;
            const PWVSearchedItemData = itemData[2].data as GameItem;
            const PWVSearchedMarketData = itemData[3].data as MarketItem;

            return { 
              ngk: {...searchedItemData, ...searchedMarketData} as GameItem & MarketItem, 
              pwv: {...PWVSearchedItemData, ...PWVSearchedMarketData} as GameItem & MarketItem
            };
          }));
        })
    }

    }, [])

  const handleOpen = (params: GridRowParams, event: React.MouseEvent<HTMLElement>) => {
    selectRow(params.row as { ngk: GameItem & MarketItem, pwv: GameItem & MarketItem })
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);

  console.log(selectedRow);

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
      <Typography></Typography>
      <DataGrid
        rows={marketData}
        columns={columns}
        sx={{
          paddingTop: '80px'
        }}
        loading={!marketData || marketData.length === 0}
        getRowId={row => row.ngk.itemId}
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
              backgroundColor: theme.palette.background.paper
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
                  src={selectedRow.ngk.icon}
                  variant="rounded"/>
                <div style={{ float: 'left'}}>
                  <Breadcrumbs sx={{ paddingLeft: 1.5 }} aria-label="breadcrumb">
                    { selectedRow.ngk.tags.map( tag => (
                      <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        { tag }
                      </Typography>
                    ))}
                  </Breadcrumbs>
                  <Typography sx={{ paddingLeft: 1.5 }} variant='h5'>
                    { selectedRow.ngk.name }
                  </Typography>
                </div>
              </div>
              <div>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  NGK Min Buyout
                </Typography>
                <PriceDisplay 
                  price={ selectedRow.ngk.stats.current.minBuyout }
                  props={{ fontSize: 22 }}/>
                <Typography 
                  component='sup'
                  sx={{
                    fontSize: 12,
                    color: selectedRow.ngk.stats.current.minBuyout - selectedRow.ngk.stats.previous.minBuyout < 0 ? 'red' : 'green'
                  }}
                >
                  { ((selectedRow.ngk.stats.current.minBuyout - selectedRow.ngk.stats.previous.minBuyout) / selectedRow.ngk.stats.previous.minBuyout * 100).toFixed(1) }%
                </Typography>
              </div>
              <div>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  PWV Min Buyout
                </Typography>
                <PriceDisplay 
                  price={ selectedRow.pwv.stats.current.minBuyout }
                  props={{ fontSize: 22 }}/>
                <Typography 
                  component='sup'
                  sx={{
                    fontSize: 12,
                    color: selectedRow.pwv.stats.current.minBuyout - selectedRow.pwv.stats.previous.minBuyout < 0 ? 'red' : 'green'
                  }}
                >
                  { ((selectedRow.pwv.stats.current.minBuyout - selectedRow.pwv.stats.previous.minBuyout) / selectedRow.pwv.stats.previous.minBuyout * 100).toFixed(1) }%
                </Typography>
              </div>
              <div>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  NGK Market Value
                </Typography>
                <PriceDisplay 
                  price={ selectedRow.ngk.stats.current.marketValue }
                  props={{ fontSize: 22 }}/>
                <Typography 
                  component='sup'
                  sx={{
                    fontSize: 12,
                    color: selectedRow.ngk.stats.current.marketValue - selectedRow.ngk.stats.previous.marketValue < 0 ? 'red' : 'green'
                  }}
                >
                  { ((selectedRow.ngk.stats.current.marketValue - selectedRow.ngk.stats.previous.marketValue) / selectedRow.ngk.stats.previous.marketValue * 100).toFixed(1) }%
                </Typography>
              </div>
              <div>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  PWV Market Value
                </Typography>
                <PriceDisplay 
                  price={ selectedRow.pwv.stats.current.marketValue }
                  props={{ fontSize: 22 }}/>
                <Typography 
                  component='sup'
                  sx={{
                    fontSize: 12,
                    color: selectedRow.pwv.stats.current.marketValue - selectedRow.pwv.stats.previous.marketValue < 0 ? 'red' : 'green'
                  }}
                >
                  { ((selectedRow.pwv.stats.current.marketValue - selectedRow.pwv.stats.previous.marketValue) / selectedRow.pwv.stats.previous.marketValue * 100).toFixed(1) }%
                </Typography>
              </div>
            </Stack>
            <Stack direction={'row'}>
              <div style={{ width: '50%', height: '200px'}}>
                <Line
                  style={{ width: '100%' }}
                  options={options as any}
                  title='Min Buyout'
                  data={{
                    labels: selectedRow.ngk.data.map(record => new Date(record.scannedAt)),
                    datasets: [
                      {
                        label: 'NGK',
                        tension: 0.2,
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: selectedRow.ngk.data.map(record => record.minBuyout),
                      },
                      {
                        label: 'PWV',
                        tension: 0.2,
                        backgroundColor: 'rgb(132, 99, 255)',
                        borderColor: 'rgb(132, 99, 255)',
                        data: selectedRow.pwv.data.map(record => record.minBuyout),
                      },
                    ]
                  }}
                  height='300px'
                />
              </div>
              <div style={{ width: '50%', height: '200px'}}>
                <Line
                  style={{ width: '100%' }}
                  options={options as any}
                  title='Market Value'
                  data={{
                    labels: selectedRow.ngk.data.map(record => new Date(record.scannedAt)),
                    datasets: [
                      {
                        label: 'NGK',
                        tension: 0.2,
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: selectedRow.ngk.data.map(record => record.marketValue),
                      },
                      {
                        label: 'PWV',
                        tension: 0.2,
                        backgroundColor: 'rgb(132, 99, 255)',
                        borderColor: 'rgb(132, 99, 255)',
                        data: selectedRow.pwv.data.map(record => record.marketValue),
                      },
                    ]
                  }}
                  height='300px'
                />
              </div>
            </Stack>
            </CardContent>
          </Card>
        </Popover>
      )}
    </div>
  );
}

export default Auctions;
