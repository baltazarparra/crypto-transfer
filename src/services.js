import { ethers } from 'ethers'

const { ethereum } = window;

export const getMetaMaskProvider = async () => {
    if (!ethereum) throw new Error('No MetaMask found! please login')

    const provider = new ethers.providers.Web3Provider(ethereum, 'any')

    provider.on('network', (_, oldNetwork) => {
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