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
          <input placeholder="enter wallet id" id="greeting"/>
            <button class="btn btn-primary">
              <span>submit</span>
              <div class="loader"></div>
            </button>
        </div>
      </div>
      <div className='col-6'>
              
      </div>
    </div>
  );
});

// Button clicks
document.querySelector('#sign-in-button').onclick = () => { wallet.signIn(); };
document.querySelector('#sign-out-button').onclick = () => { wallet.signOut(); };

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