import Chip from "@mui/material/Chip";
import Typography, { TypographyProps } from "@mui/material/Typography";
import React from "react";
import PriceDisplay from "./PriceDisplay";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import Divider, { DividerProps } from "@mui/material/Divider";

const PriceCompare: React.FC<{ priceDifference: number, props?: DividerProps }> = ({ priceDifference, props }) => {
  const isNegative = priceDifference < 0;
  const isPositive = priceDifference > 0;
  
  return (
    <Divider 
      orientation="vertical" 
      flexItem
      sx={{
        marginLeft: `0 !important`,
        '&-wrapperVertical' : {
          paddingY: 5,
          paddingX: 0
        },
        ' + div': {
          marginLeft: `0 !important`,
        }
      }}
      {...props}
    > 
      <Chip 
        icon={
          isPositive 
            ? <KeyboardArrowUpIcon />
            : isNegative
              ? <KeyboardArrowDownIcon />
              : <DragHandleIcon />
        } 
        label={
          <PriceDisplay
            includeMinus={false}
            price={ priceDifference } 
          />
        }
        size="small" 
        color={
          isPositive
            ? 'success'
            : isNegative
              ? 'error'
              : 'info'
        } 
        variant="outlined"
        sx={{
          '.MuiChip-labelSmall': {
            padding: 0,
            paddingRight: 0.5
          }
        }}
      />
    </Divider>
  );
}

export default PriceCompare;