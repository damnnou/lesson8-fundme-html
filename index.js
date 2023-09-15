import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
connectButton.onclick = connectWallet;
fundButton.onclick = fund;

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

async function fund() {
  const ethAmount = "0.1";
  console.log(`Funding with ${ethAmount}...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      });
    } catch (error) {
      console.log(error);
    }
  }
}
