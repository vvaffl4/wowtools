import { Divider, Fade, Paper, Stack, useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import React, { useRef, useState } from "react";
import PriceDisplay from "./PriceDisplay";

const PriceDetails: React.FC<{ name: string, icon: string, tags: string[], tooltip: { label: string, format?: string }[], sellPrice: number }> = ({ name, icon, tags, tooltip, sellPrice }) => {
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
      <Avatar
        sx={{ float: 'left', width: 56, height: 56 }}
        src={icon}
        variant="rounded"/>
      <div style={{ float: 'left'}}>
        <Breadcrumbs sx={{ paddingLeft: 1.5 }} aria-label="breadcrumb">
          { tags.map( tag => (
            <Typography sx={{ fontSize: 14 }} color="text.secondary">
              { tag }
            </Typography>
          ))}
        </Breadcrumbs>
        <Typography sx={{ paddingLeft: 1.5 }} variant='h5'>
          { name }
        </Typography>
      </div>
      <Popover 
        sx={{
          top: '-15px',
          left: '-20px'
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
            paddingLeft: '20px',
            paddingY: '15px',
            width: `${hoverWidth + 24}px`,
            backgroundColor: theme.palette.grey[900]
          }}
          onMouseLeave={handleClose}
        >
          <Avatar
            sx={{ float: 'left', width: 56, height: 56 }}
            src={icon}
            variant="rounded"/>
          <div style={{ float: 'left'}}>
            <Breadcrumbs sx={{ paddingLeft: 1.5 }} aria-label="breadcrumb">
              { tags.map( tag => (
                <Typography sx={{ fontSize: 14 }} color="text.secondary">
                  { tag }
                </Typography>
              ))}
            </Breadcrumbs>
            <Typography sx={{ paddingLeft: 1.5 }} variant='h5'>
              { name }
            </Typography>
            <Stack
              divider={<Divider/>}
              sx={{
                paddingBottom: 1.5
              }}
            >
              { tooltip.slice(1).filter(tip => !tip.label.startsWith('Sell')).map(tip => (
                <Typography
                  variant='overline'
                  sx={{
                    textIndent: 13,
                    color: theme.palette.grey[400]
                  }}
                >
                  { tip.label }
                </Typography>
              )) }
              <Typography
                variant='overline'
                sx={{
                  textIndent: 13,
                  color: theme.palette.grey[400]
                }}
              >
                Sell Price: <PriceDisplay price={sellPrice} props={{ variant: 'overline' }}/>
              </Typography>
            </Stack>
          </div>
        </Paper>
      </Popover>
    </div>
  );
}

export default PriceDetails;