import hre from 'hardhat'
import { getOldIncentiveData } from './queries/oldIncentiveData/getOldIncentiveData'
const { ethers } = hre

type Incentive = {
  rewardToken: string
  pool: string
  startTime: string
  endTime: string
  refundee: string
  positions: string[]
}

type IncentiveKey = {
  rewardToken: string
  pool: string
  startTime: string
  endTime: string
  refundee: string
}

type IncentiveMapping = {
  incentiveKey: IncentiveKey
  positions: Position[]
}

type Position = {
  id: number
}

async function main() {
  const v3StakerFactory = await ethers.getContractFactory('UniswapV3Staker')

  const v3Staker = await v3StakerFactory.attach('0xa7F01B3B836d5028AB1F5Ce930876E7e2dda1dF8')

  console.log('UniswapV3Staker:', v3Staker.address)

  const incentivesData: Incentive[] = await getOldIncentiveData()

  const positionsToUnstakePerIncentive = mapIncentives(incentivesData)

  await unstakePositionsForAllIncentives(v3Staker, positionsToUnstakePerIncentive)

  await endAllIncentives(v3Staker, positionsToUnstakePerIncentive)
}

function mapIncentives(incentives: Incentive[]): IncentiveMapping[] {
  return incentives.map((incentive) => ({
    incentiveKey: {
      rewardToken: incentive.rewardToken,
      pool: incentive.pool,
      startTime: incentive.startTime,
      endTime: incentive.endTime,
      refundee: incentive.refundee,
    },
    positions: incentive.positions.map((posId) => ({ id: Number(posId) })),
  }))
}

async function unstakePositionsForAllIncentives(v3Staker: any, incentives: IncentiveMapping[]): Promise<void> {
  for (const incentive of incentives) {
    try {
      console.log('Unstaking incentive', incentive.incentiveKey)
      await unstakePositionsForIncentive(v3Staker, incentive.incentiveKey, incentive.positions)
      console.log('Done unstaking incentive')
    } catch (e) {
      console.error('Error unstaking incentive', incentive.incentiveKey, e)
    }
  }

  console.log('Done unstaking all incentives')
}

async function unstakePositionsForIncentive(
  v3Staker: any,
  incentiveKey: IncentiveKey,
  positions: Position[]
): Promise<void> {
  for (const position of positions) {
    try {
      await v3Staker.unstakeToken(incentiveKey, position.id)
      console.log('Unstaked tokenId', position.id)
    } catch (e) {
      console.error('Error unstaking tokenId', position.id, e)
    }
  }
}

async function endAllIncentives(v3Staker: any, incentives: IncentiveMapping[]): Promise<void> {
  for (const incentive of incentives) {
    try {
      console.log('Ending incentive:', incentive.incentiveKey)
      await v3Staker.endIncentive(incentive.incentiveKey)
      console.log('Ended incentive')
    } catch (e) {
      console.error('Error ending incentive', incentive.incentiveKey, e)
    }
  }

  console.log('Done ending all incentives')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
