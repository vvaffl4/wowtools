import * as React from 'react';
import { useState } from 'react';
// import { gql, GraphQLClient } from 'graphql-request'

import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import { GearPiece, QualityType, SocketColor, Stats } from './GearPiece';
import data from './itemDB.json';
import { Avatar, AvatarGroup, ListItem, ListItemAvatar, ListItemText, Paper, Popover, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import { grey } from '@mui/material/colors';

const gearData = data["Item"] as GearPiece[];

const equivalencies: { [key: string]: number } = {
  Armor: 0.001,
  Stamina: 0.2,
  Strength: 2,
  Agility: 1.5,
  AttackPower: 1,
  CritRating: 0.8,
  Resilience: 0.1,
  MetaSocket: 80,
  RedSocket: 40,
  BlueSocket: 20,
  YellowSocket: 36
}

const getQualityColor = (quality: QualityType) => (
  quality === 'Legendary' ? 'orange'
    : quality === 'Epic' ? 'violet'
      : quality === 'Rare' ? 'blue'
        : 'white'
)

const getClassColor = (className: string) => (
  className === 'Warrior' ? 'brown'
    : className === 'Rogue' ? 'yellow'
      : 'red'
)

const getGemCount = (color: SocketColor, item?: GearPiece) => (
  item 
    ? (item.SocketColor1 === color ? 1 : 0) +
      (item.SocketColor2 === color ? 1 : 0) +
      (item.SocketColor3 === color ? 1 : 0)
    : 0
)

const getGemColor = (gemName: SocketColor) => (
  gemName === 'Meta' ? 'grey'
    : gemName === 'Red' ? 'red'
      : gemName === 'Blue' ? 'blue'
      : 'yellow'
)

interface GearSelectProps {
  id: number,
  open: boolean
  onClose: () => void
}

const GearDisplay: React.FC<GearSelectProps> = ({ id, open, onClose }) => {
  const theme = useTheme();
  const [gearPiece, _] = useState(gearData.find((gearPiece) => gearPiece.Id === id));
  const gearStats = gearPiece?.Stats as Stats;

  const hasGems = gearPiece?.SocketColor1 || gearPiece?.SocketColor2 || gearPiece?.SocketColor3;
  const redGems = getGemCount('Red', gearPiece);
  const blueGems = getGemCount('Blue', gearPiece);
  const yellowGems = getGemCount('Yellow', gearPiece);
  const metaGems = getGemCount('Meta', gearPiece);
  
  const totalGemEquivalency = 
    (equivalencies['MetaSocket'] ? equivalencies['MetaSocket'] * metaGems : 0) +
    (equivalencies['RedSocket'] ? equivalencies['RedSocket'] * redGems : 0) +
    (equivalencies['BlueSocket'] ? equivalencies['BlueSocket'] * blueGems : 0) +
    (equivalencies['YellowSocket'] ? equivalencies['YellowSocket'] * yellowGems : 0);
 

  console.log(gearPiece);
  

  return gearPiece ? (
    <Popover
      id={'1'}
      open={true}
      // anchorEl={anchorEl}
      // onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <List>
        <ListItem disablePadding sx={{ paddingX: 2 }}>
          <ListItemAvatar>
            <Paper sx={{ display: 'inline-block', float: 'left' }} elevation={3}>
              <Avatar variant='rounded' src={`https://wow.zamimg.com/images/wow/icons/large/${gearPiece.IconPath}.jpg`}/>
            </Paper>
          </ListItemAvatar>
          <ListItemText 
            primary={
              <Typography fontSize={16} color={getQualityColor(gearPiece.Quality)}>
                { gearPiece.Name }
              </Typography>} 
            secondary={
              <Typography fontSize={11} color={'gray'} align='left'>
                { `IL ${gearPiece.ItemLevel} ${gearPiece.Type} ${gearPiece.Slot}` }
              </Typography>}  />
        </ListItem>
        { gearPiece?.RequiredClasses.length > 0 && (
          <ListItem disablePadding sx={{ paddingX: 2, paddingBottom: 1 }}>
            <ListItemAvatar>
              <AvatarGroup max={4}>
                <Avatar 
                  src={`https://wow.zamimg.com/images/wow/icons/large/classicon_${gearPiece.RequiredClasses.toLowerCase()}.jpg`}
                  sx={{ width: 24, height: 24 }}/>
                <Avatar 
                  src={`https://wow.zamimg.com/images/wow/icons/large/classicon_warrior.jpg`}
                  sx={{ width: 24, height: 24 }}/>
                <Avatar 
                  src={`https://wow.zamimg.com/images/wow/icons/large/classicon_deathknight.jpg`}
                  sx={{ width: 24, height: 24 }}/>
                <Avatar 
                  src={`https://wow.zamimg.com/images/wow/icons/large/classicon_paladin.jpg`}
                  sx={{ width: 24, height: 24 }}/>
              </AvatarGroup>
            </ListItemAvatar>
            <ListItemText 
              secondary={
                <React.Fragment>
                  {/* <Avatar src={`https://wow.zamimg.com/images/wow/icons/large/classicon_${gearPiece.RequiredClasses}.jpg`}/> */}
                  {/* <Typography component={'span'} fontSize='small' color={getClassColor(gearPiece.RequiredClasses)}>
                    { gearPiece.RequiredClasses + ' ' }
                  </Typography> */}
                  <Typography fontSize='small' paddingLeft={1}>
                    { gearPiece.SetName }
                  </Typography>
                </React.Fragment>} />
          </ListItem>
        )}
        <ListItem disablePadding>
          <Table sx={{ backgroundColor: '#282828' }} size="small" aria-label={gearPiece.Name}>
            <TableHead>
              <TableRow>
                <TableCell><b>Stat</b></TableCell>
                <TableCell align="center"><b>Amount</b></TableCell>
                <TableCell align="right"><b>Equivalency</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gearStats && Object.entries(gearStats).map(([key, value]) => (
                <TableRow
                  key={key}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{key}</TableCell>
                  <TableCell align="center">{value}</TableCell>
                  <TableCell align="right">{ (value * (equivalencies[key] || 0)).toFixed(2) }</TableCell>
                </TableRow>
              ))}
              { hasGems && (
                <TableRow
                    key={'gems'}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">GemSlots</TableCell>
                  <TableCell align="center">
                    { gearPiece.SocketColor1 && (
                      <Typography component='span' color={getGemColor(gearPiece.SocketColor1)} lineHeight={1}>
                        <DiamondOutlinedIcon fontSize='small' sx={{verticalAlign: 'bottom'}}/>
                      </Typography>
                    )}
                    { gearPiece.SocketColor2 && (
                      <Typography component='span' color={getGemColor(gearPiece.SocketColor2)} lineHeight={1}>
                        <DiamondOutlinedIcon fontSize='small' sx={{verticalAlign: 'bottom'}}/>
                      </Typography>
                    )}
                    { gearPiece.SocketColor3 && (
                      <Typography component='span' color={getGemColor(gearPiece.SocketColor3)} lineHeight={1}>
                        <DiamondOutlinedIcon fontSize='small' sx={{verticalAlign: 'bottom'}}/>
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">{ totalGemEquivalency }</TableCell>
                </TableRow> 
              )}
              { hasGems 
                && (
                  <TableRow
                    key={'socketBonus'}
                    sx={{ border: 0 }}
                  >
                    <TableCell component="th" scope="row">SocketBonus</TableCell>
                    <TableCell align="right">
                    </TableCell>
                    <TableCell align="right">{ totalGemEquivalency }</TableCell>
                  </TableRow>)
              }
              { hasGems && (
                  Object.entries(gearPiece.SocketBonus).map(([key, value]) => (
                    <TableRow
                      key={key}
                      sx={{ border: 0 }}
                    >
                      <TableCell component="th" scope="row" align="right">{ key }</TableCell>
                      <TableCell align="center">
                        { value }
                      </TableCell>
                      <TableCell align="right">{ (value * (equivalencies[key] || 0)).toFixed(2) }</TableCell>
                    </TableRow>
                  ))
                )
              }
              <TableRow
                  key={'total'}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">Total</TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="right">{
                    ( gearPiece.Stats !== "" && Object
                      .entries({
                        ...gearStats,
                        // ...gearPiece.SocketBonus,
                        MetaSocket: metaGems, 
                        RedSocket: redGems, 
                        BlueSocket: blueGems, 
                        YellowSocket: yellowGems
                      })
                      .reduceRight(
                        (total, [key, value]) => 
                          total + (value * (equivalencies[key] || 0))
                        , 0).toFixed(2)
                    )}
                  </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </ListItem>
      </List>
    </Popover>
  ): null;
}

export default GearDisplay;
