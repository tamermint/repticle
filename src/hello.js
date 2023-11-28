import { Wallet } from './near-wallet';
const ethers = require('ethers');


//setting the contract ABI for retrieving wallet balance of a user
const walletBalanceProviderAddress = '0xC7be5307ba715ce89b152f3Df0658295b3dbA8E2';

//Getting wallet balance provider ABI
const walletBalanceProviderABI = [
           {
            "inputs":
              [
                {
                  "internalType":"address",
                  "name":"user",
                  "type":"address"
                },
                {
                  "internalType":"address",
                  "name":"token",
                  "type":"address"
                }
              ],
              "name":"balanceOf",
              "outputs":[
                {
                  "internalType":"uint256",
                  "name":"",
                  "type":"uint256"
                }
              ],
              "stateMutability":"view",
              "type":"function"
            },
            {
              "inputs":[
                {
                  "internalType":"address[]",
                  "name":"users",
                  "type":"address[]"
                },
                {
                  "internalType":"address[]",
                  "name":"tokens",
                  "type":"address[]"
                }
              ],
              "name":"batchBalanceOf",
              "outputs":[
                {
                  "internalType":"uint256[]",
                  "name":"",
                  "type":"uint256[]"
                }
              ],
              "stateMutability":"view",
              "type":"function"
            },
            {
              "inputs":[
                {
                  "internalType":"address",
                  "name":"provider",
                  "type":"address"
                },
                {
                  "internalType":"address",
                  "name":"user",
                  "type":"address"
                }
              ],
              "name":"getUserWalletBalances",
              "outputs":[
                {
                  "internalType":"address[]",
                  "name":"",
                  "type":"address[]"
                },
                {
                  "internalType":"uint256[]",
                  "name":"",
                  "type":"uint256[]"
                }
              ],
              "stateMutability":"view",
              "type":"function"
            },
            {
              "stateMutability":"payable",
              "type":"receive"
            }
        ];

//setting provider URL to that of infura (mainnet) - a node
const providerURL = 'https://mainnet.infura.io/v3/db4bbb5f4c224b55a40392836def6c9f';

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
async function queryAAVE() {
  //example address to use - 0xc736e108e326379b331f825f762af4dde41c62ef - mainnet
  const walletid = "0xc736e108e326379b331f825f762af4dde41c62ef";
  if(!walletid) {
    window.alert("Please login with your wallet!")
  }
  else{
    try{
      // Create a new provider
      const provider = new ethers.JsonRpcProvider(providerURL);

      // Create a new contract instance
      const walletBalanceProviderContract = new ethers.Contract(walletBalanceProviderAddress, walletBalanceProviderABI, provider);

       //error why - maybe because in the contract, the provider address is pool address and not wallet balance provider address
       const iPoolProviderAddress = '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e';
      // Get balance
      const [tokenAddresses, balances] = await walletBalanceProviderContract.getUserWalletBalances(iPoolProviderAddress, walletid);

      //display balance
      const displayDiv = document.querySelector('#displayDiv');
      // displayDiv.innerHTML = '';
      tokenAddresses.forEach((address, index) => {
        const balanceInEther = ethers.formatEther(balances[index]);
        const displayDivChild = document.createElement('div');
        displayDivChild.classList.add('resdisplay');
        if(balanceInEther != 0.0){
          displayDivChild.innerHTML = `Token: ${address}, Balance: ${balanceInEther}`;
          displayDiv.appendChild(displayDivChild);
        }
      });
    }
    catch(error){
      console.error("Error querying AAVE:", error);
      window.alert("Error occurred while querying AAVE: " + error.message);
    }
  }
}

async function querySOL() {
  const walletid = '2rQoDW3xyHBNzwqWeCKAAomu8nxafF3c9CYJUyLkoTzd'; // Use the wallet ID as needed
  const rpcURL = 'https://api.testnet.solana.com'; // API URL for the Solana testnet

  if (!walletid) {
    window.alert("Please login with your wallet!");
    return;
  }

  const requestBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'getAccountInfo',
    params: [
      walletid,
      {
        encoding: 'base58'
      }
    ]
  };

  try {
    const response = await fetch(rpcURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) throw new Error('Network response was not ok.');

    if (data.error) throw new Error(data.error.message);

    const accountInfo = data.result; // The account information you retrieved

   /*  // Display the result
    const displayDiv = document.querySelector('#displayDiv');
    // displayDiv.innerHTML = ''; // Clear previous results
    const displayDivChild = document.createElement('div');
    displayDivChild.classList.add('resdisplay');
    displayDivChild.textContent = JSON.stringify(accountInfo, null, 2); // Displaying the JSON string for simplicity
    displayDiv.appendChild(displayDivChild); */

    return accountInfo;

  } catch (error) {
    console.error("Error querying SOL:", error);
    window.alert("Error occurred while querying SOL: " + error.message);
  }
}

async function querySOLTable() {
  const jsonData = await querySOL();

  // Start with an empty string for our HTML
  let tableHTML = '<table class="table">';

  // Add a table header
  tableHTML += `
    <tr>
      <th>Key</th>
      <th>Value</th>
    </tr>`;

  // Iterate over each key in the JSON object
  for (const key in jsonData) {
    // Check if the value is an object and if so, stringify it
    let value = typeof jsonData[key] === 'object' && jsonData[key] !== null
                ? JSON.stringify(jsonData[key], null, 2) // Beautify the JSON string
                : jsonData[key];

    // Append a row to our table
    tableHTML += `
      <tr>
        <td>${key}</td>
        <td><pre>${value}</pre></td>
      </tr>`;
  }

  // Close the table tag
  tableHTML += '</table>';

  const displayDiv = document.querySelector('#displayDiv');
  const tableDiv = document.createElement('div');
  // tableDiv.classList.add('resdisplay');
  tableDiv.innerHTML = tableHTML;

  displayDiv.appendChild(tableDiv);

}


document.querySelector('#query-aave-button').onclick = () => queryAAVE();
document.querySelector('#query-sol-button').onclick = () => querySOLTable();


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