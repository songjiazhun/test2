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
  constructor(private router: Router) {}

  ngOnInit() {
    this.stickerABI = require("../../assets/contracts/stickerABI.json");
    console.log("====this.stickerABI====="+this.stickerABI);
  }

  test(){
    //this.router.navigate(['/test']);
    this.loadWeb3();
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
}
