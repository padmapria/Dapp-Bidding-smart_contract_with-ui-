require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */

const DEFAULT_NETWORK = process.env.DEFAULT_NETWORK
const KOVAN_RPC_URL =
    process.env.KOVAN_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const RINKEBY_RPC_URL =
    process.env.RINKEBY_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const PRIVATE_KEY =
    process.env.PRIVATE_KEY ||
    "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a"
const INFURA_API_URL = 
    process.env.INFURA_API_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/your-api-key"

module.exports = {
  defaultNetwork: DEFAULT_NETWORK,
  networks: {
    ganache: {
      url: "HTTP://127.0.0.1:8545",
      gasLimit: 6000000000,
      defaultBalanceEther: 10,
    },
    kovan: {
        url: KOVAN_RPC_URL,
        accounts: [PRIVATE_KEY],
        chainId: 42,
        blockConfirmations: 6,
        gas: 6000000,
    },
    rinkeby: {
        url: RINKEBY_RPC_URL,
        accounts: [PRIVATE_KEY],
        chainId: 4,
        blockConfirmations: 6,
        gas: 5500000,
    },
  },
  solidity: "0.8.9",
};
