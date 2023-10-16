import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { abi, contractAddress } from "./constants.js";
window.connectWallet = connectWallet;
window.fund = fund;

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    const wallet = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const phoneDisplayHeader = document.getElementById('mtHeader');
    console.log("Connected with address - ", wallet);
    const shortenAddress = wallet.toString().slice(0, 6) + "..." + wallet.toString().slice(35, 42);
    window.walletConnected = wallet;
    phoneDisplayHeader.innerHTML = shortenAddress;
  } else {
    console.log("i dont see metamask :(");
    connectButton.innerHTML = "Install Metamask first";
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.formatEther(balance));
  }
}

async function fund(ethAmount) {
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

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    console.log(`Withdrawing...`);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
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
