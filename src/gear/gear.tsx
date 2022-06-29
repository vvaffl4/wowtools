import * as React from 'react';
// import { gql, GraphQLClient } from 'graphql-request'

import { createTheme, CSSObject, styled, Theme, ThemeProvider, useTheme } from '@mui/material/styles';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { Avatar } from '@mui/material';
import { green } from '@mui/material/colors';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GearSelect from './gearSelect';
import GearDisplay from './gearDisplay';



const rows = [
  { id: 1, slot: 'head', armor: 20, age: 35 },
  { id: 2, slot: 'neck', armor: 20, age: 42 },
  { id: 3, slot: 'shoulders', armor: 20, age: 45 },
  { id: 4, slot: 'back', armor: 20, age: 16 },
  { id: 5, slot: 'chest', armor: 20, age: null },
  { id: 6, slot: 'wrists', armor: 20, age: 150 },
  { id: 7, slot: 'hands', armor: 20, age: 44 },
  { id: 8, slot: 'waist', armor: 20, age: 36 },
  { id: 9, slot: 'legs', armor: 20, age: 65 },
];

function Gear() {
  const theme = useTheme();
  const [openGearSelect, setOpenGearSelect] = React.useState(false);
  const [columns, setColumns] = React.useState<GridColDef[]>([]);

  React.useEffect(() => {
    setColumns([
      { 
        field: 'id', 
        headerName: 'ID', 
        width: 90,
        hide: true
      },
      {
        field: 'item',
        headerName: 'Item',
        renderCell: (params: GridRenderCellParams) => (
          <Avatar 
            src="https://wow.zamimg.com/images/wow/icons/large/spell_holy_greaterheal.jpg" 
            variant="rounded"
            onClick={() => setOpenGearSelect(true)}
            />
        )
      },
      {
        field: 'slot',
        headerName: 'Slot',
        width: 150
      },
      {
        field: 'armor',
        headerName: 'Armor',
        type: 'number',
        width: 110
      },
      {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.firstName || ''} ${params.row.lastName || ''}`,
      },
    ]);
  }, [])

  return (
    <React.Fragment>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />
      <GearDisplay id={41648} open={false} onClose={function (): void {
        throw new Error('Function not implemented.');
      } }/>
      <GearSelect
        open={openGearSelect}
        onClose={() => setOpenGearSelect(false)}
        />
    </React.Fragment>
  );
}

export default Gear;
