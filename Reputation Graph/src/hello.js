import { Wallet } from './near-wallet';
import { ethers } from 'ethers';

//AAVE V3 testnet is on Sepolia 
const network = 'sepolia';

//setting the contract ABI for retrieving wallet balance of a user
const walletBalanceProviderAddress = '0xCD4e0d6D2b1252E2A709B8aE97DBA31164C5a709';

//Getting wallet balance provider ABI
const walletBalanceProviderABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "users",
                "type": "address[]"
            },
            {
                "internalType": "address[]",
                "name": "tokens",
                "type": "address[]"
            }
        ],
        "name": "batchBalanceOf",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "provider",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getUserWalletBalances",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]

//setting provider URL to that of infura (sepolia)
const providerURL = 'https://sepolia.infura.io/v3/db4bbb5f4c224b55a40392836def6c9f';

// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const wallet = new Wallet({ network: 'testnet' });

// Setup on page load
document.addEventListener('DOMContentLoaded', async () => {
  let isSignedIn = await wallet.startUp();
  isSignedIn ? signedInUI() : signedOutUI();
});

// Button clicks
// document.querySelector('form').onsubmit = setGreeting;
document.querySelector('#sign-in-button').onclick = () => { wallet.signIn(); };
document.querySelector('#sign-out-button').onclick = () => { wallet.signOut(); };


// UI: Hide signed-in elements
function signedOutUI() { hide('#signed-in'); hide('#sign-out-button'); }

//Query AAVE
async function queryAAVE(walletid) {
  if(!walletid) {
    window.alert("Please login with your wallet!")
  }
  else{
    try{
      // Create a new provider
      const provider = new ethers.providers.JsonRpcProvider(providerURL);

      // Create a new contract instance
      const walletBalanceProviderContract = new ethers.Contract(walletBalanceProviderAddress, walletBalanceProviderABI, provider);

      //Token address of ETH
      const userAddress = wallet.accountId;

      // Get balance
      const [tokenAddresses, balances] = await walletBalanceProviderContract.getUserWalletBalances(provider, walletid);

      //display balance
      const displayDiv = document.querySelector('#displayDiv');
      displayDiv.innerHTML = '';
      tokenAddresses.forEach((address, index) => {
        const balanceInEther = ethers.utils.formatEther(balances[index]);
        const displayDivChild = document.createElement('div');
        displayDivChild.classList.add('aavedisplay');
        displayDivChild.innerHTML = `Token: ${address}, Balance: ${balanceInEther}`;
        displayDiv.appendChild(displayDivChild);
      });
    }
    catch(error){
      console.error("Error querying AAVE:", error);
      window.alert("Error occurred while querying AAVE: " + error.message);
    }
    //use the wallet ID logged in from the wallet to call AAVE APIs
  }
}

async function querySOL(walletid) {
  if(!walletid) {
    window.alert("Please login with your wallet!")
  }
  else{

  }
}

document.querySelector('#query-aave-button').onclick = () => queryAAVE(wallet.accountId);
document.querySelector('#query-sol-button').onclick = () => querySOL(wallet.accountId);


// UI: Hide signed-out elements
function signedInUI() {
  hide('#signed-out');
  hide('#sign-in-button');

  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = wallet.accountId;
  });

  document.querySelector('#welcomeMessage').innerText = `Welcome, ${wallet.accountId}`;
}

function hide(id) {
  document.querySelectorAll(id).forEach(el => el.style.display = 'none');
}