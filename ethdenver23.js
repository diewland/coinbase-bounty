// https://www.coinbase.com/bounty/ethdenver23
// https://goerli.basescan.org/address/0xc1e40f9FD2bc36150e2711e92138381982988791#code

const keccak256 = require('keccak256')

const RIDDLE_1_HASH = '0x3896ee3a8be6143be3fa1938adbae827fc724b5ff649501e7fd8c0c5352cbafa'.substr(2)
const RIDDLE_2_HASH = '0x9c611b41c1f90946c2b6ddd04d716f6ec349ac4b4f99612c3e629db39502b941'.substr(2)
const RIDDLE_3_HASH = '0x3cd65f6089844a3c6409b0acc491ca0071a5672c2ab2a071f197011e0fc66b6a'.substr(2)
/// @dev calculated as ECDSA.toEthSignedMessageHash(RIDDLE_3_HASH)
const RIDDLE_3_ETH_MESSAGE_HASH = '0x20a1626365cea00953c957fd02ddc4963990d404232d4e58acb66f46c59d9887'.substr(2)

var num_09 = "0123456789".split('')
var az_low = "abcdefghijklmnopqrstuvwxyz".split('')
var az_up = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')

// RIDDLE 1
/*
az_low.forEach(c1 => {
  az_low.forEach(c2 => {
    az_low.forEach(c3 => {
      az_low.forEach(c4 => {
        az_low.forEach(c5 => {
          az_low.forEach(c6 => {
            let out = c1 + c2 + c3 + c4 + c5 + c6;
            let out2 = keccak256(out).toString('hex')
            console.log(out, out2)
            if (out2 == RIDDLE_1_HASH) throw Exception('Found!')
          });
        });
      });
    });
  });
});
*/

// RIDDLE 3
/*
az_up.forEach(c1 => {
  az_up.forEach(c2 => {
    az_up.forEach(c3 => {
      num_09.forEach(n1 => {
        num_09.forEach(n2 => {
          num_09.forEach(n3 => {
            num_09.forEach(n4 => {
              let out = `${c1}${c2}${c3}-${n1}${n2}${n3}${n4}`
              let out2 = keccak256(out).toString('hex')
              console.log(out, out2)
              if (out2 == RIDDLE_3_HASH) throw Exception('Found!')
            })
          })
        })
      })
    })
  })
})
*/

let riddles = [
  [ RIDDLE_1_HASH, 'faucet' ],    // cccccc
  [ RIDDLE_2_HASH, '???' ],       // Ccc Ccccc
  [ RIDDLE_3_HASH, 'EIP-4844' ],  // CCC-NNNN
]
riddles.forEach((rr, i) => {
  console.log(`R${i+1}`, keccak256(rr[1]).toString('hex') == rr[0])
})
