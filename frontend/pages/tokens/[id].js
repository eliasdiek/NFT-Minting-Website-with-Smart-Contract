import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import TokenDetail from '../../components/sections/TokenDetail';
import { useSelector, useDispatch } from 'react-redux';
import { openSignin } from '../../store/actions';
import Web3 from 'web3';
import axios from 'axios';
import Modal from '../../components/modals/Modal';
import { Ether, Wether } from '../../components/icons';
import Button from '../../components/buttons/Button';
import leaseAbi from '../../contracts/Leasing.json';
import nftAbi from '../../contracts/FathomyachtClub.json';
import wethAbi from '../../contracts/Weth.json';

const leaseContractAddress = process.env.NEXT_PUBLIC_LEASE_CONTRACT_ADDRESS;
const nftContractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
const wethContractAddress = process.env.NEXT_PUBLIC_WETH_CONTRACT_ADDRESS;
const tokenBatchURI = process.env.NEXT_PUBLIC_TOKEN_BATCH_URI;

export default function Token() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [metaData, setMetaData] = useState();
    const [offers, setOffers] = useState([]);
    const [wethBalance, setWethBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [amountInvalid, setAmountInvalid] = useState("");
    const [tokenIsLeasable, setTokenIsLeasable] = useState(false);
    const [leasableToken, setLeasableToken] = useState();
    const [isOwner, setIsOwner] = useState(false);
    const [amount, setAmount] = useState(0);
    const [duration, setDuration] = useState(30);
    const [lease, setLease] = useState();
    const walletAddr = useSelector((state) => state.address);
    const router = useRouter();
    const { id } = router.query;
    const dispatch = useDispatch();

    const init = async () => {
        await getMetaData();
        await getLeasableToken();
        await getLeasing();
        await getOffers();
    }

    const getMetaData = async () => {
        try {
            setLoading(true);

            const result = await axios.get(tokenBatchURI + '/' + parseInt(id));
            console.log('[getMetaData]', result);
            setMetaData(result.data);
        }
        catch(err) {
            console.log('[err]', err);
        }
    }

    const setLeaseHandler = async () => {
        try {
            setAmountInvalid('');
            if(!amount) {
                setAmountInvalid('You don\'t have enough funds.');
                return false;
            }
            setBtnLoading(true);
            if(typeof window === 'undefined') throw Error('window is undefined');
            const { ethereum } = window;
            if (typeof ethereum === 'undefined') throw Error('Web3 provider is not available');

            const w3 = new Web3(ethereum);
            const leaseContract = new w3.eth.Contract(leaseAbi, leaseContractAddress);
            const result = await leaseContract.methods.setTokenLeasable(id, w3.utils.toWei(amount), duration).send({ from: walletAddr });
            console.log('[setLeaseHandler]', result);
            setBtnLoading(false);
            setTokenIsLeasable(true);
            setIsModalOpen(false);

            await getLeasableToken();
            await getIsOwner();
            setLoading(false);
        }
        catch (err) {
            console.log('[err]', err);
            setBtnLoading(false);
        }
    }

    const updateLeasableToken = async () => {
        try {
            setAmountInvalid('');
            if(!amount) {
                setAmountInvalid('You don\'t have enough funds.');
                return false;
            }
            setBtnLoading(true);
            if(typeof window === 'undefined') throw Error('window is undefined');
            const { ethereum } = window;
            if (typeof ethereum === 'undefined') throw Error('Web3 provider is not available');

            const w3 = new Web3(ethereum);
            const leaseContract = new w3.eth.Contract(leaseAbi, w3.utils.toChecksumAddress(leaseContractAddress));
            const result = await leaseContract.methods.updateLeasableToken(id, w3.utils.toWei(amount), duration).send({ from: walletAddr });
            console.log('[result]', result);
            setBtnLoading(false);
            setTokenIsLeasable(true);
            setIsModalOpen(false);
            await getLeasableToken();
            await getIsOwner();
            setLoading(false);            
        }
        catch (err) {
            console.log('[err]', err);
            setBtnLoading(false);
            setLoading(false);
        }
    }

    const approveOffer = async (from) => {
        try {
            setLoading(true);
            if(typeof window === 'undefined') throw Error('window is undefined');
            const { ethereum } = window;
            if (typeof ethereum === 'undefined') throw Error('Web3 provider is not available');

            const w3 = new Web3(ethereum);
            const leaseContract = new w3.eth.Contract(leaseAbi, leaseContractAddress);
            const result = await leaseContract.methods.approveLeaseOffer(id, from).send({ from: walletAddr });
            console.log('[approveOffer]', result);
            await getOffers();
            await getLeasing();
            setLoading(false);            
        }
        catch (err) {
            console.log('[err]', err);
            setBtnLoading(false);
            setLoading(false);
        }
    }

    const cancelOffer = async () => {
        try {
            setLoading(true);
            if(typeof window === 'undefined') throw Error('window is undefined');
            const { ethereum } = window;
            if (typeof ethereum === 'undefined') throw Error('Web3 provider is not available');

            const w3 = new Web3(ethereum);
            const leaseContract = new w3.eth.Contract(leaseAbi, leaseContractAddress);
            const result = await leaseContract.methods.calcenLeaseOffer(id).send({ from: walletAddr });
            console.log('[cancelOffer]', result);
            await getOffers();
            setLoading(false);            
        }
        catch (err) {
            console.log('[err]', err);
            setBtnLoading(false);
            setLoading(false);
        }
    }

    const cancelTokenLeasable = async () => {
        try {
            setLoading(true);
            if(typeof window === 'undefined') throw Error('window is undefined');
            const { ethereum } = window;
            if (typeof ethereum === 'undefined') throw Error('Web3 provider is not available');

            const w3 = new Web3(ethereum);
            const leaseContract = new w3.eth.Contract(leaseAbi, w3.utils.toChecksumAddress(leaseContractAddress));
            const result = await leaseContract.methods.cancelTokenLeasable(id).send({ from: walletAddr });
            console.log('[result]', result);

            await getLeasableToken();
            await getIsOwner();
            setLoading(false);
        }
        catch (err) {
            console.log('[err]', err);
            setLoading(false);
        }
    }

    const makeOfferHandler = async () => {
        setAmountInvalid('');
        if(!amount) {
            setAmountInvalid('You don\'t have enough funds.');
            return false;
        }

        setBtnLoading(true);
        const allowedAmount = await allowance();
        if (allowedAmount == 0) {
            await allowContractInWeth();
        }

        await makeOffer();
        setLoading(false);
        setIsModalOpen(false);
        await getOffers();
        setBtnLoading(false);
    }

    const makeOffer = async () => {
        try {
            setBtnLoading(true);
            if(typeof window === 'undefined') throw Error('window is undefined');
            const { ethereum } = window;
            if (typeof ethereum === 'undefined') throw Error('Web3 provider is not available');

            const w3 = new Web3(ethereum);
            const leaseContract = new w3.eth.Contract(leaseAbi, leaseContractAddress);
            const result = await leaseContract.methods.sendLeaseOffer(id, w3.utils.toWei(amount), duration).send({ from: walletAddr });
            console.log('[result]', result);
        }
        catch (err) {
            console.log('[err]', err);
            setLoading(false);
            setBtnLoading(false);
        }
    }

    const allowance = async () => {
        try {
            if(typeof window === 'undefined') throw Error('window is undefined');
            const { ethereum } = window;
            if (typeof ethereum === 'undefined') throw Error('Web3 provider is not available');

            const w3 = new Web3(ethereum);
            const wethContractInstance = new w3.eth.Contract(wethAbi, wethContractAddress);
            const result = await wethContractInstance.methods.allowance(walletAddr, leaseContractAddress).call();
            const allowedAmount = w3.utils.fromWei(result);
            console.log('[allowance 2]', allowedAmount);

            return allowedAmount;
        }
        catch (err) {
            console.log('[err]', err);
            setLoading(false);
            setBtnLoading(false);
        }
    }

    const allowContractInWeth = async () => {
        try {
            if(typeof window === 'undefined') throw Error('window is undefined');
            const { ethereum } = window;
            if (typeof ethereum === 'undefined') throw Error('Web3 provider is not available');

            const w3 = new Web3(ethereum);
            const wethContractInstance = new w3.eth.Contract(wethAbi, wethContractAddress);
            const result = await wethContractInstance.methods.approve(leaseContractAddress, w3.utils.toWei('9999')).send({ from: walletAddr });
            console.log('[allowContractInWeth]', result);
        }
        catch (err) {
            console.log('[err]', err);
            setLoading(false);
            setBtnLoading(false);
        }
    }

    const getWethBalance = async () => {
        try {
            setAmountInvalid('');
            if(typeof window === 'undefined') throw Error('window is undefined');
            const { ethereum } = window;
            if (typeof ethereum === 'undefined') throw Error('Web3 provider is not available');

            const w3 = new Web3(ethereum);
            const wethContractInstance = new w3.eth.Contract(wethAbi, wethContractAddress);
            const result = await wethContractInstance.methods.balanceOf(walletAddr).call();
            const balance = w3.utils.fromWei(result);
            setWethBalance(balance);
            if (balance === 0) setAmountInvalid('You don\' have enough WETH balance.');
            console.log('[getWethBalance]', balance);
        }
        catch (err) {
            console.log('[err]', err);
            setLoading(false);
            setBtnLoading(false);
        }
    }

    const getOffers = async () => {
        try {
            setLoading(true);
            if(typeof window === 'undefined') throw Error('window is undefined');
            const { ethereum } = window;
            if (typeof ethereum === 'undefined') throw Error('Web3 provider is not available');

            const w3 = new Web3(ethereum);
            const leaseContract = new w3.eth.Contract(leaseAbi, leaseContractAddress);
            const result = await leaseContract.methods.getLeaseOffers(id).call();
            const leaseOffers = [];
            result.forEach((leaseOffer) => {
                leaseOffers.push({
                    from: leaseOffer['from'],
                    price: w3.utils.fromWei(leaseOffer['price']),
                    expiresIn: leaseOffer['expiresIn']
                });
            })
            console.log('[getOffers]', leaseOffers);
            setOffers(leaseOffers);
            setLoading(false);
        }
        catch (err) {
            console.log('[err]', err);
            setLoading(false);
        }
    }

    const getIsOwner = async () => {
        try {
            const alreadyLoading = loading;
            if (!alreadyLoading) setLoading(true);
            if(typeof window === 'undefined') throw Error('window is undefined');
            const { ethereum } = window;
            if (typeof ethereum === 'undefined') throw Error('Web3 provider is not available');

            const w3 = new Web3(ethereum);
            const nftContractInstance = new w3.eth.Contract(nftAbi, nftContractAddress);
            const result = await nftContractInstance.methods.ownerOf(id).call();

            console.log('[getIsOwner]', result)
            
            if (result === walletAddr) {
                setIsOwner(true);
                if (!alreadyLoading) setLoading(false);
                return true;
            }
            else {
                setIsOwner(false);
                await getWethBalance();
                if (!alreadyLoading) setLoading(false);
                return false;
            };
        }
        catch (err) {
            console.log('[err]', err);
            setLoading(false);
        }
    }

    const getLeasing = async () => {
        try {
            setLoading(true);
            if(typeof window === 'undefined') throw Error('window is undefined');
            const { ethereum } = window;
            if (typeof ethereum === 'undefined') throw Error('Web3 provider is not available');

            const w3 = new Web3(ethereum);
            const leaseContract = new w3.eth.Contract(leaseAbi, leaseContractAddress);
            const result = await leaseContract.methods.getLease(id).call();
            console.log('[getLeasing]', result);
            setLease({
                from: result['from'],
                price: w3.utils.fromWei(result['price']),
                expiresIn: result['expiresIn']
            });

            return result;
        }
        catch (err) {
            console.log('[err]', err);
            setLoading(false);
            setBtnLoading(false);
        }
    }

    const getLeasableToken = async () => {
        try {
            setLoading(true);
            if(typeof window === 'undefined') throw Error('window is undefined');
            const { ethereum } = window;
            if (typeof ethereum === 'undefined') throw Error('Web3 provider is not available');

            const w3 = new Web3(ethereum);
            const leaseContract = new w3.eth.Contract(leaseAbi, w3.utils.toChecksumAddress(leaseContractAddress));
            const result = await leaseContract.methods.getLeasableToken(String(id)).call();
            console.log('[getLeasableToken]', result);

            if(result['tokenId'] > 0) {
                setTokenIsLeasable(true);
                setLeasableToken({
                    tokenId: result['tokenId'],
                    price: w3.utils.fromWei(result['price']),
                    duration: result['duration']
                });
            }
            else {
                setTokenIsLeasable(false);
                setLeasableToken({
                    tokenId: 0,
                    price: 0,
                    duration: 0
                });
            }
        }
        catch (err) {
            console.log('[err]', err);
            setLoading(false);
        }
    }

    const leaseHandler = async () => {
        if (!walletAddr) {
            dispatch(openSignin(true));
            return false;
        }

        try {
            setBtnLoading(true);
            if(typeof window === 'undefined') throw Error('window is undefined');
            const { ethereum } = window;
            if (typeof ethereum === 'undefined') throw Error('Web3 provider is not available');

            const w3 = new Web3(ethereum);
            const leaseContract = new w3.eth.Contract(leaseAbi, leaseContractAddress);
            const result = await leaseContract.methods.lease(id, leasableToken.duration).send({ from: walletAddr, value: w3.utils.toWei(leasableToken.price) });
            console.log('[leaseHandler]', result);
            
            setTokenIsLeasable(false);

            setBtnLoading(false);
            await getLeasableToken();
            await getLeasing();
            setLoading(false);
        }
        catch (err) {
            console.log('[err]', err);
            setBtnLoading(false);
        }
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function openModal() {
        if (!walletAddr) dispatch(openSignin(true));
        else setIsModalOpen(true);
    }

    useEffect(() => {
        if (id) {
            init();
        }
    }, [id]);

    useEffect(() => {
        if (walletAddr && id) getIsOwner();
    }, [walletAddr, id]);

    return (
        <React.Fragment>
            <Head>
                <title>{ metaData ? metaData.name : `Token #${id}` } - Fathom Yacht Club</title>
                <meta name="description" content="Generated by create next app" />
            </Head>
    
            <main className="sm:pt-20">
                {
                    loading ? (
                        <React.Fragment>
                            <div className="container flex items-center justify-center p-28">
                                <span className="block animate-spin bg-transparent border-3 border-t-primary rounded-full h-10 w-10"></span>
                            </div>
                        </React.Fragment>
                    ) : (
                        metaData && <section>
                            <TokenDetail
                             walletAddr={walletAddr}
                             metaData={metaData}
                             openLeaseModal={openModal}
                             tokenIsLeasable={tokenIsLeasable}
                             cancelTokenLeasable={cancelTokenLeasable}
                             leasableToken={leasableToken}
                             isOwner={isOwner}
                             offers={offers}
                             approveOffer={approveOffer}
                             cancelOffer={cancelOffer}
                             lease={lease}
                             leaseHandler={leaseHandler}
                             btnLoading={btnLoading}
                            />
                        </section>
                    ) 
                }

                <Modal isOpen={isModalOpen} openModal={openModal} closeModal={closeModal} title={isOwner ? (tokenIsLeasable ? `Lower the listing price` : `List item for leasing`) : `Make an offer`}>
                    <div className="py-4">
                        <div className="mb-4">
                            <div className="py-1">
                                <label className="text-sm font-medium">Price</label>
                            </div>
                            <div className="flex items-center">
                                {
                                    isOwner ? (
                                        <div className="flex items-center border border-gray-300 py-2 pl-2 pr-3 h-12 rounded-md">
                                            <Ether width="20" height="20" fill="#333" />
                                            <span className="text-sm ml-1">ETH</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center border border-gray-300 py-2 pl-2 pr-3 h-12 rounded-md">
                                            <Wether width="15" />
                                            <span className="text-sm ml-1">WETH</span>
                                        </div>
                                    )
                                }

                                <input
                                    type="text"
                                    className="py-2 px-2 h-12 border border-gray-300 text-md font-light rounded-md ml-2 w-full outline-none focus:ring-2"
                                    placeholder="Amount"
                                    onChange={e => setAmount(e.target.value)}
                                />
                            </div>

                            { amountInvalid !== "" && <div className="text-sm text-red-600 py-1">&times; {amountInvalid}</div> }
                            { wethBalance > 0 && <div className="text-xs text-copy-secondary text-right py-1">Balance: {wethBalance}</div> }
                        </div>
                        <div className="mb-4">
                            <div className="py-1">
                                <label className="text-sm font-medium">Duration</label>
                            </div>
                            <div className="flex items-center">
                                <select className="w-full text-md py-2 px-2 h-12 border border-gray-300 outline-none focus:ring-2 rounded-md" defaultValue="30" onChange={e => setDuration(e.target.value)}>
                                    <option value="30">30 days</option>
                                    <option value="45">45 days</option>
                                    <option value="60">60 days</option>
                                    <option value="90">90 days</option>
                                </select>
                            </div>
                        </div>
                        <div className="pt-4">
                            <Button
                             theme="secondary"
                             className={`focus:ring-4 capitalize ${btnLoading && 'cursor-not-allowed opacity-50' } ${!isOwner && wethBalance === 0 && 'cursor-not-allowed opacity-50'}`}
                             onClick={isOwner ? (tokenIsLeasable ? updateLeasableToken : setLeaseHandler) : makeOfferHandler}
                             disabled={btnLoading || (!isOwner && wethBalance === 0)  ? true :  false}
                            >
                                {
                                    btnLoading ? 
                                    <span className="block animate-spin bg-transparent border-3 border-b-white border-t-blue-400 rounded-full h-5 w-5"></span> : 
                                    !tokenIsLeasable ? <span>Submit</span> : <span>Set this price</span> 
                                }
                            </Button>
                        </div>
                    </div>
                </Modal>
            </main>
        </React.Fragment>
    );
};