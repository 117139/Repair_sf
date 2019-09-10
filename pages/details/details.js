// pages/details/details.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var location = "";
var config = require('../../config.js');

var htmlStatus = require('../../utils/htmlStatus/index.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ldata: '',
    o_id:'',
    xqData:'',
		activity_location:'请选择地址',
		imgb:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   if(options.id){
     this.setData({
       o_id: options.id
     })
     this.getData(options.id)
   }
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
    wx.getSetting({
      success: (res) => {
        console.log(res.authSetting['scope.userLocation'])
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
         that.setData({
           ldata:false
         })
        } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
          // that.getLocation(that);
          that.setData({
            ldata: false
          })
        }
        else { //授权后默认加载
          console.log('授权后默认加载')
          // that.getLocation(that);
          that.setData({
            ldata: true
          })
        }
      }
    })
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
  handler: function (e) {
    var that = this;
    if (!e.detail.authSetting['scope.userLocation']) {
      that.setData({
        ldata: false
      })
    } else {
      that.setData({
        ldata: true,
      })
      that.getLocation(that);
      /*wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude

          that.setData({
            latitude: latitude,
            longitude: longitude
          })
          wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 28
          })
        }
      })*/
    }
  },
  
  //判断获取地址授权
  again_getLocation: function () {
    let that = this;
    // 获取位置信息
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
            success: function (res) {
              console.log(res)
              if (res.cancel) {
                that.setData({
                  isshowCIty: false
                })
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    console.log(dataAu)
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用getLocationt的API
                      that.getLocation(that);
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
          that.getLocation(that);
        }
        else { //授权后默认加载
          that.getLocation(that);
        }
      }
    })

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
  scpic() {
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const tempFilePaths = res.tempFilePaths
        const imglen = that.data.imgb.length
        for (var i = 0; i < tempFilePaths.length; i++) {
          console.log(imglen)
          var newlen = Number(imglen) + Number(i)
          console.log(newlen)
          if (newlen == 9) {
            wx.showToast({
              icon: 'none',
              title: '最多可上传九张'
            })
            break;
          }
          wx.uploadFile({
            url: app.IPurl, //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'upfile',
            formData: {
              'apipage': 'uppic',
              // "tokenstr": wx.getStorageSync('tokenstr').tokenstr, 
            },
            success(res) {
              console.log(res.data)
              var ndata = JSON.parse(res.data)
              console.log(ndata)
              console.log(ndata.error == 0)
              if (ndata.error == 0) {
                that.data.imgb.push(ndata.url)
                that.setData({
                  imgb: that.data.imgb
                })
              } else {
                wx.showToast({
                  icon: "none",
                  title: "上传失败"
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
  getData(id){
    let that = this
    const htmlStatus1 = htmlStatus.default(that)
    wx.request({
      url: app.IPurl,
      data: {
        apipage: 'smwx',
        "tokenstr": wx.getStorageSync('tokenstr').tokenstr,
        op: 'orderinfo',
        "out_trade_no": id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'get',
      success(res) {
        if (res.data.error == 0) {   //成功
          console.log(res.data)
          that.setData({
            xqData: res.data.data,
          })
          // console.log(that.data.xqData)
          htmlStatus1.finish()    // 切换为finish状态


        } else {  //失败
          if (res.data.returnstr) {
            wx.showToast({
              icon: 'none',
              title: res.data.returnstr
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '加载失败'
            })
          }
          htmlStatus1.error()    // 切换为error状态
        }

        // htmlStatus1.error()    // 切换为error状态
      },
      fail(err) {
        wx.showToast({
          icon: "none",
          title: "加载失败"
        })

        console.log(err)
        htmlStatus1.error()    // 切换为error状态
      },
      complete() {
        wx.setNavigationBarTitle({
          title: '订单详情'
        })
      }
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