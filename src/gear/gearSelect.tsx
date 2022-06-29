import * as React from 'react';
// import { gql, GraphQLClient } from 'graphql-request'

import { createTheme, CSSObject, styled, Theme, ThemeProvider, useTheme } from '@mui/material/styles';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Avatar, Button, DialogActions, DialogContent, Divider, ListItemButton, ListSubheader, Stack, TextField, Typography } from '@mui/material';
import { GearPiece } from './GearPiece';
import data from './itemDB.json';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import useMediaQuery from '@mui/material/useMediaQuery';

const gearData = data["Item"] as GearPiece[];

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty('group')) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  return (
    <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
      {dataSet[1]}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: React.ReactChild[] = [];
  (children as React.ReactChild[]).forEach(
    (item: React.ReactChild & { children?: React.ReactChild[] }) => {
      itemData.push(item);
      itemData.push(...(item.children || []));
    },
  );

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child: React.ReactChild) => {
    if (child.hasOwnProperty('group')) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
}); 

interface GearSelectProps {
  open: boolean
  onClose: () => void
}

const GearSelect: React.FC<GearSelectProps> = ({ open, onClose }) => {
  const theme = useTheme();

  const handleClose = () => {
    onClose();
  };

  const handleTextfieldFocus = () => {
  }

  const handleTextfieldBlur = () => {
  }

  const handleTextfieldChange = (event: any, value: string) => {
    console.log(value);
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Set backup account</DialogTitle>
      <DialogContent>
        <Autocomplete
          id="tags-standard"
          fullWidth
          options={gearData ? gearData : []}
          getOptionLabel={(option: GearPiece) => option.Name}
          isOptionEqualToValue={(option: GearPiece, value: GearPiece) => option.Id === value.Id}
          onFocus={handleTextfieldFocus}
          onBlur={handleTextfieldBlur}
          onInputChange={handleTextfieldChange}
          blurOnSelect={true}
          renderInput={(params) => (
            <TextField
              {...params}            
              variant="filled"
              label="Search Item"
            />
          )}
          renderOption={(props, option) => [props, option]}
          renderGroup={(params) => params}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Test</Button>
      </DialogActions>
    </Dialog>
  );
}

export default GearSelect;
