// pages/position/position.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    latitude: 0,//地图初次加载时的纬度坐标
    longitude: 0, //地图初次加载时的经度坐标
    name:"", //选择的位置名称
    shownum:0
  },
  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'FORBZ-KIPEF-WECJR-NFZKA-MREDV-FCF3O'
    });
   
    this.moveToLocation();   
  },
  onShow(){
    
    console.log('onshow')
    if(this.data.shownum==1){
      this.data.shownum++
      this.setData({
        shownum: this.data.shownum
      })
    } else if(this.data.shownum == 2){
      wx.navigateBack()
    }
  },
  //移动选点
  moveToLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.data.shownum++
        that.setData({
          shownum: that.data.shownum
        })    
        console.log(res.name);    
        //选择地点之后返回到原来页面
        // wx.navigateTo({
        //   url: "/pages/index/index?address="+res.name
        // });
				var pages = getCurrentPages();   //当前页面
				var prevPage = pages[pages.length - 2];   //上一页面
				prevPage.setData({
				       //直接给上一个页面赋值
				      addresschose: res.name,
				});
				 
				wx.navigateBack({
				     //返回
				     delta: 1
				})
				// wx.navigateBack()
      },
      fail: function (err) {
        console.log(err)
      }
    });
  }
});