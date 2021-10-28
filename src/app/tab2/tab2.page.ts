import { Component, OnInit, NgZone, ViewChild,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import BigNumber from 'bignumber.js';
import Web3 from "web3";

//declare let window:any;
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  private web3:any;
  private stickerABI:any;
  //mainTest
  //private stickerAddr:any = "0x020c7303664bc88ae92cE3D380BF361E03B78B81";
  //private pasarAddr:any = "0x02E8AD0687D583e2F6A7e5b82144025f30e26aA0"
  //testNet
  private stickerAddr:any = "0xf7E4dD3e8a2ee2D14c6706B37D9ED4309726eDFc";
  private pasarAddr:any = "0x238e52d335a3abeDf9785D0ac9375623db0f0bC9"

  private creatorPrivateKey:any = "04868f294d8ef6e1079752cd2e1f027a126b44ee27040d949a88f89bddc15f31";
  //private tokenId:any = "0xfeef09f58c64fede695bf447c20d011febd4e98bf184411f8e1eb902d87a8c55";

  private tokenId:any = "";
  current: number = 27;
  max: number = 50;
  public tokenInfo: String = "";
  constructor(private router: Router) {}

  ngOnInit() {
    this.stickerABI = require("../../assets/contracts/stickerABI.json");
    console.log("====this.stickerABI====="+this.stickerABI);
  }

  test(){
    //this.router.navigate(['/test']);
    this.loadWeb3();
  }

  async getAccount(web3:any,privateKey:any){
    try {
      if (!web3) {
        console.error("Web3 not initialized");
        return;
      }
      if (!privateKey.startsWith("0x")) {
        privateKey = `0x${privateKey}`;
      }
      const acc = web3.eth.accounts.privateKeyToAccount(privateKey);
      return acc;
    } catch (err) {
      console.error(String(err));
      return;
    }
  }

  async tetsStickerContract(){
    let web3 = await this.getWeb3();
    //0xf36dA13891027Fd074bCE86E1669E5364F85613A
    const stickerContract = new web3.eth.Contract(this.stickerABI,this.stickerAddr);
    const accCreator = await this.getAccount(web3,this.creatorPrivateKey);
    // console.log("======accCreator.address======"+accCreator.address);
    // const initStickerData = stickerContract.methods.initialize().encodeABI();
    // console.log("====initStickerData======"+initStickerData);
    // let initStickerTx = {
    //   from: accCreator.address,
    //   to: this.stickerAddr,
    //   value: 0,
    //   data: initStickerData,
    // };

    // await this.sendTxWaitForReceipt(web3,initStickerTx,accCreator);
    // //await stickerContract.methods.initialized().call();

    const supply = "1";
    const uri = "feeds:json:QmQPrJcoALFayoVgCwZuH5QEt7RZVTcYdgJtJCCQ3nrtFi";
    const royalty = "100";
    let parm = {"tokenId:":this.tokenId,"supply":supply,"uri":uri,"royalty":royalty}
    console.log("===parm=="+JSON.stringify(parm));
    const mintData = stickerContract.methods.mint(this.tokenId, supply, uri, royalty).encodeABI();
    console.log("===mintData==="+mintData);
    let mintTx = {
      from: accCreator.address,
      to: this.stickerAddr,
      value: 0,
      data:mintData
    };

    //mintTx["gas"] = Math.round(parseInt(await web3.eth.estimateGas(mintTx))*1.2);


    await this.sendTxWaitForReceipt(web3,mintTx,accCreator);

  }

  async getWeb3(){
    // let test1 = "65054172496566903972786021098325872089553858719250395711111544717554252585953";
    // let test = new BigNumber("0x8fd35b57857eb176ad07f3a49e6d7f53d022d4f2538c21a2306c40cd61e11be1");
    // let test3 = test.toFormat({prefix:""});
    // //console.log("====test3==="+test3);
    // if(test1 === test3){
    //   console.log("====test4==="+test3);
    // }
    if (typeof this.web3 !== 'undefined') {
       this.web3 = new Web3(this.web3.currentProvider);
    } else {
      let options = {
        agent: {

        }
    };
       this.web3 = new Web3(new Web3.providers.HttpProvider("https://api-testnet.trinity-tech.cn/eth",options));
    }
    return this.web3;
  }


 async sendTxWaitForReceipt(web3:any,tx:any,acc:any){
    try {
      if (!web3) {
        console.error("Web3 not initialized");
      }

      if (!tx.gasPrice) {
        tx.gasPrice = await web3.eth.getGasPrice();
        console.log("======tx======"+JSON.stringify(tx));
      }

      if (!tx.gas) {
           tx.gas = Math.round(parseInt(await web3.eth.estimateGas(tx))*1.2);
      }
      console.log("======tx2======"+JSON.stringify(tx));
      const signedTx = await acc.signTransaction(tx);
      console.log("======signedTx======"+signedTx);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log("===receipt==="+JSON.stringify(receipt));
      //return receipt;
      return;
    } catch (err) {
      alert("nft创建失败");
      return "";
    }
  }


  async loadWeb3() {
    if (typeof this.web3 !== 'undefined') {
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      this.web3 = new Web3(new Web3.providers.HttpProvider("https://api-testnet.io/eth",{agent:{}}));
      console.log("========="+this.web3);
      let version = this.web3.version;
      console.log(version);
      this.web3.eth.getChainId().then((id:any)=>{
        console.log(id);
      });

      // this.web3.eth.getCoinbase().then((address:any)=>{
      //   console.log("===address=="+address);
      // });

      // address: '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01',

      let account = await this.web3.eth.accounts.privateKeyToAccount('04868f294d8ef6e1079752cd2e1f027a126b44ee27040d949a88f89bddc15f31');
      console.log("===account=="+JSON.stringify(account));
      let gasPrice = await this.web3.eth.getGasPrice();
      console.log("===gasPrice=="+gasPrice);
      this.web3.eth.getBalance("0xf36dA13891027Fd074bCE86E1669E5364F85613A")
      .then((num:any)=>{
        console.log("====="+num);
      });
      this.web3.eth.getAccounts().then((accounts:any)=>{
        console.log("======="+accounts);
      });
    }
  }

async getTotalSupply(){
  await this.getWeb3();
  if(this.tokenId===""){
      return;
  }
  const stickerContract = new this.web3.eth.Contract(this.stickerABI,this.stickerAddr);
  let tokenInfo =  await stickerContract.methods.tokenInfo(this.tokenId).call();
  this.tokenInfo = JSON.stringify(tokenInfo);
}

async getExatTokenIfo(){
  await this.getWeb3();
  if(this.tokenId===""){
      return;
  }
  const stickerContract = new this.web3.eth.Contract(this.stickerABI,this.stickerAddr);
  let tokenInfo =  await stickerContract.methods.tokenExtraInfo(this.tokenId).call();
  this.tokenInfo = JSON.stringify(tokenInfo);
}

async getBalance(){
  await this.getWeb3();
  if(this.tokenId===""){
      return;
  }

  const balance = await new this.web3.eth.getBalance(this.tokenId);
  this.tokenInfo = JSON.stringify(balance);
}

async tokenIdByIndex(stickerContract:any,index:any){
   let tokenId =  await stickerContract.methods.tokenIdByIndex(index).call();
   console.log("=====tokenId===="+tokenId);
   this.getUri(stickerContract,tokenId);
}

async getUri(stickerContract:any,tokenId:any){
  let feedsUri =  await stickerContract.methods.uri(tokenId).call();
  console.log("===feedsUri==="+feedsUri);
}

async testSetApprovalForAll(){
  let web3 = await this.getWeb3();
  let stickerContract = new web3.eth.Contract(this.stickerABI,this.stickerAddr);
  const accCreator = await this.getAccount(web3,this.creatorPrivateKey);

  const approveData = stickerContract.methods.ApprovalForAll(accCreator.address, true).encodeABI();
  const approveTx = {
    from: accCreator.address,
    to: this.stickerAddr,
    value: 0,
    data: approveData
  };

  await this.sendTxWaitForReceipt(web3,approveTx, accCreator);

  const sellerApproved = await stickerContract.methods
  .isApprovedForAll(accCreator.address, accCreator.address)
  .call();

  console.log("====sellerApproved====="+JSON.stringify(sellerApproved));

}

 async getSellerCount(){

  await this.getWeb3();
  this.stickerABI = require("../../assets/contracts/pasarABI.json");

  let stickerContract = new this.web3.eth.Contract(this.stickerABI,this.pasarAddr);
  let sellerCount =  await stickerContract.methods.getOpenOrderCount().call();
  console.log("====getSellerCount====="+sellerCount);
  for(let index = 0;index<sellerCount;index++){
     await this.getSellerByIndex(index,stickerContract);
  }
 }

 async getSellerByIndex(index:any,contract:any){
  let  openOrder =  await contract.methods.getOpenOrderByIndex(index).call();
  let tokenId = openOrder[3];
  console.log("====tokenId===="+tokenId);

  const stickerABI = require("../../assets/contracts/stickerABI.json");
  const stickerContract = new this.web3.eth.Contract(stickerABI,this.stickerAddr);
  let feedsUri =  await stickerContract.methods.uri(tokenId).call();
  console.log("===feedsUri==="+feedsUri);
 }



async createOrderForSale(){
  await this.getWeb3();
  let pasarABI = require("../../assets/contracts/pasarABI.json");
  let pasarContract = new this.web3.eth.Contract(pasarABI,this.pasarAddr);


  const stickerAddr = await pasarContract.methods.getTokenAddress().call();
  const stickerABI = require("../../assets/contracts/stickerABI.json");
  const stickerContract = new this.web3.eth.Contract(stickerABI, stickerAddr);

  const accCreator =  await this.web3.eth.accounts.privateKeyToAccount('04868f294d8ef6e1079752cd2e1f027a126b44ee27040d949a88f89bddc15f31');
  const accSeller =  await this.web3.eth.accounts.privateKeyToAccount('04868f294d8ef6e1079752cd2e1f027a126b44ee27040d949a88f89bddc15f31');

   // Seller approve pasar
   const approveData = stickerContract.methods.setApprovalForAll(this.pasarAddr, true).encodeABI();
   const approveTx = {
     from: accSeller.address,
     to: stickerAddr,
     value: 0,
     data: approveData
   };

   await this.sendTxWaitForReceipt(this.web3,approveTx,accCreator);

   const salePrice = "1";
   const tokenId ="1";
   const saleData = pasarContract.methods.createOrderForSale(tokenId,"1", salePrice).encodeABI();
   const saleTx = {
     from: accSeller.address,
     to: this.pasarAddr,
     value: 0,
     data: saleData,
   };

   await this.sendTxWaitForReceipt(this.web3,saleTx,accCreator);


 }

}
