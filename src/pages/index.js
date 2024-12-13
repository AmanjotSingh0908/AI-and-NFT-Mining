// import { useState } from "react";
// import axios from "axios";

// import { NFTStorage } from "nft.storage";
// import { response } from "express";

// export default function Home() {
//   const [prompt, setPrompt] = useState("");
//   const [imageBlob, setImageBlob] = useState(null);
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [address, setAddress] = useState("");
//   const [minted, setMinted] = useState(false);

//   console.log(prompt)


//   const cleanupIPFS = (url) => {
//     if (url.includes("ipfs://")) {
//       return url.replace("ipfs://", "https://ipfs.io/ipfs");
//     }
//   }

//   const generateArt = async () => {
//     setLoading(true)
//     try {
//       const response = await axios.post(
//             "https://api-inference.huggingface.co/models/stable-diffusion-v1-5/stable-diffusion-v1-5",
//             {
//               headers: {
//                 Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE}`,
//                 "Content-Type": "application/json",
//               },
//               method: "POST",
//               inputs: JSON.stringify(prompt),
//             },
//             {responseType : "blob"}
//           );

//           //convert blob to a image file type
//           const file = new File([response.data], "image.png", {
//             type: "image/png",
//           });
//           console.log(file);
//           setFile(file);

//           console.log(response);
//           const url = URL.createObjectURL(response.data);
//           console.log(url);
//           setImageBlob(url);

//           const uploadArtToIpfs = async() => {
//             try {
//               const nftstorage = new NFTStorage({
//                 token: process.env.REACT_APP_HUGGING_FACE,
//               })

//               const store = await nftstorage.store({
//                 name: "AI NFT",
//                 description: "AI generated NFT",
//                 image: file
//               })
//               console.log(store)
//               return cleanupIPFS(store.data.image.href)
//             } catch (error) {
//               console.log(error)
//               return null
//             }
//           }
//     } catch (error) {
//       setError(error)
//       console.log(error.msg)
//     }
//   }

//   const mintNft = async () => {
//     try {
//       const imageURL = await uploadArtToIpfs();
//       console.log("URL", imageURL)
//       //mint as an NFT on nftport
//       const response = await axios.post(
//         'https://api.nftport.xyz/v0/mints/easy/urls',
//         {
//           file_url: imageURL,
//           chain: "polygon",
//           name: name?.length > 0 ? name : "AI NFT",
//           description: description?.length > 0 ? description : "AI generated NFT",
//           mint_to_address: address?.length > 0 ? address : "0x831d2b639238973BC16F88e80911204Ca9e13858",
//         },
//         {
//           headers: {
//             Authorization: process.env.REACT_APP_NFT_PORT,
//           }
//         }
//       );
//       const data = await response.data;
//       setMinted(true)
//       console.log(data)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   console.log(name)
//   console.log(description)
//   console.log(address)

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen gap-4">
//       <h1 className="text-4xl font-extrabold"AI Art Gasless mints></h1>
//       <div className="flex flex-col items-center justify-center">
//         <div className="flex items-center justify-center gap-4">
//           <input className="border-2 border-black rounded-md p-2"
//           onChange={(e) => setPrompt(e.target.value)}
//           type="text"
//           placeholder="Enter a prompt"
//           />
//           <button
//           onClick={generateArt}
//           className="bg-black text-white rounded-md p-2" >
//             Next
//           </button>
//           {loading && <p>Loading...</p>}
//         </div>
//       </div>

//     </div>
//   );
// }
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [minted, setMinted] = useState(false);
  const [error, setError] = useState(null);

  const generateArt = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/upload-and-mint", {
        prompt,
        name: "AI NFT",
        description: "AI generated NFT",
        address: "0x831d2b639238973BC16F88e80911204Ca9e13858", // Replace with actual address
      });

      console.log("NFT Minted:", response.data);
      setMinted(true);
    } catch (error) {
      setError("Failed to mint NFT");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-extrabold">AI Art Gasless Mints</h1>
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-4">
          <input
            className="border-2 border-black rounded-md p-2"
            onChange={(e) => setPrompt(e.target.value)}
            type="text"
            placeholder="Enter a prompt"
          />
          <button
            onClick={generateArt}
            className="bg-black text-white rounded-md p-2"
          >
            Next
          </button>
          {loading && <p>Loading...</p>}
        </div>
      </div>
      {minted && <p>Minted Successfully!</p>}
      {error && <p>{error}</p>}
    </div>
  );
}
