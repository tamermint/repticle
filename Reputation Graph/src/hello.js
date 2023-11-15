import { Wallet } from './near-wallet';

const HELLO_NEAR = 'hello.near-examples.testnet';

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
document.querySelector('#sign-in-button').onclick = () => { 
  console.log('Sign in button clicked');
  wallet.signIn(); };
document.querySelector('#sign-out-button').onclick = () => { wallet.signOut(); };


// UI: Hide signed-in elements
function signedOutUI() { hide('#signed-in'); hide('#sign-out-button'); }

//Query AAVE
async function queryAAVE(walletid) {
  if(!walletid) {
    window.alert("Please login with your wallet!")
  }
  else{

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