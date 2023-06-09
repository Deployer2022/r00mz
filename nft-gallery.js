const contractAddress = '0x338FBFB2Dc0D6c5ea7B23B4417fDf4E2c7a6828A';
const etherscanApiKey = 'UCPX8M3KA5T1U3HDXTQ5XN6M6TR81TCNCS';


async function fetchTotalSupply() {
  const response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_call&to=${contractAddress}&data=0x18160ddd&tag=latest&apikey=${etherscanApiKey}`);
  const data = await response.json();
  const totalSupply = parseInt(data.result, 16);
  return totalSupply;
}

async function fetchTokenURI(tokenId) {
  const data = `0x780e9d63${tokenId.toString(16).padStart(64, '0')}`;
  const response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_call&to=${contractAddress}&data=${data}&tag=latest&apikey=${etherscanApiKey}`);
  const responseData = await response.json();
  const tokenURI = ethers.utils.parseBytes32String(responseData.result);
  return tokenURI;
}

async function loadNFTs() {
  const totalSupply = await fetchTotalSupply();
  const nftGallery = document.getElementById('nft-gallery');

  for (let i = 1; i <= totalSupply; i++) {
    const tokenURI = await fetchTokenURI(i);
    const response = await fetch(tokenURI);
    const metadata = await response.json();
    const image = document.createElement('img');
    image.src = metadata.image;
    nftGallery.appendChild(image);
  }
}

(async () => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://cdn.ethers.io/lib/ethers-5.0.umd.min.js';
  script.onload = () => {
    loadNFTs();
  };
  document.head.appendChild(script);
})();
