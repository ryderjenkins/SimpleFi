import getSnxFarmingAPY from './snxFarmingAPY';
import getCurveFarmingAPY from './curveFarmingAPY';

//formula for APY: (yearlyReward * cropPrice) / (totalSupply * seedPrice)
//TODO: add documentation
async function getFarmingAPYs (field, userTokens, userTokenPrices) {
  const rewardRateAddress = field.contractAddresses.find(address => address.addressTypes.includes('rewardRate'));
  let APY;

  switch (rewardRateAddress.contractInterface.name) {

    case "synthetix susd farm":
    case "mstable farm":
      APY = await getSnxFarmingAPY(rewardRateAddress, field, userTokenPrices);
      break;

    case 'curve reward gauge':
      APY = await getCurveFarmingAPY(rewardRateAddress, field, userTokens, userTokenPrices);
      break;

    default:
      APY = 'undefined';
  }

  return APY;
}

export default getFarmingAPYs;