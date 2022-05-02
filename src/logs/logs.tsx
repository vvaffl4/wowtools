import React from 'react';

import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { Report } from './Report';
import reportData from './reportData';

// const graphQLClient = new GraphQLClient('https://classic.warcraftlogs.com/api/v2/client', {
//   headers: {
//     'Content-Type': 'application/json',
//     authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTY1Y2RkZC02ZTAzLTRjYmEtYTI4Zi0yNDY2Njg5ZDAxYzUiLCJqdGkiOiI1MjU1OWRhMWE1MDg5NDU1NWM0ZDE5NjVkZTFkOTVhMjc0MGU0YzcyNWI5Y2M1NmRhYzIxNTJjMTQwMWM3NGUzMmM5NWVlNmUwZmFmZWIwMyIsImlhdCI6MTY0NjU4NDA5MC43NTM4NjIsIm5iZiI6MTY0NjU4NDA5MC43NTM4NjcsImV4cCI6MTY1Njk1MjA5MC43NDQ5MTEsInN1YiI6IiIsInNjb3BlcyI6WyJ2aWV3LXVzZXItcHJvZmlsZSIsInZpZXctcHJpdmF0ZS1yZXBvcnRzIl19.GwSjiEp4pexSz3C0xB5sRmy8_oqpHTTAJIXR-0NGH9ObBfiQB5_3Rqp5NcpF_wYTKWf7eAuqRHT99Obhdxl8e8hwGbx9D2xy7Fvnxt8chtu5lv97FFVj85m1NugogicG7G2X_B2hyHr1cSd75mPsNqHLNP8wk38tWuJHPBI-EtF_rNnDykqFe6AoWqEtRvLQlkmdS-vpgjyW9I88bAd0eJN7CK-bgCcBIOz20bS0rvOlKaVAupKm4N7CBjTZpRlkencDOaUL3xNgUvfvTwNmfaxjKeCHGf0nnsOLBG58yfJK4tEisUQ-FtZE6vZvPiAGk0h4VRQYvzLBz9RNYV-HTmDU7OGl-8evEf1JGg3zbyE6BGo_O29ASxPg-wPmhRsv4ZqzR-yajFK-6AeEnxDH8mHZ4_2X84m8_0kc_4ZxLD_M9sWTARxO2LBY5PagExLDWOi4U9lrwg0oFXI5Whn5lO9soIQFqj9JvJgHAOT9KWLOnWV-WReX7cN281W2-0Xq5SroZZwaqP3kOxlVaDXvJ-dFj1KLUtbywn6ecnUMlNLQXjqHd01Uj39cmdNWGr_anhstRGX77tnYUx8ri-s68rCHYkA9mWyshvu_uGP3YNozHdps69qpaImy9HBRT5UVKn3UBd4eoEW-I_hn52gC9zqh2aAkOjNUreOTwDlDLZ4',
//   },
// });

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Id',
    type: 'number',
    width: 150
  },
  {
    field: 'name',
    headerName: 'Character',
    width: 150
  },
  {
    field: 'manapot',
    headerName: 'Mana Pot Usage',
    headerClassName: 'Mana-Pot-Usage',
    type: 'number',
    width: 110
  },
  {
    field: 'hastepot',
    headerName: 'Haste Pot Usage',
    headerClassName: 'Haste-Pot-Usage',
    type: 'number',
    width: 110
  },
  {
    field: 'destrupot',
    headerName: 'Destru Pot Usage',
    headerClassName: 'Destru-Pot-Usage',
    type: 'number',
    width: 110
  }
];

function Logs() {
  const theme = useTheme();
  const [report, setReport] = React.useState<Report>();
  const [data, setData] = React.useState<{ columns: GridColDef[], rows: object[]}>({ columns, rows: [] });


  React.useEffect(() => {    
    setReport(reportData as Report);

    // graphQLClient.request(reportRequestQuery).then((data) => {
    //   console.log(data);   
      
    //   setReport(data.reportData.report);
    // }).catch((error) => {
    //   console.log(error);
    // })
  }, []);

  React.useEffect(() => {
    if (report) {
      const rows = report.rankedCharacters.map((character, index) => {
        const actor = report.masterData.actors.find((actor) => actor.name === character.name);
        const manaPotUsage = report.events.data.filter(event => 
          (event.abilityGameID === 28499 ||   // Super Mana Potion
           event.abilityGameID === 45051) &&  // Mad Alchemist's Potion
          event.sourceID === actor?.id).length;
        
        const hastePotUsage = report.events.data.filter(event => 
          (event.abilityGameID === 28507) &&  // Haste Potion
          event.sourceID === actor?.id).length;
          
        const destruPotUsage = report.events.data.filter(event => 
          (event.abilityGameID === 28508) &&  // Haste Potion
          event.sourceID === actor?.id).length;
          

        return { 
          id: index, 
          name: character.name, 
          manapot: manaPotUsage, 
          hastepot: hastePotUsage, 
          destrupot: destruPotUsage
        }
      });
      
      console.log(rows);
      
      
      setData({
        columns,
        rows
      })
    }
  }, [report]);

  return (
    <div className="Auctions">
      <DataGrid
        {...data}
        loading={!data || data.rows.length === 0}
        pageSize={17}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
}

export default Logs;
