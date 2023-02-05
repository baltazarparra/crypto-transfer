import { useState } from 'react'
import { getMetaMaskProvider, getBalance, transfer } from './services'
import { isMobile } from 'react-device-detect'

function App() {
  const { ethereum } = window

  const [shortAddress, setShortAddress] = useState('')
  const [balance, setBalance] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [quantity, setQuantity] = useState('')
  const [message, setMessage] = useState('')
  const [isLogged, setIsLogged] = useState(false)
  const [metaMasknotFound, setMetaMaskNotFound] = useState(false)

  window.onload = () => {
    isConnected()
  }
        
  async function isConnected() {
    if (!ethereum) return setMetaMaskNotFound(true)
    await getMetaMaskProvider()

    const accounts = await ethereum.request({method: 'eth_accounts'})

    if (accounts.length) {
      setIsLogged(true)
      setShortAddress(ethereum.selectedAddress.substring(0,6) + "..." + ethereum.selectedAddress.slice(-4))
    } else {
      setIsLogged(false)
    }
  }

  const checkBalance = async () => {
    const balance = await getBalance(ethereum.selectedAddress)
    setBalance(balance)
    setMessage('')
  }

  const sendTransfer = async () => {
    const result = await transfer(toAddress, quantity)
    setMessage(JSON.stringify(result))
    setTimeout(() => {
      setMessage('')
      setToAddress('')
      setQuantity('')
    }, 3000)
  }

  const login = async () => {
    await ethereum.request({ method: 'eth_requestAccounts' })
    setIsLogged(true)
    setShortAddress(ethereum.selectedAddress.substring(0,6) + "..." + ethereum.selectedAddress.slice(-4))
  }

  const isETH = ethereum.networkVersion === '1'
  const isBNB = ethereum.networkVersion === '56'
  const isGoerli = ethereum.networkVersion === '5'
  const isTBNB = ethereum.networkVersion === '97'
  const isTestnet = isGoerli || isTBNB

  return (
    <>
      <main>
        {isTestnet && <span className="testnet">testnet</span>}
        <span className="logo">Crypto <b>Transfer</b></span>
        {isLogged && !isMobile ? (
          <section>
            <div>
              <p className="label">address: <span>{shortAddress}</span></p>
            </div>
            <div>
              <button className="input" onClick={() => checkBalance()}>Check Balance</button>
            </div>
            <input readOnly className="input" type="text" value={balance ? balance : '0.00000'} />
            <span className="tokens">
              {isETH && <img className="token" alt="token" src="https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg" />}
              {isBNB && <img className="token" alt="token" src="https://token.metaswap.codefi.network/assets/networkLogos/bsc.svg" />}
            </span>
            <span className="divider"></span>
            <div>
              <p className="label">Transfer to:</p>
              <input className="input" type="text" onChange={(e) => setToAddress(e.target.value)} value={toAddress} />
            </div>
            <div>
              <p className="label">Quantity:</p>
              <input className="input" type="text" onChange={(e) => setQuantity(e.target.value)} value={quantity} />
            </div>
            <div>
              <button className="transfer" onClick={() => sendTransfer()}>Transfer</button>
            </div>
            <small className="disclaimer">Only support ETH & BNB tokens, for now</small>
            {message && <p className="success">Success ✓</p>}
          </section>
        ) : (
          <>
            {metaMasknotFound ? (<a href="https://metamask.io/" target="_blank" rel="noreferrer">Install MetaMask to continue...</a>) : (
              <>
                {isMobile ? (<p>Unsupported device, yet</p>) : (
                  <div className="login">
                    <p>Login</p>
                    <button onClick={() => login()}>
                      <svg width="86" height="16" viewBox="0 0 86 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M73.8323 4.17627C74.3455 4.17627 74.8259 4.34465 75.2483 4.66196C75.6896 4.99223 75.9299 5.51033 75.982 6.13215C75.9844 6.14051 75.9836 6.14948 75.9796 6.15725C75.9757 6.16502 75.969 6.17102 75.9609 6.17404L75.9429 6.17736H74.9429C74.9283 6.17736 74.9137 6.17005 74.9072 6.15825L74.9039 6.14495C74.7869 5.24488 73.6898 4.99871 73.0276 5.43919C72.5664 5.75002 72.4754 6.46243 72.9172 6.82495C73.0901 6.96756 73.2892 7.08125 73.4914 7.19112L74.0261 7.482L74.4956 7.72285C74.7302 7.84336 74.9624 7.96802 75.1833 8.1138C75.9429 8.61893 76.1959 9.3832 76.0593 10.2314C75.904 11.0994 75.1377 11.9348 73.6574 11.9348C73.0923 11.9348 72.5469 11.7794 72.0471 11.4037C71.5147 11.0086 71.3199 10.5748 71.3199 9.7911C71.3199 9.77664 71.3309 9.76201 71.3445 9.75569L71.3588 9.75237H72.4429C72.4623 9.75237 72.4819 9.77165 72.4819 9.7911C72.4819 9.8624 72.4949 10.0243 72.5208 10.1086C72.6704 10.5748 73.0986 10.8727 73.6509 10.9051C74.1572 10.9375 74.6635 10.6591 74.8583 10.2573C75.0728 9.81703 74.9168 9.26003 74.4235 8.95585L74.3602 8.91729L74.126 8.78332L73.8434 8.62874L72.4794 7.90968L72.3967 7.86347L72.3714 7.84835C70.9496 6.96739 71.1899 4.17627 73.8324 4.17627H73.8323ZM80.3126 4.3252C80.3272 4.3252 80.3418 4.33617 80.3483 4.3498L80.3516 4.3641V7.27839C80.3516 7.30432 80.3766 7.32194 80.3999 7.31462L80.4165 7.30432L83.2799 4.33817C83.284 4.33347 83.2891 4.32973 83.2949 4.3272L83.306 4.3252H84.6889C84.7149 4.3252 84.7325 4.35013 84.7253 4.3734L84.7149 4.39003L81.3383 7.88724C81.334 7.89196 81.331 7.89766 81.3295 7.90384C81.3279 7.91001 81.3279 7.91648 81.3295 7.92265L81.3383 7.93894L85.0912 11.8052C85.112 11.8208 85.1036 11.853 85.0862 11.8685L85.0717 11.8766H83.6888L83.6758 11.8725L83.6629 11.8635L80.4166 8.52186C80.401 8.50108 80.3688 8.50939 80.3565 8.53017L80.3515 8.54779V11.8377C80.3515 11.8522 80.3407 11.8668 80.3271 11.8731L80.3126 11.8765H79.228C79.2136 11.8765 79.1989 11.8657 79.1924 11.852L79.1891 11.8377V4.3641C79.1891 4.34947 79.2001 4.33501 79.2137 4.32852L79.228 4.3252H80.3126ZM25.1616 4.31872C25.1746 4.31872 25.1849 4.32171 25.192 4.32936L25.2007 4.34465L26.0901 7.2719C26.0921 7.2785 26.0956 7.28449 26.1005 7.28932C26.1054 7.29414 26.1114 7.29765 26.118 7.29952C26.1247 7.30138 26.1316 7.30153 26.1383 7.29995C26.145 7.29838 26.1512 7.29513 26.1563 7.29052L26.1681 7.2719L27.0577 4.34481C27.0622 4.3352 27.0698 4.32737 27.0793 4.32254L27.0966 4.31872H28.7393C28.7539 4.31872 28.7685 4.32969 28.7749 4.34332L28.7782 4.35761V11.8314C28.7782 11.8459 28.7672 11.8605 28.7536 11.8668L28.7393 11.8701H27.6549C27.6404 11.8701 27.6258 11.8593 27.6193 11.8457L27.616 11.8314V6.15176C27.616 6.11387 27.5709 6.09858 27.5483 6.12085L27.538 6.1388L26.6421 9.0855L26.5771 9.29261C26.5726 9.30215 26.565 9.30992 26.5555 9.31472L26.5382 9.31854H25.7072C25.694 9.31854 25.6839 9.31571 25.6767 9.30807L25.6681 9.29261L25.6033 9.0855L24.7074 6.1388C24.6964 6.10639 24.6495 6.10556 24.6342 6.13232L24.6292 6.15176V11.8314C24.6292 11.8459 24.6183 11.8605 24.6046 11.8668L24.5903 11.8701H23.5059C23.4913 11.8701 23.4767 11.8593 23.4704 11.8457L23.467 11.8314V4.35761C23.467 4.34299 23.478 4.32852 23.4916 4.32204L23.5059 4.31872H25.1616ZM56.6459 4.31872C56.6588 4.31872 56.669 4.32171 56.6761 4.32936L56.6848 4.34465L57.5745 7.2719C57.5765 7.27846 57.5801 7.28443 57.5849 7.28923C57.5898 7.29404 57.5958 7.29753 57.6024 7.29939C57.609 7.30125 57.6159 7.30141 57.6226 7.29986C57.6293 7.29831 57.6354 7.2951 57.6405 7.29052L57.6525 7.2719L58.5416 4.34481C58.5461 4.3352 58.5537 4.32737 58.5632 4.32254L58.5805 4.31872H60.2299C60.2445 4.31872 60.2591 4.32969 60.2654 4.34332L60.2688 4.35761V11.8314C60.2688 11.8459 60.258 11.8605 60.2442 11.8668L60.2299 11.8701H59.1458C59.1312 11.8701 59.1165 11.8593 59.1102 11.8457L59.1069 11.8314V6.15176C59.1069 6.11387 59.0617 6.09858 59.0391 6.12085L59.0289 6.1388L58.1327 9.0855L58.0679 9.29261C58.0632 9.30218 58.0556 9.30995 58.0461 9.31472L58.0288 9.31854H57.1977C57.1846 9.31854 57.1744 9.31571 57.1673 9.30807L57.1587 9.29261L57.0937 9.0855L56.1981 6.1388C56.1871 6.10639 56.1402 6.10556 56.125 6.13232L56.12 6.15176V11.8314C56.12 11.8459 56.1092 11.8605 56.0954 11.8668L56.0811 11.8701H54.9965C54.9819 11.8701 54.9673 11.8593 54.9609 11.8457L54.9576 11.8314V4.35761C54.9576 4.34299 54.9684 4.32852 54.9822 4.32204L54.9965 4.31872H56.6459ZM44.5949 4.31872C44.6029 4.31828 44.6108 4.32045 44.6173 4.32489C44.6239 4.32933 44.6289 4.3358 44.6315 4.34332L44.6338 4.35761V5.29009C44.6338 5.30472 44.6229 5.31935 44.6092 5.32566L44.5949 5.32899H42.6146V11.8314C42.6146 11.8459 42.6037 11.8605 42.5899 11.8668L42.5756 11.8701H41.4913C41.4767 11.8701 41.4621 11.8593 41.4558 11.8457L41.4524 11.8314V5.32899H39.4718C39.4572 5.32899 39.4425 5.31802 39.4362 5.30439L39.4329 5.29009V4.35761C39.4329 4.34282 39.4439 4.32836 39.4575 4.32188L39.4718 4.31855H44.5946L44.5949 4.31872ZM49.9385 4.29279C49.9516 4.29279 49.9618 4.29561 49.9689 4.30326L49.9776 4.31872L52.0162 11.8181C52.0185 11.8272 52.0177 11.8368 52.0139 11.8454C52.0101 11.854 52.0035 11.861 51.9953 11.8655L51.9773 11.87H50.9907C50.9798 11.8688 50.9697 11.8642 50.9617 11.8567L50.9518 11.844L50.3609 9.66161C50.3563 9.65206 50.3487 9.64429 50.3393 9.63951L50.322 9.63568H48.14C48.1269 9.63568 48.1168 9.63851 48.1096 9.64616L48.101 9.66161L47.5102 11.844C47.5057 11.8536 47.4981 11.8614 47.4886 11.8662L47.4712 11.87H46.4843C46.475 11.8698 46.466 11.8665 46.4589 11.8605C46.4517 11.8546 46.4468 11.8464 46.4449 11.8372L46.4453 11.8181L48.4841 4.31872C48.4887 4.30917 48.4963 4.3014 48.5057 4.29661L48.523 4.29279H49.9383H49.9385ZM66.7682 4.29279C66.7812 4.29279 66.7913 4.29561 66.7984 4.30326L66.8073 4.31872L68.8457 11.8181C68.848 11.8272 68.8471 11.8368 68.8433 11.8454C68.8395 11.854 68.8329 11.8611 68.8246 11.8655L68.8067 11.87H67.8202C67.8145 11.87 67.8088 11.8688 67.8036 11.8666C67.7983 11.8643 67.7936 11.8609 67.7898 11.8567L67.7811 11.844L67.1904 9.66161C67.1858 9.65206 67.1782 9.64429 67.1688 9.63951L67.1513 9.63568H64.9697C64.9568 9.63568 64.9466 9.63851 64.9395 9.64616L64.9308 9.66161L64.3401 11.844C64.3355 11.8536 64.3279 11.8614 64.3185 11.8662L64.301 11.87H63.314C63.3047 11.8698 63.2957 11.8665 63.2886 11.8605C63.2814 11.8546 63.2765 11.8464 63.2746 11.8372L63.275 11.8181L65.3136 4.31872C65.3182 4.30917 65.3258 4.3014 65.3352 4.29661L65.3527 4.29279H66.768H66.7682ZM36.505 4.3252C36.5194 4.3252 36.5341 4.33617 36.5404 4.3498L36.5437 4.3641V5.29658C36.5437 5.3112 36.5329 5.32583 36.5191 5.33215L36.5048 5.33547H33.2194C33.2047 5.33547 33.1901 5.34644 33.1838 5.36007L33.1805 5.37437V7.35618C33.1805 7.37064 33.1914 7.38526 33.2051 7.39158L33.2194 7.39491H36.1087C36.1233 7.39491 36.138 7.40588 36.1444 7.41951L36.1478 7.4338V8.36628C36.1478 8.38091 36.1368 8.39553 36.123 8.40185L36.1087 8.40518H33.2194C33.2047 8.40518 33.1901 8.41615 33.1838 8.42978L33.1805 8.44407V10.7626C33.1805 10.7799 33.1863 10.7914 33.1959 10.7992L33.2129 10.808H36.6411C36.6557 10.808 36.6704 10.8188 36.6768 10.8326L36.6802 10.8467V11.8313C36.6802 11.8457 36.6692 11.8603 36.6556 11.8667L36.6411 11.87H32.0572C32.0425 11.87 32.0279 11.8592 32.0216 11.8454L32.0183 11.8313V4.3641C32.0183 4.34947 32.0292 4.33501 32.0429 4.32852L32.0572 4.3252H36.5048H36.505ZM49.27 5.6463C49.268 5.63971 49.2645 5.63372 49.2596 5.62889C49.2547 5.62406 49.2487 5.62055 49.2421 5.61869C49.2354 5.61683 49.2285 5.61667 49.2218 5.61825C49.2151 5.61982 49.2089 5.62307 49.2038 5.62768L49.192 5.6463L48.3998 8.56707C48.3948 8.58652 48.4048 8.60597 48.4208 8.61444L48.4387 8.61893H50.0231C50.0324 8.61874 50.0413 8.61539 50.0485 8.60944C50.0556 8.60349 50.0605 8.59529 50.0623 8.58619L50.062 8.56707L49.27 5.6463ZM66.0995 5.6463C66.0976 5.63971 66.094 5.63372 66.0891 5.62889C66.0842 5.62406 66.0782 5.62055 66.0716 5.61869C66.065 5.61683 66.058 5.61667 66.0513 5.61825C66.0446 5.61982 66.0384 5.62307 66.0333 5.62768L66.0215 5.6463L65.2294 8.56707C65.2244 8.58652 65.2343 8.60597 65.2503 8.61444L65.2682 8.61893H66.8526C66.8619 8.61878 66.8709 8.61545 66.8781 8.60949C66.8853 8.60354 66.8902 8.59531 66.892 8.58619L66.8917 8.56707L66.0995 5.6463Z" fill="#161616"/>
                        <path d="M16.5818 0L9.29785 5.3896L10.6524 2.21335L16.5818 0Z" fill="#E17726"/>
                        <path d="M0.410587 0.00634766L6.32411 2.21372L7.6103 5.43169L0.410587 0.00634766ZM13.6506 11.4622L16.8699 11.5236L15.7448 15.3457L11.8164 14.2642L13.6506 11.4622ZM3.32471 11.4622L5.15211 14.2642L1.23021 15.3459L0.112061 11.5236L3.32471 11.4622Z" fill="#E27625"/>
                        <path d="M7.43551 4.61199L7.56715 8.86134L3.63013 8.68216L4.74993 6.99272L4.76423 6.97644L7.43551 4.61199ZM9.49927 4.56445L12.2113 6.9766L12.2254 6.99289L13.3452 8.68216L9.40918 8.86134L9.49927 4.56445ZM5.26737 11.4744L7.41706 13.1494L4.91997 14.355L5.26737 11.4744ZM11.7085 11.4743L12.0487 14.355L9.55861 13.1493L11.7085 11.4743Z" fill="#E27625"/>
                        <path d="M9.61353 12.9916L12.1404 14.2151L9.78988 15.3323L9.81432 14.5939L9.61353 12.9916ZM7.36111 12.9921L7.1683 14.5818L7.18409 15.3314L4.82812 14.2151L7.36111 12.9921Z" fill="#D5BFB2"/>
                        <path d="M6.63141 9.41589L7.29179 10.8036L5.0437 10.1451L6.63141 9.41589ZM10.3437 9.41606L11.9391 10.1451L9.68366 10.8035L10.3437 9.41606Z" fill="#233447"/>
                        <path d="M5.43926 11.4603L5.07591 14.4469L3.12817 11.5257L5.43926 11.4603ZM11.5365 11.4603L13.8477 11.5257L11.8927 14.4471L11.5365 11.4603ZM13.4022 8.51331L11.7201 10.2275L10.4235 9.63494L9.80247 10.9401L9.39557 8.69565L13.4022 8.51331ZM3.57264 8.51331L7.57998 8.69565L7.17291 10.9401L6.55192 9.63511L5.26191 10.2275L3.57264 8.51331Z" fill="#CC6228"/>
                        <path d="M3.45923 8.16157L5.36209 10.0925L5.42807 11.9989L3.45923 8.16157ZM13.5182 8.15808L11.5459 12.0022L11.62 10.0925L13.5182 8.15808ZM7.48684 8.27909L7.56347 8.76128L7.75279 9.96221L7.63112 13.6506L7.05584 10.6876L7.05568 10.657L7.48684 8.27909ZM9.4876 8.27244L9.91994 10.657L9.91977 10.6876L9.34316 13.6581L9.32022 12.9151L9.2303 9.94027L9.4876 8.27244Z" fill="#E27525"/>
                        <path d="M11.7891 10.0157L11.7248 11.6721L9.71722 13.2362L9.31149 12.9495L9.76626 10.6063L11.7891 10.0157ZM5.19312 10.0159L7.209 10.6065L7.66377 12.9495L7.25803 13.2362L5.25046 11.6719L5.19312 10.0159Z" fill="#F5841F"/>
                        <path d="M4.44409 13.8494L7.01232 15.0662L7.00151 14.5465L7.21643 14.358H9.7584L9.98096 14.546L9.96451 15.0652L12.5166 13.8524L11.2748 14.8786L9.77319 15.91H7.19582L5.69521 14.8743L4.44409 13.8494Z" fill="#C0AC9D"/>
                        <path d="M9.42943 12.8297L9.79262 13.0862L10.0054 14.7839L9.69738 14.524H7.27875L6.97656 14.7893L7.18251 13.0864L7.54569 12.8297H9.42943Z" fill="#161616"/>
                        <path d="M16.101 0.149292L16.9753 2.7722L16.4293 5.42437L16.8181 5.72439L16.292 6.12581L16.6874 6.43115L16.1638 6.90803L16.4853 7.1409L15.6321 8.13721L12.1329 7.11846L12.1026 7.10217L9.58111 4.97508L16.101 0.149292ZM0.874304 0.149292L7.39435 4.97508L4.87267 7.10217L4.84241 7.11846L1.3432 8.13721L0.490175 7.1409L0.811308 6.90819L0.287889 6.43115L0.682655 6.12614L0.148598 5.72356L0.552174 5.42337L0 2.77237L0.874304 0.149292Z" fill="#763E1A"/>
                        <path d="M11.9618 6.89552L15.6694 7.97511L16.874 11.6874H13.6963L11.5065 11.715L13.0989 8.61122L11.9618 6.89552ZM5.01373 6.89552L3.8763 8.61122L5.469 11.715L3.28042 11.6874H0.108154L1.30608 7.97511L5.01373 6.89552ZM10.8342 2.19556L9.79697 4.99649L9.5769 8.7801L9.49279 9.96606L9.48614 12.9957H7.48937L7.48289 9.97171L7.39845 8.7791L7.17822 4.99649L6.14135 2.19556H10.8342Z" fill="#F5841F"/>
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
      <footer>
        <a href="https://baltazarparra.github.io" target="_blank" rel="noreferrer">baltazarparra</a> | <span>version 0.14.3 alpha</span>
      </footer>
    </>
  )
}

export default App
