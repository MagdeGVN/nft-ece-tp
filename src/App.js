import { useEffect, useState } from 'react';
import './App.css';
import abi from './contracts/ABI.json';
import { ethers } from 'ethers';

// Changer ici l'adresse du contrat pour mettre le votre 
const contractAddressA = "0x2e167a295c11b23a9166906EadbE9d1Ab1369c06";

let cmp;

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const mintNftHandler = async (contractAddress, owner_required) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await (owner_required ? nftContract.ownerMint() : nftContract.safeMint());

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
      if (err.code === "UNPREDICTABLE_GAS_LIMIT")
        alert("Vous n'etes pas propriétaire de ce contrat");
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }
              
  const allNTFButton = () => {
    let disable = false;
    if(cmp>2)
      disable = true;

    return (
      <div >
        <h2>Contrat ouvert à tous</h2>
        <p>
          Ce contrat permet d'obtenir une NFT pokémon. <br/>
          Il est utilisable 3 fois. Une fois cette limite atteinte, il n'est plus possible d'obtenir de NFT gratuite avec ce contrat. <br/>
          Pour obtenir d'autre NFT pokémon, vous pouvez utiliser le contrat payant.
        </p>
        <button onClick={f => mintNftHandler(contractAddressA, false)} className='cta-button mint-nft-buttonA' disabled = {disable}>
          Mint NFT 
        </button>
        <br/><br/>
        <h2>Contrat disponible uniquement pour son propriétaire</h2>
        <p>Ce contrat permet d'obtenir une NFT pokémon !</p>
        <button onClick={f => mintNftHandler(contractAddressA, true)} className='cta-button mint-nft-buttonB'>
          Mint NFT
        </button>
      </div>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  function ImageNft(props) {
    return <img src = {props.src} alt = ""/>;
  }

  const callAPI = async () => {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const account = await accounts[0];
    const options = {method: 'GET'};
    const url_api = "https://testnets-api.opensea.io/api/v1/assets?"
    let url_img = [];

    try {
      await fetch(url_api + 'owner=' + account 
                  + '&asset_contract_addresses=' + contractAddressA
                  + '&order_direction=desc&offset=0&limit=5&include_orders=false', 
                  options)
          .then (response => response.json())
          .then(function (response) {
            const assets = response;
            cmp = 0;

            for (let i=0;i<assets.length;i++){
              url_img.add(assets[i].image_url);
              cmp++;
              console.log(assets[i].image_url)
            }
          })
          .then(response => console.log(response))
          .catch(err => console.error(err));

    } catch (error) {
      console.log(error);
    }
    
    return(
      <ul>
        {await url_img.map((url) => < ImageNft src = {url} />)}
      </ul>
    )
}
  
  return (
    <div className='main-app'>
      <h1>Devoir maison Blockchain OCRES</h1>
      <h3>Devoir réalisé par Magdeleine GAUVAIN et Margaux MENGONI </h3>
      <p>
        Cette app permet d'exécuter des smarts contract pour obtenir des NFT pokémon. <br/> 
        Une fois connecté avec votre walet, il est possible de minter le contrat de votre choix grâce au différents boutons. <br/> <br/> 
      </p>
      <div>
        {currentAccount ? allNTFButton() : connectWalletButton()}
      </div>
      <h2>NFT de la collection en votre pocession</h2>
      <p>
        Cela permet de voir les derniers NFT mintés dans cette collection
      </p>
      <div>
        <button onClick={f => callAPI()} className='cta-button mint-nft-buttonB'>
          Afficher les NFT
        </button>
      </div>
    </div>
  )
}

export default App;
