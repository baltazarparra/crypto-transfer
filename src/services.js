import { ethers } from 'ethers'

const getMetaMaskProvider = async () => {
    if (!window.ethereum) throw new Error('No MetaMask found! please login')

    await window.ethereum.send('eth_requestAccounts')

    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    provider.on('network', (newNetwork, oldNetwork) => {
        if (oldNetwork) window.location.reload()
    })

    return provider
}

export const getBalance = async (address) => {
    const provider = await getMetaMaskProvider()
    const balance = await provider.getBalance(address)

    return ethers.utils.formatEther(balance.toString())
}

export const transfer = async (address, quantity) => {
    const provider = await getMetaMaskProvider()
    const signer = provider.getSigner()

    ethers.utils.getAddress(address)

    const transaction = await signer.sendTransaction({
        to: address, value: ethers.utils.parseEther(quantity)
    })

    return transaction
}