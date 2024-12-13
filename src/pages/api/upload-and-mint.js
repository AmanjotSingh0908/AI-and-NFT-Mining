// pages/api/upload-and-mint.js
import { NFTStorage } from "nft.storage";
import axios from "axios";

const nftstorage = new NFTStorage({
  token: process.env.REACT_APP_HUGGING_FACE, // Use your actual API key here
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Extract the data from the request body
      const { prompt, name, description, address, file } = req.body;

      // Generate art (you can move the art generation logic here if needed)
      const generateArt = await axios.post(
        "https://api-inference.huggingface.co/models/stable-diffusion-v1-5/stable-diffusion-v1-5",
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          inputs: prompt,
        },
        { responseType: "blob" }
      );

      const artFile = new File([generateArt.data], "image.png", {
        type: "image/png",
      });

      // Upload to IPFS using nft.storage
      const store = await nftstorage.store({
        name: name || "AI NFT",
        description: description || "AI generated NFT",
        image: artFile,
      });

      // Cleanup IPFS URL
      const ipfsUrl = store.data.image.href.replace("ipfs://", "https://ipfs.io/ipfs");

      // Minting the NFT using NFTPort API
      const mintResponse = await axios.post(
        "https://api.nftport.xyz/v0/mints/easy/urls",
        {
          file_url: ipfsUrl,
          chain: "polygon",
          name: name || "AI NFT",
          description: description || "AI generated NFT",
          mint_to_address: address || "0x831d2b639238973BC16F88e80911204Ca9e13858",
        },
        {
          headers: {
            Authorization: process.env.REACT_APP_NFT_PORT, // Use your actual NFTPort API key
          },
        }
      );

      return res.status(200).json(mintResponse.data);
    } catch (error) {
      console.error("Error uploading art or minting NFT:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
