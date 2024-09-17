export const query = `
{
  incentives (where: {endTime_lt: "1705948694", ended: false}) {
    id
    rewardToken
    pool
    startTime
    endTime
    refundee
    stakedPositions {
      position {
        id
      }
    }
  }
}
`
