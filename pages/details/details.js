// pages/details/details.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var location = "";
var config = require('../../config.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
		activity_location:'请选择地址',
		imgb:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
		/*判断是第一次加载还是从position页面返回
        如果从position页面返回，会传递用户选择的地点*/
    console.log(options)
    if (options.address != null && options.address != '') {
      //设置变量 address 的值
      this.setData({
        address: options.address
      });
    } else {
      // 实例化API核心类
      qqmapsdk = new QQMapWX({
        //此key需要用户自己申请
        key: 'FORBZ-KIPEF-WECJR-NFZKA-MREDV-FCF3O'
      });
      var that = this;
      // 调用接口
      qqmapsdk.reverseGeocoder({
        success: function (res) {
          // console.log(res.result.address);
          that.setData({
            // address: res.result.address,
            activity_location: res.result.address
          });
          // console.log(that.data.address);
        },
        fail: function (res) {
          //console.log(res);
        },
        complete: function (res) {
          //console.log(res);
        }
      });
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
		var that = this;
    console.log(getApp().data.activity_location);//从position跳转过来，可以
    // console.log(this.data.address);
    location = getApp().data.activity_location;
    if (location != "") {
      that.setData({
        activity_location: location
        // activity_location: this.data.address//这个没用，可能onshow最先获取不到onLoad值
      });
    }
		let pages = getCurrentPages();
		let currPage = pages[pages.length - 1];
		if (currPage.data.addresschose) {
        this.setData({
            //将携带的参数赋值
            activity_location: currPage.data.addresschose
     	});
		}
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
	getLocation: function () {
    // wx.navigateTo({
    //   url: '/pages/addLocation/addLocation',
    // });
    wx.navigateTo({
      url: "/pages/position/position"
    });
  },

	imgdel(e){
		var that =this
		console.log(e.currentTarget.dataset.idx)
		wx.showModal({
			title: '提示',
			content: '确定要删除这张图片吗',
			success (res) {
				if (res.confirm) {
					console.log('用户点击确定')
					that.data.imgb.splice(e.currentTarget.dataset.idx,1)
					that.setData({
						imgb:that.data.imgb
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
		
	},
	scpic(){
		var that=this
		wx.chooseImage({
			count: 9,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success (res) {
				// tempFilePath可以作为img标签的src属性显示图片
				console.log(res)
				const tempFilePaths = res.tempFilePaths
				const imglen=that.data.imgb.length
				for(var i=0;i<tempFilePaths.length;i++){
					console.log(imglen)
					var newlen=Number(imglen)+Number(i)
					console.log(newlen)
					if(newlen==9){
						wx.showToast({
							icon:'none',
							title:'最多可上传九张'
						})
						break;
					}
          that.data.imgb.push(tempFilePaths[i])
          that.setData({
            imgb: that.data.imgb
          })
          return
					wx.uploadFile({
							url: app.IPurl+'/api/upload_image/upload', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[i],
							name: 'images',
							formData: {
								'module_name': 'used'
							},
							success (res){
								console.log(res.data)
								var ndata=JSON.parse(res.data)
								console.log(ndata)
								console.log(ndata.errcode==0)
								if(ndata.errcode==0){
									that.data.imgb.push(ndata.retData[0])
									that.setData({
										imgb:that.data.imgb
									})
								}else{
									wx.showToast({
										icon:"none",
										title:"上传失败"
									})
								}
							}
						})
					
				}
			}
		})
	},
	call(e){
		console.log(e.currentTarget.dataset.tel)
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.tel 
		})
	},
	subfuc1(e){
		var that =this
		if(that.data.imgb.length==0){
			wx.showToast({
				icon:'none',
				title:'请上传图片'
			})
			return
		}
		if(that.data.activity_location=='请选择地址'||that.data.activity_location==""){
			wx.showToast({
				icon:'none',
				title:'请上传图片'
			})
			return
		}
	}
})