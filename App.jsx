const [walletId, setWalletId] = useState("");

const submitWalletId = () => {
  // Add logic to handle the wallet ID (e.g., store it, verify it, etc.)
  console.log("Wallet ID entered:", walletId);
  // You can also add more code here to do something with the walletId
};

const UI = styled.div`
  body {
    font-family: 'Arial', sans-serif;
    background-color: #1c1c1e;  /* Space grey background */
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}
  .container {
    text-align: center;
    background-color: #1c1c1e; 
  }
  .greeting {
    color: snow;
    font-size: 2em;
    margin-bottom: 20px;
  }
  input[type="text"] {
    padding: 10px;
    border: none;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #007aff; /* NEAR blue for contrast */
    color: white;
    cursor: pointer;
  }
  button:hover {
    background-color: #0051a3;
  }
`;

return (
  <UI>
    <div className="container">
      <div className="greeting">Welcome to RepGraph!</div>
      <input
        type="text"
        id="walletId"
        placeholder="Enter your wallet ID"
        value={walletId}
        onChange={(e) => setWalletId(e.target.value)}
      />
      <button onClick={submitWalletId}>Submit</button>
    </div>
  </UI>
);
