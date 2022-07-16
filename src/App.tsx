import * as React from 'react';
// import { gql, GraphQLClient } from 'graphql-request'
import './App.css';

import Backdrop from '@mui/material/Backdrop';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { createTheme, CSSObject, styled, Theme, ThemeProvider, useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DiamondIcon from '@mui/icons-material/Diamond';
import Auctions from './auctions/auctions';
import Logs from './logs/logs';
import Portal from '@mui/material/Portal';
import Gear from './gear/gear';
import Gems from './gems/gems';
import RaidPlanner from './raidplanner/raidplanner';

const Pages = {
  "Gems": { Icon: DiamondIcon, Page: Gems },
  "Logs": { Icon: SummarizeIcon, Page: Logs },
  "Auctions": { Icon: QueryStatsIcon, Page: Auctions },
  "GearPlanner": { Icon: QueryStatsIcon, Page: Gear },
  "Raid": { Icon: QueryStatsIcon, Page: RaidPlanner }
};
type PageKeyTypes = keyof typeof Pages;

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Main = styled(
  'main', 
  { shouldForwardProp: (prop) => prop !== 'open' }
)
<{
  open?: boolean;
}>
(({ theme, open }) => ({
  flexGrow: 1,
  width: 'calc(100% - 65px)',
  height: '100%',
  transform: `translateX(65px)`,
  transition: theme.transitions.create('transform', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('transform', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    transform: `translateX(${drawerWidth}px)`,
  }),
  ...(theme.palette.mode == 'dark' && {
    backgroundColor: theme.palette.background.default
  })
}));

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const theme = useTheme();
  const backdropContainer = React.useRef(null);
  const defaultContainer = React.useRef(null);
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const [page, setPage] = React.useState<PageKeyTypes>('Gems');
  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    if(!open) {
      setContainer(backdropContainer.current);
    } else {
      setContainer(defaultContainer.current);
    }

    setOpen(!open);
  };

  const handleOpenPage = (page: PageKeyTypes) => {
    setPage(page);
  }

  const Page = Pages[page].Page;

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <Portal container={container}>
          <Drawer 
            PaperProps={{
              sx: { zIndex: (theme) => theme.zIndex.drawer + 2 }
            }}
            variant="permanent" 
            anchor="left" 
            open={open}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerToggle}>
                {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {Object.entries(Pages).map(([index, {Icon}]) => (
                <ListItemButton
                  key={index}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => handleOpenPage(index as PageKeyTypes)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    { <Icon/> }
                  </ListItemIcon>
                  <ListItemText primary={index} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              ))}
            </List>
          </Drawer>
        </Portal>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleDrawerToggle}
          ref={backdropContainer}
        />
        <div ref={defaultContainer}>

        </div>
        <Main
          open={open}
        >
          <Page/>
        </Main>
      </div>
    </ThemeProvider>
  );
}

export default App;
