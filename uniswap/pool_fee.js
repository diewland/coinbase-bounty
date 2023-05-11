const { ethers, formatUnits } = require("ethers")

// pool config
const FROM_ADDR = '0xb6621cbF70E95d6C90BE651C719534d08e7E42ca'
const POOL_URL  = 'https://app.uniswap.org/#/pools/10000'
const POOL_ID   = POOL_URL.split('/').at(-1)

// contract config
const RPC_BSC       = 'https://endpoints.omniatech.io/v1/bsc/mainnet/public'
const UNIV3POS_ADDR = '0x7b8A01B39D58278b5DE7e48c8449c9f4F5170613'
const COLLECT_ABI   = [{"inputs":[{"components":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint128","name":"amount0Max","type":"uint128"},{"internalType":"uint128","name":"amount1Max","type":"uint128"}],"internalType":"struct INonfungiblePositionManager.CollectParams","name":"params","type":"tuple"}],"name":"collect","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"}]

// prepare contract
let provider = new ethers.JsonRpcProvider(RPC_BSC)
let contract = new ethers.Contract(UNIV3POS_ADDR, COLLECT_ABI, provider)

async function main() {

  // https://ethereum.stackexchange.com/a/130519/4462
  // MAX_VALUE UINT128, to Collect All value
  const MAX = (BigInt(Math.pow(2, 128))-1n).toString() // "340282366920938463463374607431768211455"

  // collect data
  const encoded = {
    tokenId: POOL_ID,
    recipient: FROM_ADDR,
    amount0Max: MAX,
    amount1Max: MAX,
  }
  const trx = await contract.collect.staticCall(encoded)

  // result
  console.log(POOL_URL)
  console.log('FEE 0 :', formatUnits(trx.amount0, 18))
  console.log('FEE 1 :', formatUnits(trx.amount1, 18))

}
main().then(_ => process.exit(0)).catch(error => { console.error(error); process.exit(1) })
