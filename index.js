import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const getBalanceButton = document.getElementById("getBalanceButton");
connectButton.onclick = connectWallet;
fundButton.onclick = fund;
getBalanceButton.onclick = getBalance;

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    const wallet = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log("Connected with address - ", wallet);
    connectButton.innerHTML = "Connected";
  } else {
    console.log("i dont see metamask :(");
    connectButton.innerHTML = "Install Metamask first";
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const balance = await provider.getBalance(signer);
    console.log(balance);
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  }
}

async function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  const tx = await (
    await provider.waitForTransaction(transactionResponse.hash)
  ).confirmations();
  console.log(`Completed with ${tx} confirmations`);
}
