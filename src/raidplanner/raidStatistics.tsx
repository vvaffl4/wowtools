import * as React from 'react';
import { useRef } from 'react';

import { Avatar, AvatarGroup, Box, Grid, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Character } from './raidCharacterInterface';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface RaidStatisticsProps {
  members: Character[],
  tanks: Character[],
  healers: Character[],
  dps: Character[]
  flex: Character[]
}

const RaidStatistics: React.FC<RaidStatisticsProps> = ({ members, tanks, healers, dps, flex }) => {
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Item>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Class</TableCell>
                    <TableCell align="right">Spec</TableCell>
                    <TableCell align="right">Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member) => (
                    <TableRow
                      key={member.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {member.name}
                      </TableCell>
                      <TableCell align="right">
                      <Avatar
                        sx={{ width: 20, height: 20, userSelect: 'none' }}
                        imgProps={{
                          draggable: false
                        }}
                        alt="Travis Howard" 
                        src={`https://wow.zamimg.com/images/wow/icons/large/classicon_${member.class}.jpg`}/>
                      </TableCell>
                      <TableCell align="right">{member.spec}</TableCell>
                      <TableCell align="right">   
                        <AvatarGroup>{
                          tanks.find(tank => tank.name === member.name) !== undefined ? (
                            <Avatar sx={{ width: 16, height: 16}} src='https://wow.zamimg.com/images/wow/icons/large/inv_shield_06.jpg'/>
                          ) : healers.find(healer => healer.name === member.name) ? (
                            <Avatar sx={{ width: 16, height: 16}} src='https://wow.zamimg.com/images/wow/icons/large/inv_staff_10.jpg'/>
                          ) : dps.find(dp => dp.name === member.name) ? (
                            <Avatar sx={{ width: 16, height: 16}} src='https://wow.zamimg.com/images/wow/icons/large/inv_sword_27.jpg'/>
                          ) : (
                            <Avatar sx={{ width: 16, height: 16}}/>
                          )
                        }</AvatarGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RaidStatistics;
