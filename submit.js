const dotenv = require('dotenv')
dotenv.config()
const PRIVATE_KEY = process.env.PRIVATE_KEY

const { ethers } = require("ethers")
const RPC_BASE_GOERLI = 'https://goerli.base.org'
const RIDDLE_ADDR = '0xc1e40f9FD2bc36150e2711e92138381982988791'
const RIDDLE_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"close","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"finishingTimes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLeaderboardStats","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"hasSolvedChallenge1","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"hasSolvedChallenge2","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"isOnLeaderboard","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isOpenFlag","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"leaderboard","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"open","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"previousSignature","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"riddleAnswer","type":"string"}],"name":"solveChallenge1","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"riddleAnswer","type":"string"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"solveChallenge2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"riddleAnswer","type":"string"},{"internalType":"address","name":"signer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"solveChallenge3","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"solvedChallenge1","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"solvedChallenge2","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userWhoUsedSigner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

async function main() {

  // prepare contract
  let provider = new ethers.JsonRpcProvider(RPC_BASE_GOERLI)
  let wallet = new ethers.Wallet(PRIVATE_KEY, provider)
  let riddle = new ethers.Contract(RIDDLE_ADDR, RIDDLE_ABI, wallet)

  // test access property
  let flag = await riddle.isOpenFlag()

  //console.log(riddle)
  //console.log(riddle.isOpenFlag)
  console.log(flag)
  console.log(wallet.address)

}

main()
  .then(_ => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
