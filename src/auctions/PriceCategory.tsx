import { useTheme } from "@mui/material";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography, { TypographyProps } from "@mui/material/Typography";
import React, { useRef, useState } from "react";
import PriceCompare from "./PriceCompare";
import PriceDisplay from "./PriceDisplay";

const PriceCategory: React.FC<{ category: string, lastUpdated: string, current: number, previousUpdated: string, previous: number }> = ({ category, lastUpdated, current, previousUpdated, previous }) => {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  }
  
  const handleClose = () => {
    setOpen(false);
  }

  const hoverWidth = ref.current ? ref.current.clientWidth : 0;

  return ( 
    <div 
      ref={ref} 
      onMouseEnter={handleOpen} 
    >
      <Typography 
        sx={{ fontSize: 14 }} 
        color="text.secondary" 
        gutterBottom
      >
        { category }
      </Typography>
      <PriceDisplay 
        price={ current }
        props={{ fontSize: 22 }}/>
      <Typography 
        component='sup'
        sx={{
          paddingLeft: 0.5,
          fontSize: 12,
          color: current - previous < 0 ? 'red' : 'green'
        }}
      >
        { (( current - previous ) / previous * 100).toFixed(1) }%
      </Typography>
      <Popover 
        sx={{
          top: '-15px',
          left: '-24px'
        }}
        open={open && ref.current !== null}
        onClose={handleClose}
        anchorEl={ref.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        TransitionComponent={Fade}
        transitionDuration={500}
      >
        <Paper
          sx={{
            padding: '15px',
            width: `${hoverWidth + 30}px`,
            backgroundColor: theme.palette.grey[900]
          }}
          onMouseLeave={handleClose}
        >
          <Typography
            sx={{ 
              textIndent: 9,
              fontSize: 14 
            }} 
            color="text.secondary" 
            gutterBottom
          >
            { category }
          </Typography>
          <Stack 
            direction='column'
            spacing={0.5}
          >
            <div style={{ paddingLeft: '9px' }}>
              <PriceDisplay price={current} props={{ fontSize: 22 }}/>
            </div>
            <div style={{ paddingLeft: '9px' }}>
              <Typography variant='caption' color={theme.palette.grey[400]}>
                { new Date(lastUpdated).toLocaleString('en-GB', {  day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
              </Typography>
            </div>
            <PriceCompare priceDifference={current - previous} props={{ orientation: 'horizontal' }}/>
            <div style={{ paddingLeft: '9px' }}>
              <PriceDisplay price={previous} props={{ fontSize: 22 }}/>
            </div>
            <div style={{ paddingLeft: '9px' }}>
              <Typography variant='caption' color={theme.palette.grey[400]}>
                { new Date(previousUpdated).toLocaleString('en-GB', {  day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
              </Typography>
            </div>
          </Stack>
        </Paper>
      </Popover>
    </div>
  );
}

export default PriceCategory;