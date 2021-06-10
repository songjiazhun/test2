import { Component, OnInit, NgZone, ViewChild,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
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
  private stickerAddr:any = "0x3B85195cBE835926357D759e9eA0b0829eda0e38";
  private creatorPrivateKey:any = "04868f294d8ef6e1079752cd2e1f027a126b44ee27040d949a88f89bddc15f31";
  //private tokenId:any = "0xfeef09f58c64fede695bf447c20d011febd4e98bf184411f8e1eb902d87a8c55";

  private tokenId:any = "0xfeef09f58c64fede695bf447c20d011febd4e98bf184411f8e1eb902d87a8c56";

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
    const uri = "feeds:json:QmeoadgCSkvuzRBJtqi6DxAcRLRweoH6VE4jgmtXZBCtWs";
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

    if (typeof this.web3 !== 'undefined') {
       this.web3 = new Web3(this.web3.currentProvider);
    } else {
      let options = {
        agent: {

        }
    };
       this.web3 = new Web3(new Web3.providers.HttpProvider("https://api-testnet.elastos.io/eth",options));
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
      console.error(String(err));
      return;
    }
  }


  async loadWeb3() {
    if (typeof this.web3 !== 'undefined') {
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      this.web3 = new Web3(new Web3.providers.HttpProvider("https://api-testnet.elastos.io/eth",{agent:{}}));
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
  const stickerContract = new this.web3.eth.Contract(this.stickerABI,this.stickerAddr);
  let totalSupply =  await stickerContract.methods.totalSupply().call();
  for(let index =0; index<totalSupply;index++){
      this.tokenIdByIndex(stickerContract,index);
  }
  console.log("===totalSupply===="+totalSupply);
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

}
