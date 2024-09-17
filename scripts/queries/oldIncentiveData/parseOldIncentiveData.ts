export function parseOldIncentiveData(data) {
  if (!data || !data.data || !data.data.incentives) {
    throw new Error('Invalid data structure')
  }

  return data.data.incentives.map((incentive) => ({
    rewardToken: incentive.rewardToken,
    pool: incentive.pool,
    startTime: incentive.startTime,
    endTime: incentive.endTime,
    refundee: incentive.refundee,
    positions: incentive.stakedPositions.map((sp) => sp.position.id),
  }))
}
