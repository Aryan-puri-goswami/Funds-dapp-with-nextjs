import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect } from 'react';
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";


function Funder() {

    const [web3Api, setWeb3Api] = useState({ contract: null, provider: null });
    const [amount, setAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [contractBalanceWei, setContractBalanceWei] = useState();
    const [contractBalanceEther, setContractBalanceEther] = useState();
    const [show, setShow] = useState(false);


    useEffect(() => {

        const loadProvider = async () => {
            const mprovider = await detectEthereumProvider();

            const provider = new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545");
            const Funder = require("../contracts/Funder.json");
            const ABI = Funder["abi"];
            const contractAddress = Funder["networks"]["5777"]["address"];

            const privateKey = "3b6e280357c202695bc55eec27b96297e6481f552c21eb7642aa1ce062a55706"; // this is not the way you should do this.
            const wallet = new ethers.Wallet(privateKey, provider);


            const contract = new ethers.Contract(contractAddress, ABI, wallet);
            if (mprovider) {
                mprovider.request({ method: "eth_requestAccounts" });
                setWeb3Api({
                    contract,
                    provider
                });
            } else {
                console.error("Please install MetaMask!", error);
            }
        }
        loadProvider();

    }, [])

    const transferFund = async () => {
        if (amount === "") {
            alert("Please ether the amount");
        } else {

            const { contract, provider } = web3Api;
            await contract.transfer({
                value: ethers.utils.parseEther(amount)
            });
            const balance = await contract.getContractBalance();
            console.log(Number(balance));
            setAmount("");
        }
    };

    const withdrawFund = async () => {
        if (!withdrawAmount) {
            alert("Please enter the amount");
        } else {

            const { contract, provider } = web3Api;
            await contract.withdraw(ethers.utils.parseEther(withdrawAmount));
            const balance = await contract.getContractBalance();
            console.log(Number(balance));
            setWithdrawAmount("");
        }
    };

    const getContractBalance = async () => {
        const { contract, provider } = web3Api;
        const balance = String(await contract.getContractBalance());
        setContractBalanceWei(balance);
        setContractBalanceEther(ethers.utils.formatEther(balance));
        setShow(true);
    }

    useEffect(() => {
        if (show === true) {
            getContractBalance();
        }
    }, [amount, withdrawAmount])

    return (
        <div>
            <h2>KK</h2>
            <Spinner animation='border' />
            <input type="number" placeholder='Enter the transfer ether amount' value={amount} onChange={(e) => { setAmount(e.target.value) }} />
            <button onClick={transferFund}>Transfer</button>
            <input type="number" placeholder="Enter the withdraw ether amount" value={withdrawAmount} onChange={(e) => { setWithdrawAmount(e.target.value) }} />
            <button onClick={withdrawFund}>Withdraw</button>
            <Spinner animation='border' />
            <div>
                <button onClick={getContractBalance}>Get Contract Balance</button>
                {show ? <h4>{contractBalanceWei} Wei or {contractBalanceEther} Ether</h4>
                    : ""}
            </div>
        </div>
    )
}

export default Funder;