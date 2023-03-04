import { useWeb3React } from "@web3-react/core"
import { injected } from "./wallet/Connectors"
import Web3 from 'web3';
import contractAbi from './blockChain/fujiAbi.json'
import { useEffect,useState } from "react";
import { NETWORK } from "./blockChain/netConfig";
export default function Home() {
  const { active, account, library, connector, activate, deactivate } = useWeb3React();
  const [web3,setWeb3] = useState(null);
  const [acc,setAcc] = useState(null);
  const [contract,setContract] = useState(null);
  console.log(NETWORK);
  useEffect(()=>{
    //实例化合同，方便后面调用智能合约
    if(window.ethereum){
      console.log(window.ethereum);
      console.log(contractAbi.abi);
      const web3 = new Web3(window.ethereum);
      const contractAddress = '0x502C92da5995F064CC61335f14C72D7E259194F4';
      const myContract = new web3.eth.Contract(contractAbi.abi,contractAddress);
      setContract(myContract);
      console.log(active);
    }
    if(active){
      SwitchNew()
      //切换网路不需要disconnect
      console.log("切换网络");
      connect();
    }
  },[library,active])

  useEffect(()=>{
    console.log(active,library);
    },[active])
  //连接钱包
  async function connect() {
    try {
      console.log('连接钱包');
      await activate(injected);
      console.log(NETWORK);
    } catch (ex) {
      console.log(ex)
    }
  }

  //断开钱包连接
  async function disconnect() {
    try {
      deactivate();
      console.log("断开连接");
    } catch (ex) {
      console.log(ex)
    }
  }

//切换区块链网络
  async function SwitchNew(){
    console.log("切换网络");
    console.log(active,library);
    await library.provider.request({
      method:'wallet_addEthereumChain',
      params:[
        NETWORK
      ]
    });
  }


  //合约方法
  async function allowance (){
    console.log(contract.methods.allowance)
    console.log(contract.methods);
    const result = await contract.methods.totalSupply().call();
    console.log("result",result);
  }


  //需要将数值转换成unit参数，这个方法暂时不行
  async function mint(){
    console.log(account);
    const toAccount = "0xfEAcaEeB11D2b6a34d3D9Ba5d4fC5b710C97dAc7";
    const result = await contract.methods.mint(toAccount,10).send({from:account});
    console.log("mint的结果"+result);
  }

  //获取代币名称
  async function tokenName(){
    console.log(contract);
    const result = await contract.methods.name().call();
    console.log("代币名称"+result);
  }


  
  return (
    <div className="flex flex-col items-center justify-center">
      <button onClick={connect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Connect to MetaMask</button>
      {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>}
      <button onClick={disconnect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Disconnect</button>
      {/* <button onClick = {allowance}>调用合约方法allowance</button> */}
      {/* <button onClick = {mint}>调用合约方法mint</button> */}
      <button onClick = {SwitchNew}>切换网络</button>
      <button onClick = {tokenName}>获取代币名称</button>
    </div>
  )
}
