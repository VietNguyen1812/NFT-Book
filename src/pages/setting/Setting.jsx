import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
// import Header  from "../../components/Header/Header";
import { Button } from "primereact/button";
import "./Setting.css";
import Avatar from "react-avatar-edit";
import { auth, database } from "../../firebase";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { walletCollectionRef } from "../../api/firestore-collection";
import {
  doc,
  updateDoc,
  getDoc,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import ListWallet from "../../components/ListWallet/ListWallet";
const Web3 = require("web3");
const web3 = new Web3(process.env.RPC_URL);
const caver = new Web3(
  new Web3.providers.HttpProvider(
    "https://public-node-api.klaytnapi.com/v1/cypress"
  )
);

const Setting = () => {
  const [dialogs, setdialogs] = useState(false);
  const [imgCrop, setimgCrop] = useState(false);
  const [storeImage, setstoreImage] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const storage = getStorage();
  const storageRef = ref(storage, `avatar/${auth.currentUser.uid}`);
  const [userName, setUserName] = useState("");
  const [listWallet, setListWallet] = useState([]);
  async function handleSubmit() {
    const chainId = 8217; // Klaytn Testnet

    if (window.ethereum.networkVersion !== chainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: web3.utils.toHex(chainId) }],
        });
      } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: "Klay mainnet",
                chainId: web3.utils.toHex(chainId),
                nativeCurrency: {
                  name: "KLAY",
                  decimals: 18,
                  symbol: "KLAY",
                },
                rpcUrls: ["https://public-en.kaikas.io/v1/cypress"],
              },
            ],
          });
        }
      }
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // setAccounts(account);

      await addWallet(account[0]);
    }
  }
  const addWallet = async (wallet) => {
    const queryOwner = query(
      walletCollectionRef,
      where("owner", "==", auth.currentUser.uid)
    );
    const queryWallet = query(queryOwner, where("address", "==", wallet));
    const queryOwnerSnapshot = await getDocs(queryOwner);
    const queryWalletSnapshot = await getDocs(queryWallet);
    if (queryOwnerSnapshot.docs.length === 0) {
      await addDoc(walletCollectionRef, {
        address: wallet,
        id: 1,
        owner: auth.currentUser.uid,
      });
    } else if (
      queryOwnerSnapshot.docs.length > 0 &&
      queryWalletSnapshot.docs.length === 0
    ) {
      await addDoc(walletCollectionRef, {
        address: wallet,
        id: queryOwnerSnapshot.docs.length + 1,
        owner: auth.currentUser.uid,
      });
    } else {
      return;
    }
    if (
      queryOwnerSnapshot.docs.length > 0 &&
      queryWalletSnapshot.docs.length == 0
    ) {
      await addDoc(walletCollectionRef, {
        address: wallet,
        id: 1,
        owner: auth.currentUser.uid,
      });
    } else {
      await addDoc(walletCollectionRef, {
        address: wallet,
        id: 1,
        owner: auth.currentUser.uid,
      });
    }
  };
  const onCrop = (view) => {
    setimgCrop(view);
  };

  const onClose = () => {
    setimgCrop(null);
  };
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
  const saveImage = () => {
    setstoreImage([...storeImage, { imgCrop }]);
    setdialogs(false);
    var file = dataURLtoFile(imgCrop, `${auth.currentUser.uid}`);
    console.log(file);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImageURL(downloadURL);
          updateUserAvatar(downloadURL);
        });
      }
    );
  };

  const updateUserAvatar = async (url) => {
    const collectionRef = doc(database, "user", auth.currentUser.uid);

    // Set the "capital" field of the city 'DC'
    await updateDoc(collectionRef, {
      avatar: url,
      capital: true,
    });
  };
  const getAvatar = async () => {
    const docRef = doc(database, "user", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setImageURL(docSnap.data().avatar);
      setUserName(docSnap.data().username);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  const getListWallet = async () => {
    const queryOwner = query(
      walletCollectionRef,
      where("owner", "==", auth.currentUser.uid)
    );
    const queryOwnerSnapshot = await getDocs(queryOwner);
    console.log("assas", queryOwnerSnapshot.docs[0].data());
    var array = [];
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    // });
    // setListWallet(queryOwnerSnapshot.docs.data);
    //   console.log("asaa",listWallet.length);
  };
  useEffect(() => {
    getAvatar();
    getListWallet();
  }, []);

  return (
    <div>
      <div className="profile_img text-center p-4">
        <div className="div">
          <img
            style={{
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            src={imageURL}
            alt=""
            onClick={() => setdialogs(true)}
          />

          <Dialog
            visible={dialogs}
            header={() => (
              <p htmlFor="" className="text-2xl font-semibold textColor">
                Update profile
              </p>
            )}
            onHide={() => setdialogs(false)}
          >
            <div className="confirmation-content flex flex-column align-items-center">
              <div className="flex flex-column align-items-center mt-5 w-12">
                <div className="flex flex-column justify-content-around w-12 mt-4">
                  <Avatar
                    width={400}
                    height={300}
                    onClose={onClose}
                    onCrop={onCrop}
                  ></Avatar>
                  <br />
                  <Button onClick={saveImage} label="Save" icon="pi pi-check" />
                </div>
              </div>
            </div>
          </Dialog>
        </div>
        <br />
        <div class="profile-info">
          <h2>{userName}</h2>
        </div>
        <div clasName=""></div>
        <hr></hr>

        <ListWallet />

        <button
          className="primary__button btn btn-primary"
          onClick={handleSubmit}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default Setting;
