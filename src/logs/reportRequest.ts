import { gql } from "graphql-request";

export const reportRequestQuery = gql`
{
  reportData {
    report(code: "wRpC1xkJLma762NK") {
      title
      startTime
      endTime
      owner {
        name
      }
      fights {
        name
        startTime
        endTime
        kill
        enemyNPCs {
          gameID
        }
        bossPercentage
      }
      guild {
        name
      }
      events(startTime: 0, endTime: 1647984160068, useAbilityIDs: true, dataType: Casts, limit: 10000) {
        data
      }
      masterData(translate: true) {
        gameVersion
        actors {
          id
          gameID
          name
        }
      }
      rankedCharacters {
        id
        classID
        name
      }
    }
  }
}`;