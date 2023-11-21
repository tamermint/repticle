import { createRoot } from 'react-dom/client';
import { Wallet } from './near-wallet';
import { useInitNear, Widget } from 'near-social-vm';
import { useEffect } from 'react';
const { ethers } = require("ethers");

const wallet = new Wallet({network: 'testnet'});

export default function Component({ src }) {

  const { initNear } = useInitNear();

  useEffect(() => {
    initNear && initNear({ networkId: wallet.network, selector: wallet.selector });
  }, [initNear]);

  return (
    <div>
      <Widget src={src} />
      <p className="mt-4 small"> <span class="text-secondary">Source:</span> <a href={`https://near.social/mob.near/widget/WidgetSource?src=${src}`}> {src} </a> </p>
    </div>
  );
}

// Setup on page load
document.addEventListener('DOMContentLoaded', async () => {
  let isSignedIn = await wallet.startUp();
  isSignedIn ? signedInUI() : signedOutUI();


  const domNode = document.getElementById('components');
  const root = createRoot(domNode);
  root.render(
    <div className='row-10'>
      <div className='col-18 mt-3'>
        <div className="input-group">
          <input placeholder="enter wallet id (copy paste for now)" id="greeting"/>
            <button id="wallet-btn"class="btn btn-primary">
              <span>submit</span>
              <div class="loader"></div>
            </button>
          <button class="btn btn-primary" id="display-wallet-summary" onclick="generateSummary()">Generate Summary</button>
          <div id="summary-display"></div>
        </div>
      </div>
      <div className='col-6'>
              
      </div>
    </div>
  );
});

async function queryEthAddress(walletid) {            //queries the eth address using etherscan API
  const etherScanAPIKey = "2KCHPQPJJJSKTQ281UI17F9Z8QIZ7ZDEZU";
  const walletAddress = walletid;

  try {
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${etherScanAPIKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.result;
  }
  catch(error) {
    window.alert("Couldn't retreive data:" + error.message);
  }
  
}

function simulateAiResponse(activities){      //simulating an AI response to activities, just a PoC
  let summary = "Activity Summary: \n"

  activities.forEach(activity => {            //checking which type of activity
    if(activity.functionName.includes('deposit')){
      summary += `For transaction ${activity.hash}, it is a ${activity.functionName} method used and the deposit value is ${activity.value}`;
    }
    else if(activity.functionName.includes('mint')) {
      summary += `For transaction ${activity.hash}, it is a ${activity.functionName} method used and the mint cost is ${activity.value}`;
    }
    else {
      summary += `For transaction ${activity.hash}, it is a ${activity.functionName} method used and the swap value is ${activity.value}`;
    }
  })

  return summary;
}

async function displaySummary(walletAddress) {       //change the inner text of the div to contain the summary
  const activities = await queryEthAddress(walletAddress);
  const summary = simulateAiResponse(activities);

  document.getElementById('summary-display').innerHTML = summary;
}

function generateSummary(){            //generates the summary using the onclick function
  const walletAddress = document.getElementById('greeting').value;

  displaySummary(walletAddress);

}


async function categorizeOnChainActivites(activities) {
  const walletAddress = wallet.accountId;
  activities = await queryEthAddress(walletAddress);

  let activityScore = 0;

  const activityGrade = {
    deposit: 5,
    mint: 7,
    swap: 3
  };

  activities.forEach(activity => {
    if(!activity) {
      window.alert("Couldn't get any activity from server");
    }
    if(activity.functionName && activity.functionName.includes('deposit')) {
      activityScore += activityGrade.deposit;
    }
    else if(activity.functionName && activity.functionName.includes('swap')) {
      activityScore += activityGrade.swap;
    }
    else if(activity.functionName && activity.functionName.includes('mint')) {
      activityScore += activityGrade.mint;
    }
  })

  return activityScore;
}

async function calculateRepScore(activityScore) {
  activityScore = await categorizeOnChainActivites(activities);
  return Math.pow(activityScore, 2);
}

function mintRepScore(score) {
  score = calculateRepScore(score);
  if(!score) {
    window.alert("Sorry unable to fetch score");
  }
  else {
    window.alert(`NFT for ${score}`);
  }
}

// Button clicks
document.querySelector('#sign-in-button').onclick = () => { wallet.signIn(); };
document.querySelector('#sign-out-button').onclick = () => { wallet.signOut(); };
document.querySelector('#wallet-btn').onclick = () => { mintRepScore(); }
document.querySelector('#display-wallet-summary').onclick = () => { generateSummary(); }

// UI: Display the signed-out container
function signedOutUI() {
  document.querySelectorAll('#sign-out-button').forEach(el => el.style.display = 'none');
}

// UI: Displaying the signed in flow container and fill in account-specific data
function signedInUI() {
  document.querySelectorAll('#sign-in-button').forEach(el => el.style.display = 'none');
  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = wallet.accountId;
  });
}