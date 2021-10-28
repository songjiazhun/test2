import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public imgPath = "";
  constructor(public loadingController: LoadingController) {
          //this.presentLoading();
        //this.presentLoadingWithOptions();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 1000000,
      id:"test"
    });
    await loading.present();
    // document.getElementById("test").onclick = ()=>{
    //   alert("33333");
    // }

    document.querySelector("ion-loading").onclick = ()=>{
          alert("33333");
    }
    //document.querySelector("ion-loading").style.backgroundColor = "red";
    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 500000,
      message: 'Click the backdrop to dismiss early...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: true
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed with role:', role);
  }


  yasuo(){
    let img = new Image();
    img.src = "./assets/shapes.svg";
    img.onload = () => {
      this.imgPath  = this.resizeImg(img,600,600,1);
    }
  }


/**
 * 计算缩放宽高
 * @param imgWidth 图片宽
 * @param imgHeight 图片高
 * @param maxWidth 期望的最大宽
 * @param maxHeight 期望的最大高
 * @returns [number,number] 宽高
 */
 zoomImgSize(imgWidth:any, imgHeight:any, maxWidth:any, maxHeight:any){
  let newWidth = imgWidth,
      newHeight = imgHeight;
  if (imgWidth / imgHeight >= maxWidth / maxHeight) {
      if (imgWidth > maxWidth) {
          newWidth = maxWidth;
          newHeight = (imgHeight * maxWidth) / imgWidth;
      }
  } else {
      if (imgHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (imgWidth * maxHeight) / imgHeight;
      }
  }
  if (newWidth > maxWidth || newHeight > maxHeight) {
      //不满足预期,递归再次计算
      return this.zoomImgSize(newWidth, newHeight, maxWidth, maxHeight);
  }
  return [newWidth, newHeight];
};

/**
 * 压缩图片
 * @param img img对象
 * @param maxWidth 最大宽
 * @param maxHeight 最大高
 * @param quality 压缩质量
 * @returns {string|*} 返回base64
 */
 resizeImg (img, maxWidth, maxHeight, quality = 1){
  const imageData = img.src;
  // if (imageData.length < maxWidth * maxHeight) {
  //     return imageData;
  // }
  const imgWidth = img.width;
  const imgHeight = img.height;
  if (imgWidth <= 0 || imgHeight <= 0) {
      return imageData;
  }
  const canvasSize = this.zoomImgSize(imgWidth, imgHeight, maxWidth, maxHeight);
  const canvas = document.createElement('canvas');
  canvas.width = canvasSize[0];
  canvas.height = canvasSize[1];
  canvas.getContext('2d')
      .drawImage(img, 0, 0, canvas.width,
          canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
};

}
