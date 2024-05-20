export const ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "tokenContractAddress",
          "type": "address"
        }
      ],
      "name": "TokenCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "initial_supply",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "feeDepositAddress",
          "type": "address"
        }
      ],
      "name": "CreateNewCustomToken",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "CustomTokenArray",
      "outputs": [
        {
          "internalType": "contract CustomToken",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];