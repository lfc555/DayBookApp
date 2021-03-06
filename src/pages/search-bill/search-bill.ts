import { Component } from '@angular/core';
import { LoadingController,NavController, NavParams,AlertController } from 'ionic-angular';
import { DatePipe} from '@angular/common';

import { BookService } from '../../service/BookService';
import { HttpService } from '../../providers/http-service';
import { Dictionary } from '../../domain/Dictionary';
import { ResultsBill } from '../../pages/results-bill/results-bill';
import { QueryBook } from '../../domain/QueryBook';
import { StorageService } from "../../providers/storage-service";
import { Constants } from "../../domain/Constants";
@Component({
  selector: 'page-search-bill',
  templateUrl: 'search-bill.html',
})
export class SearchBill {
  billTypes:Dictionary[];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              private bookService :BookService,
              private httpService :HttpService,
              private storageService :StorageService,
              private datePipe :DatePipe,
              private alertCtrl: AlertController) {
  }
  
  ionViewDidLoad() {
    this.init();
  }
  loader = this.httpService.loading();
  init(){
    var billtype = this.storageService.read<Dictionary[]>(Constants.BILL_TYPE);
    if(billtype!=null){
     this.billTypes=billtype;
    }else{
       this.loader.present();
       this.httpService.httpGetWithAuth("common/dictionary?typeid=1")
          .then(result =>{
            this.loader.dismiss();
            this.billTypes = result.object;
            this.storageService.write(Constants.BILL_TYPE,this.billTypes);
          })
          .catch(error =>{
            this.loader.dismiss();
            console.log(error);
          });
      
    }
		
  }
  date = new Date();
  str = this.datePipe.transform(this.date, 'yyyy-MM-dd');
  credate_between:string = this.str;
  credate_betweenand:string = this.str;
  typeid_and:number;
  query(){
      let params = [{key:"credate_between",value:this.credate_between},
    {key:"credate_betweenand",value:this.credate_betweenand},
     {key:"typeid_and",value:(this.typeid_and===undefined ?"":this.typeid_and+"_LONG")}];
      this.navCtrl.push(ResultsBill,{params:params});
  }
 
}
