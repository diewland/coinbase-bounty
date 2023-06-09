require('dotenv').config()
const { PRIVATE_KEY } = process.env
const { ethers, keccak256, toUtf8Bytes, recoverAddress, formatUnits } = require("ethers")

// contract config
const RPC_BASE_GOERLI = 'https://goerli.base.org'
const RIDDLE_ADDR = '0xc1e40f9FD2bc36150e2711e92138381982988791'
const RIDDLE_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"close","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"finishingTimes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLeaderboardStats","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"hasSolvedChallenge1","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"hasSolvedChallenge2","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"isOnLeaderboard","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isOpenFlag","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"leaderboard","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"open","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"previousSignature","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"riddleAnswer","type":"string"}],"name":"solveChallenge1","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"riddleAnswer","type":"string"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"solveChallenge2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"riddleAnswer","type":"string"},{"internalType":"address","name":"signer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"solveChallenge3","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"solvedChallenge1","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"solvedChallenge2","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userWhoUsedSigner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

// https://www.coinbase.com/bounty/ethdenver23
// https://goerli.basescan.org/address/0xc1e40f9FD2bc36150e2711e92138381982988791#code
const RIDDLE_1_HASH = '0x3896ee3a8be6143be3fa1938adbae827fc724b5ff649501e7fd8c0c5352cbafa'
const RIDDLE_2_HASH = '0x9c611b41c1f90946c2b6ddd04d716f6ec349ac4b4f99612c3e629db39502b941'
const RIDDLE_3_HASH = '0x3cd65f6089844a3c6409b0acc491ca0071a5672c2ab2a071f197011e0fc66b6a'
/// @dev calculated as ECDSA.toEthSignedMessageHash(RIDDLE_3_HASH)
const RIDDLE_3_ETH_MESSAGE_HASH = '0x20a1626365cea00953c957fd02ddc4963990d404232d4e58acb66f46c59d9887'

// prepare contract
let provider = new ethers.JsonRpcProvider(RPC_BASE_GOERLI)
let wallet = new ethers.Wallet(PRIVATE_KEY, provider)
let contract = new ethers.Contract(RIDDLE_ADDR, RIDDLE_ABI, wallet)

// submit template
let submit = async (no, callback) => {
  let out = null
  try { out = await callback() }
  catch (err) { out = err.reason }
  console.log(`submit #${no}:`, out)
}

async function main() {

  // answer
  const ANSWER_1 = 'faucet'    // cccccc
  const ANSWER_2 = 'The Merge' // Ccc Ccccc
  const ANSWER_3 = 'EIP-4844'  // CCC-NNNN

  // wallet info
  let balance = await provider.getBalance(wallet.address)
  console.log(wallet.address, '->' , formatUnits(balance), 'ETH')
  console.log('---')

  // recheck result
  let riddles = [
    [ RIDDLE_1_HASH, ANSWER_1 ],
    [ RIDDLE_2_HASH, ANSWER_2 ],
    [ RIDDLE_3_HASH, ANSWER_3 ],
  ]
  riddles.forEach((rr, i) => {
    console.log(`RIDDLE#${i+1}`, keccak256(toUtf8Bytes(rr[1])) == rr[0], rr[1])
  })
  console.log('---')

  // RIDDLE#1
  await submit(1, async _ => contract.solveChallenge1.send(ANSWER_1))

  // RIDDLE#2
  await submit(2, async _ => {
    let signature = await wallet.signMessage(RIDDLE_2_HASH)
    return contract.solveChallenge2.send(ANSWER_2, signature)
  })

  // RIDDLE#3
  let out3 = null
  await submit(3, async _ => {
    let signature = await wallet.signMessage(RIDDLE_3_HASH)
    let signer = recoverAddress(RIDDLE_3_ETH_MESSAGE_HASH, signature)
    return contract.solveChallenge3.send(ANSWER_3, signer, signature)
  })

}
main().then(_ => process.exit(0)).catch(error => { console.error(error); process.exit(1) })
