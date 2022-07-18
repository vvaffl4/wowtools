import React, { useEffect } from 'react';

import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import { DataGrid, GridCell, GridColDef, GridRenderCellParams, GridRow, GridRowHeightParams, GridRowParams, useGridApiRef } from '@mui/x-data-grid';
import axios from 'axios';
import { debounce } from 'lodash';

import Popover from '@mui/material/Popover';

import { Autocomplete, Avatar, Backdrop, Breadcrumbs, Button, Card, CardContent, Chip, Divider, Fade, Paper, Stack, TextField, ToggleButton, Typography, TypographyProps } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';

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
  DecimationAlgorithm,
  DateAdapter,
  ChartOptions,
  ChartTypeRegistry
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { SearchItem } from './SearchItem';
import { MarketItem } from './MarketItem';
import { GameItem } from './GameItem';
import PriceDisplay from './PriceDisplay';
import PriceCategory from './PriceCategory';
import PriceCompare from './PriceCompare';
import PriceDetails from './PriceDetails';
import PriceAuction from './PriceAuction';

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
    ),
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Decimation
);

export const options: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    decimation: {
      enabled: true,
      algorithm: 'lttb',
      samples: 10
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

export const quantityOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    decimation: {
      enabled: true,
      algorithm: 'lttb',
      samples: 10
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
    }
  },
};

const nexusHub = axios.create({
  baseURL: 'https://api.nexushub.co/wow-classic/v1',
  timeout: 10000,
  // headers: {
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Headers': '*',
  //   'Access-Control-Allow-Credentials': 'true',
  //   'Access-Control-Allow-Methods': 'GET, OPTIONS'
  // }
});

const sendDebounce = debounce((value: string) => {  
  return nexusHub.get('/search', { params: { query: value } })
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


  const requestItemData = (itemId: number) => {
    return axios.all([
      nexusHub.get(`/items/nethergarde-keep-alliance/${itemId}`),
      nexusHub.get(`/items/nethergarde-keep-alliance/${itemId}/prices`),
      nexusHub.get(`/items/pyrewood-village-alliance/${itemId}`),
      nexusHub.get(`/items/pyrewood-village-alliance/${itemId}/prices`)
    ])
    .then(results => {
      results.forEach(result => {
        if (result.status !== 200) {
          if (result.status === 429) {
            if (result.headers['Retry-After']) {
              console.log('Retry-After', result.headers['Retry-After']);
              
            }
          }
          throw new Error("");
        }
      });
      
      return results;
    })
  }

  useEffect(() => {
    localStorage.clear();

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

  const handleSearchResult = (_: any, value: { itemId: number } | null) => {
    if (value !== null) {
      requestItemData(value.itemId)
        .then(result => {
          const searchedItemData = result[0].data as GameItem;
          const searchedMarketData = result[1].data as MarketItem;
          const PWVSearchedItemData = result[2].data as GameItem;
          const PWVSearchedMarketData = result[3].data as MarketItem;

          console.log(searchedItemData);
          
          if ( searchedItemData.stats.current.marketValue !== null ) {
            setMarketData([
              ...marketData, 
              { ngk: {...searchedItemData, ...searchedMarketData} as GameItem & MarketItem, 
                pwv: {...PWVSearchedItemData, ...PWVSearchedMarketData} as GameItem & MarketItem
              }
            ]);
          }
        })
        .catch((reason) => {
          console.log(reason);
          console.log(reason.status);
        });
    }
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

  const handleTextfieldFocus = () => {
    setFocus(true);
  }

  const handleTextfieldBlur = () => {
    setFocus(false);
  }

  const handleOpen = (params: GridRowParams, event: React.MouseEvent<HTMLElement>) => {
    selectRow(params.row as { ngk: GameItem & MarketItem, pwv: GameItem & MarketItem })
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
        getRowId={row => row.ngk.itemId}
        onRowClick={handleOpen}
        pageSize={17}
        rowsPerPageOptions={[5]}
      />
      { (open && anchorEl && selectedRow) && (
        <PriceAuction
          anchor={anchorEl}
          itemRecord={selectedRow}
          onClose={handleClose}
        />
        // <Popover 
        //   sx={{
        //     left: '15px',
        //   }}
        //   open={open}
        //   onClose={handleClose}
        //   anchorEl={anchorEl}
        //   anchorOrigin={{
        //     vertical: 'top',
        //     horizontal: 'left',
        //   }}
        //   TransitionComponent={Fade}
        //   transitionDuration={500}
        // >
        //   <Card
        //     sx={{
        //       width: `${anchorEl?.clientWidth}px`,
        //       backgroundColor: theme.palette.background.paper
        //     }}
        //   >
        //     <CardContent>
        //     <Stack
        //       direction="row"
        //       spacing={3}
        //       marginX={0.5}
        //     >
        //       <PriceDetails
        //         name={selectedRow.ngk.name}
        //         icon={selectedRow.ngk.icon}
        //         tags={selectedRow.ngk.tags}
        //       />
        //       <Divider orientation="vertical" flexItem />
        //       <PriceCategory 
        //         category='NGK Min Buyout'
        //         current={selectedRow.ngk.stats.current.minBuyout}
        //         previous={selectedRow.ngk.stats.previous.minBuyout}
        //       />
        //       <PriceCompare
        //         priceDifference={selectedRow.ngk.stats.current.minBuyout - selectedRow.pwv.stats.current.minBuyout}
        //       />
        //       <PriceCategory 
        //         category='PWV Min Buyout'
        //         current={selectedRow.pwv.stats.current.minBuyout}
        //         previous={selectedRow.pwv.stats.previous.minBuyout}
        //       />
        //       <Divider orientation="vertical" flexItem/>
        //       <PriceCategory 
        //         category='NGK Market Value'
        //         current={selectedRow.ngk.stats.current.marketValue}
        //         previous={selectedRow.ngk.stats.previous.marketValue}
        //       />
        //       <PriceCompare
        //         priceDifference={selectedRow.ngk.stats.current.marketValue - selectedRow.pwv.stats.current.marketValue}
        //       />
        //       <PriceCategory 
        //         category='PWV Market Value'
        //         current={selectedRow.pwv.stats.current.marketValue}
        //         previous={selectedRow.pwv.stats.previous.marketValue}
        //       />
        //     </Stack>
        //     <Stack direction={'row'}>
        //       <div style={{ width: '33%', height: '200px'}}>
        //         <Line
        //           style={{ width: '100%' }}
        //           options={options}
        //           title='Min Buyout'
        //           data={{
        //             labels: selectedRow.ngk.data.map(record => new Date(record.scannedAt)),
        //             datasets: [
        //               {
        //                 label: 'NGK',
        //                 tension: 0.2,
        //                 backgroundColor: 'rgb(255, 99, 132)',
        //                 borderColor: 'rgb(255, 99, 132)',
        //                 data: selectedRow.ngk.data.map(record => record.minBuyout),
        //               },
        //               {
        //                 label: 'PWV',
        //                 tension: 0.2,
        //                 backgroundColor: 'rgb(132, 99, 255)',
        //                 borderColor: 'rgb(132, 99, 255)',
        //                 data: selectedRow.pwv.data.map(record => record.minBuyout),
        //               },
        //             ]
        //           }}
        //           height='300px'
        //         />
        //       </div>
        //       <div style={{ width: '33%', height: '200px'}}>
        //         <Line
        //           style={{ width: '100%' }}
        //           options={options}
        //           title='Market Value'
        //           data={{
        //             labels: selectedRow.ngk.data.map(record => new Date(record.scannedAt)),
        //             datasets: [
        //               {
        //                 label: 'NGK',
        //                 tension: 0.2,
        //                 backgroundColor: 'rgb(255, 99, 132)',
        //                 borderColor: 'rgb(255, 99, 132)',
        //                 data: selectedRow.ngk.data.map(record => record.marketValue),
        //               },
        //               {
        //                 label: 'PWV',
        //                 tension: 0.2,
        //                 backgroundColor: 'rgb(132, 99, 255)',
        //                 borderColor: 'rgb(132, 99, 255)',
        //                 data: selectedRow.pwv.data.map(record => record.marketValue),
        //               },
        //             ]
        //           }}
        //           height='300px'
        //         />
        //       </div>
        //       <div style={{ width: '33%', height: '200px'}}>
        //         <Line
        //           style={{ width: '100%' }}
        //           options={quantityOptions}
        //           title='Quantity'
        //           data={{
        //             labels: selectedRow.ngk.data.map(record => new Date(record.scannedAt)),
        //             datasets: [
        //               {
        //                 label: 'NGK',
        //                 tension: 0.2,
        //                 backgroundColor: 'rgb(255, 99, 132)',
        //                 borderColor: 'rgb(255, 99, 132)',
        //                 data: selectedRow.ngk.data.map(record => record.quantity),
        //               },
        //               {
        //                 label: 'PWV',
        //                 tension: 0.2,
        //                 backgroundColor: 'rgb(132, 99, 255)',
        //                 borderColor: 'rgb(132, 99, 255)',
        //                 data: selectedRow.pwv.data.map(record => record.quantity),
        //               },
        //             ]
        //           }}
        //           height='300px'
        //         />
        //       </div>
        //     </Stack>
        //     </CardContent>
        //   </Card>
        // </Popover>
      )}
    </div>
  );
}

export default Auctions;
