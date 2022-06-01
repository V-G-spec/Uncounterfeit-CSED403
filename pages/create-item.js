import {useState} from 'react'
import {ethers} from 'ethers'
import {create as ipfsHttpClient} from 'ipfs-http-client'
import {useRouter, userrouter} from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
    nftaddress, nftmarketaddress
} from '../config'

import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"

export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const router = useRouter()
  
    async function onChange(e){
        const file = e.target.files[0]
        try{
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url)
        } catch(e) {
            console.log(e)
        }
    }

    async function createMarket() {
        const { name, description, price, nfc_serial } = formInput
        if (!name || !description || !price || !fileUrl){
            if (!name)
                console.log("Name not filled")
            if (!description)
                console.log("Description not filled")
            if (!price)
                console.log("Price not filled")
            if (!nfc_serial)
                console.log("NFC serial number not filled")
            if (!fileUrl)
                console.log("fileUrl not filled")
            return
        }

        /* first, upload to IPFS */
        const data = JSON.stringify({
          name, description, image: fileUrl
        })
        try {
          const added = await client.add(data)
          const url = `https://ipfs.infura.io/ipfs/${added.path}`
          /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
          createSale(url)
        } catch (error) {
          console.log('Error uploading file: ', error)
        }
    }
    
    async function createSale(url) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        let transaction = await contract.createToken(url)
        let tx = await transaction.wait()

        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()

        const nfc_serial = parseInt(formInput.nfc_serial.toString().replace(/\:/g,''), 16)
        // console.log(nfc_serial.toString(16).padStart(14, '0'))
        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()
        
        transaction = await contract.createMarketItem(
            nftaddress, tokenId, price, nfc_serial, {value: listingPrice}
        )
        await transaction.wait()
        router.push('/')
    }
    return (
        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <input
                    placeholder=" Name"
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value})}
                />
                <textarea
                    placeholder="Collectible Description"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({...formInput, description: e.target.value})}
                />
                <input
                    placeholder="Collectible Price in Eth"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
                <input
                    placeholder="Your NFC chip's Serial Number"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, nfc_serial: e.target.value })}
                />
                <input
                    type="file"
                    name="Collectible"
                    className="my-4"
                    onChange={onChange}
                />
                {
                    fileUrl && (
                        <img className="rounded mt-4" width="350" src={fileUrl} />
                    )
                }
                <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Create Digital Collectible
                </button>
            </div>
        </div>
    )
}



