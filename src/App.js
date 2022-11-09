import { useEffect, useState } from 'react';
import './App.css';
import abi from './contracts/ABI.json';
import { ethers } from 'ethers';

const contractAddressA = "0x9ebDb7acdCbCD6D5A15084246Ab3ab8231751d29";
const contractAddressB = "";
const contractAddressC = "";

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

  const mintNftHandler = async (contractAddress) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.safeMint();

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
      alert(err);
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
    return (
      <div >
        <h2>Contrat ouvert à tous</h2>
        <p>
          Ce contrat permet d'obtenir une NFT pokémon. <br/>
          Il est utilisable 3 fois. Une fois cette limite atteinte, il n'est plus possible d'obtenir de NFT gratuite avec ce contrat. <br/>
          Pour obtenir d'autre NFT pokémon, vous pouvez utiliser le contrat payant.
        </p>
        <button onClick={f => mintNftHandler(contractAddressA)} className='cta-button mint-nft-buttonA'>
          Mint NFT 
        </button>
        <br/><br/>
        <h2>Contrat payant</h2>
        <p>Ce contrat permet d'obtenir une NFT pokémon pour la somme de 0.5 GoETH, sauf pour le owner pour qui c'est gratuit !</p>
        <button onClick={f => mintNftHandler(contractAddressB)} className='cta-button mint-nft-buttonB'>
          Mint NFT
        </button>
        <br/><br/>
        <h2>Contrat disponible uniquement pour son propriétaire</h2>
        <p>Ce contrat permet d'obtenir une NFT pokémon !</p>
        <button onClick={f => mintNftHandler(contractAddressC)} className='cta-button mint-nft-buttonB'>
          Mint NFT
        </button>
      </div>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

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
    </div>
  )
}

export default App;
