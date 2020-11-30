import getCurveLiquidityHistory from './getCurveLiquidityHistory';
import getUniswapLiquidityHistory from './getUniswapLiquidityHistory';

/**
 * 
 * @param {Array} trackedFields - all tracked fields
 * @param {Object} field - currently analysed earning field
 * @param {Object} receiptToken - current field's receipt token
 * @param {Array} userReceiptTokenTxs - all user transactions involving receipt token
 * @param {String} userAccount - user's ethereum account
 * @dev switch is based on the field's protocol id, assuming liquidity extraction method is the same for
 *      all of a protocol's earning fields, as it only relies on the field's name & receipt token data 
 * @return {Array} - a list of user transactions ready to be processed by calcROI helper: {
 *    pricePerToken: at the time of the transaction
 *    one of four tx types: txIn, txOut, staked or unstaked (one filled with value, others undefined)
 *    txDate: date object
 *    tx: object containing all tx details (content can vary based on source)
 *  }
 */
async function getUserLiquidityHistory(trackedFields, field, receiptToken, userReceiptTokenTxs, userAccount) {
  
  const whitelist = createWhitelist(trackedFields, field);
  let liquidityHistory;

  switch (field.protocol.name) {

    case "Curve":
      //@dev: this function contains a map with multiple calls to coinGecko, hence promise.all in main func
      liquidityHistory = await getCurveLiquidityHistory(field, receiptToken, userReceiptTokenTxs, userAccount, whitelist)
      break;
      
    case "Uniswap":
      liquidityHistory = await getUniswapLiquidityHistory(field, userReceiptTokenTxs, userAccount, whitelist)
      break;
  
    default:
      break;
  }
  return liquidityHistory;
}


/**
 * 
 * @param {Array} trackedFields - all tracked fields
 * @param {Object} field - currently analysed earning field
 * @dev staking/unstaking field receipt tokens doesn't change the user's underlying balance so the corresponding addresses are "whitelisted"
 *      this helper assumes deposit and withdrawal addresses of the staking contract are the same
 * @return {Array} - a list of staking/unstaking addresses for use in the liquidity history extraction func
 * 
 */
function createWhitelist(trackedFields, field) {
  const whitelist = [];
  trackedFields.forEach(trackedField => {  
    trackedField.seedTokens.forEach(seedToken => {
      if (seedToken.tokenId === field.receiptToken) {
        const depositAddresses = trackedField.contractAddresses.filter(address => address.addressTypes.includes('deposit'));
        depositAddresses.forEach(depositAddress => whitelist.push(depositAddress.address.toLowerCase()))
      }
    })
  })
  return whitelist;
}

export default getUserLiquidityHistory;