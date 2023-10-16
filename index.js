const inputValue = document.getElementById('messageInput');
const messenger = document.getElementById('messenger');
let messageValue;
const delay = (message, time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const messageDiv = document.createElement('div');
      const messageBody = document.createElement('p');
      messageDiv.classList.add('phone-display-body-messages-incoming');
      messageDiv.appendChild(messageBody);
      messageBody.innerHTML = message;
      messenger.appendChild(messageDiv);
      resolve();
    }, time);
  });
};

const welcomeMessages = async () => {
  await delay('Hi!', 500);
  await delay('For begin using Simple Wallet, you should connect your MetaMask!', 1000);
  await delay('Just type "connect" in this chat to continue', 1000);
};

const sendMessage = () => {
  const messageDiv = document.createElement('div');
  const messageBody = document.createElement('p');
  messageValue = inputValue.value;
  if (messageValue) {
    messageDiv.classList.add('phone-display-body-messages-outgoing');
    messageDiv.appendChild(messageBody);
    messageBody.innerHTML = messageValue;
    messenger.appendChild(messageDiv);
  }
  
  if (messageValue.toLowerCase().includes('connect')) {
    window.connectWallet();
  }

  if (messageValue.toLowerCase().includes('fund')) {
    const digits = messageValue.match(/(\d+\.\d+)/);
    if (digits) {
      const value = parseFloat(digits[0]).toString(); // Convert the string to a floating-point number
      window.fund(value);
    } else {
      console.log("No number entered");
    }
  }
}

window.sendMessage = sendMessage;
welcomeMessages();