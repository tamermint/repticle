//Utilizing JS here to outline logic and then can use transpiler to make it a near contract which sits behind the Dapp
//function to get the ID and store it in a temp. database/store
//For PoC, network IDs can be hardcoded here. Need to aim testnets first with test wallets
//Function to query the wallet ID in MKR and return JSON object denoting past 1 month tx and present 'state'
//function to query wallet ID in Solana and return JSON object denoting past 1 month activity and present 'state'
//function for reputation logic - quadratic reputation score - square root of sum of all squares of activity and tx
  //if score low, assign a low rep score and generate token credential
  //if high score, assign a high rep and generate token credential
//function to retreive token credential and mint a document (graph of value with score)
//The token can be used by other services to check for reputation of the user
//Basically, we are querying the blockchain and checking for wallet interactions