# DM NFT ECE
Fait par Magdeleine GAUVAIN et Margaux MENGONI

## Introduction et détails du projet
Ce site permet de minté des NFT pokémon. L'idée nous est venu de nos souvenir de cours de récrée. En effet, les **NFT** permettent de de retrouver dans le monde dématérialiser le plaisir de la collection d'objet unique et rare. La première etape étant de créer ces NFT, nous avons décidé de faire une plateforme à cet effet.

# Guide d'utilisation
## Lancer l'app
- Cloner le repo
- run `npm install`
- run `npm run start`

## Passer sur un contrat dont vous êtes le Owner
- Importer le fichier contract.sol dans **Remix**
- Publier ensuite le smart contract à partit de ce dernier
- Changer l'addresse du contrat dans `src/App.js` ligne 7
- Relancer l'app

## Fonctionnemnt de L'app
L'application guide son utilisateur. Chaque action est expliquer par un texte. 
### 1) Commancez par connect votre walet
Rien de plus simple, il suffit de cliquer sur le bouton et accépter la connection dans **Metamask**.

### 2) Minter des NFT
Pour ce faire, il faut cliquer sur l'un des 2 premiers boutons (Minter NFT). 
Attention, il n'est pas possible de minter plus de 300 nft dans cette collection.

Leurs particularités sont détailées dans leur description.

### 3) Afficher les derniers NFT minté
Pour cela, Cliquer sur le dernier bouton. L'API **OpenSea** est appelée pour obtenir toutes les informations nécessaires. 
