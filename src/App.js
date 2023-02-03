import { useState } from 'react'
import { getBalance, transfer } from './MetaMaskService'

function App() {
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [quantity, setQuantity] = useState('')
  const [message, setMessage] = useState('')

  const checkBalance = async () => {
    const balance = await getBalance(address)
    setBalance(balance)
    setMessage('')
  }

  const sendTransfer = async () => {
    const result = await transfer(toAddress, quantity)
    setMessage(JSON.stringify(result))
  }

  return (
    <>
      <div>
        <p>My address:</p>
        <input type="text" onChange={(e) => setAddress(e.target.value)} value={address} />
      </div>
      <div>
        <button onClick={() => checkBalance()}>Check Balance</button>
        <p>Balance: {balance}</p>
      </div>
      <div>
        <p>To Address:</p>
        <input type="text" onChange={(e) => setToAddress(e.target.value)} />
      </div>
      <div>
        <p>Quantity:</p>
        <input type="text" onChange={(e) => setQuantity(e.target.value)} />
      </div>
      <hr />
      <div>
        <button onClick={() => sendTransfer()}>Transfer</button>
      </div>
      <hr />
      <p>{message}</p>
    </>
  );
}

export default App
