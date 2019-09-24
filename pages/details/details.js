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
		imgb:[],
    pjpri:0,
    wxpri:0,
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
           console.log(res.result.address);
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
    // console.log(getApp().data.activity_location);//从position跳转过来，可以
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
      this.setData({//将携带的参数赋值
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
    this.getData(this.data.o_id)
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
      // 调用接口
      // 实例化API核心类
      qqmapsdk = new QQMapWX({
        //此key需要用户自己申请
        key: 'FORBZ-KIPEF-WECJR-NFZKA-MREDV-FCF3O'
      });
      qqmapsdk.reverseGeocoder({
        success: function (res) {
          console.log(res.result.address);
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
      // that.getLocation(that);
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
    var that = this;
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
                      // 调用接口
                      // 实例化API核心类
                      qqmapsdk = new QQMapWX({
                        //此key需要用户自己申请
                        key: 'FORBZ-KIPEF-WECJR-NFZKA-MREDV-FCF3O'
                      });
                      qqmapsdk.reverseGeocoder({
                        success: function (res) {
                          console.log(res.result.address);
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
                      //再次授权，调用getLocationt的API
                      //that.getLocation(that);
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
          
          // 实例化API核心类
          qqmapsdk = new QQMapWX({
            //此key需要用户自己申请
            key: 'FORBZ-KIPEF-WECJR-NFZKA-MREDV-FCF3O'
          });
          // 调用接口
          qqmapsdk.reverseGeocoder({
            success: function (res) {
              console.log(res.result.address);
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
          // that.getLocation(that);
        }
        else { //授权后默认加载
        console.log(1)
          // 调用接口
          qqmapsdk = new QQMapWX({
            key: 'FORBZ-KIPEF-WECJR-NFZKA-MREDV-FCF3O'
          });
          qqmapsdk.reverseGeocoder({
            success: function (res) {
              console.log(res.result.address);
              that.setData({
                // address: res.result.address,
                activity_location: res.result.address
              });
              // console.log(that.data.address);
            },
            fail: function (res) {
              console.log(res);

            },
            complete: function (res) {
              //console.log(res);
            }
          });
          // that.getLocation(that);
        }
      }
    })

  },
	getLocation: function () {
    // wx.navigateTo({
    //   url: '/pages/addLocation/addLocation',
    // });
    this.moveToLocation()
    // wx.navigateTo({
    //   url: "/pages/position/position"
    // });
  },
  //移动选点
  moveToLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res.name);
        that.setData({
          activity_location: res.name
        })
        //选择地点之后返回到原来页面
        // wx.navigateTo({
        //   url: "/pages/index/index?address="+res.name
        // });
        // var pages = getCurrentPages();   //当前页面
        // var prevPage = pages[pages.length - 2];   //上一页面
        // prevPage.setData({
        //   //直接给上一个页面赋值
        //   addresschose: res.name,
        // });

        // wx.navigateBack({
        //   //返回
        //   delta: 1
        // })
        // // wx.navigateBack()
      },
      fail: function (err) {
        console.log(err)
      }
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
      sourceType: ['camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const tempFilePaths = res.tempFilePaths
        // that.setData({
        //   img1: tempFilePaths
        // })
        const imglen = that.data.imgb.length
        that.upimg(tempFilePaths,0)
        /*for (var i = 0; i < tempFilePaths.length; i++) {
          var newlen = Number(imglen) + Number(i)
          if (newlen == 9) {
            wx.showToast({
              icon: 'none',
              title: '最多可上传九张'
            })
            break;
          }
         (function(i){
           setTimeout(function () {
             that.upimg(tempFilePaths[i], i)
           }, 10000)
         }(i))
          

        }*/
      }
    })
  },
  upimg(imgs,i) {
    var that = this
    const imglen = that.data.imgb.length
    var newlen = Number(imglen) + Number(i)
    if (imglen == 9) {
      wx.showToast({
        icon: 'none',
        title: '最多可上传九张'
      })
      return
    }
    // console.log(img1)
    wx.uploadFile({
      url: app.IPurl, //仅为示例，非真实的接口地址
      filePath: imgs[i],
      name: 'upfile',
      formData: {
        'apipage': 'uppic',
      },
      success(res) {
        // console.log(res.data)
        var ndata = JSON.parse(res.data)
        // console.log(ndata)
        // console.log(ndata.error == 0)
        if (ndata.error == 0) {
          console.log(imgs[i], i, ndata.url)
          var newdata = that.data.imgb
          console.log(i)
          newdata.push(ndata.url)
          that.setData({
            imgb: newdata
          })
          
          var news1=that.data.imgb.length
          if (news1<9){
            i++
            that.upimg(imgs, i)
          }
          
        } else {
          wx.showToast({
            icon: "none",
            title: "上传失败"
          })
        }
      }
    })
  },
  /*upimg(img1,i){
    var that =this
    // console.log(img1)
      wx.uploadFile({
        url: app.IPurl, //仅为示例，非真实的接口地址
        filePath: img1,
        name: 'upfile',
        formData: {
          'apipage': 'uppic',
        },
        success(res) {
          // console.log(res.data)
          var ndata = JSON.parse(res.data)
          // console.log(ndata)
          // console.log(ndata.error == 0)
          if (ndata.error == 0) {
            console.log(img1, i, ndata.url)
            var newdata = that.data.imgb
            console.log(i)
            newdata.push(ndata.url)
            that.setData({
              imgb: newdata
            })
          } else {
            wx.showToast({
              icon: "none",
              title: "上传失败"
            })
          }
        }
      })
  },*/
  /*scpic() {
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
  },*/
	call(e){
		console.log(e.currentTarget.dataset.tel)
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.tel 
		})
	},
  getData(id){
    wx.setNavigationBarTitle({
      title: '加载中...'
    })
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
        // 停止下拉动作
        wx.stopPullDownRefresh();
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
  price1(e) { 
    this.setData({
      pjpri: e.detail.value
    })
  },
  price2(e){
    this.setData({
      wxpri: e.detail.value
    })
  },
	subfuc1(e){
		var that =this
    console.log(that.data.imgb)
    console.log(that.data.imgb.length)
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
        title:'请选择地址'
			})
			return
		}
    var imbox = that.data.imgb
    imbox = imbox.join(',')
    if(that.data.btnkg==1){
      return
    }else{
      that.setData({
        btnkg:1
      })
    }
    wx.request({
      url: app.IPurl,
      data: {
        apipage: 'smwx',
        "tokenstr": wx.getStorageSync('tokenstr').tokenstr,
        op: 'orderlist_lbs_price',
        "id": that.data.xqData.id,
        task_pics: imbox ,    //图片
        task_address: that.data.activity_location, //地址
        price1: '', //配件费
        price2: '', //维修费
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'get',
      success(res) {
        if (res.data.error == 0) {   //成功
          console.log(res.data)
         wx.showToast({
           icon:"none",
           title: '提交成功',
         })
          setTimeout(function(){
            that.setData({
              btnkg: 0
            })
            var id = that.data.o_id
            that.getData(id)
          },500)
        } else {  //失败
          that.setData({
            btnkg: 0
          })
          if (res.data.returnstr) {
            wx.showToast({
              icon: 'none',
              title: res.data.returnstr
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '操作失败'
            })
          }
        }
      },
      fail(err) {
        that.setData({
          btnkg: 0
        })
        wx.showToast({
          icon: "none",
          title: "操作失败"
        })

        console.log(err)
      }
    })
	},

  subfuc2(e) {
    var that = this

    if (that.data.pjpri == 0) {
      wx.showToast({
        icon: 'none',
        title: '请输入配件费用'
      })
      return
    }
    if (that.data.wxpri == 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择维修费用址'
      })
      return
    }

    if (that.data.btnkg == 1) {
      return
    } else {
      that.setData({
        btnkg: 1
      })
    }
    wx.request({
      url: app.IPurl,
      data: {
        apipage: 'smwx',
        "tokenstr": wx.getStorageSync('tokenstr').tokenstr,
        op: 'orderlist_lbs_price',
        "id": that.data.xqData.id,
        price1: that.data.pjpri, //配件费
        price2: that.data.wxpri, //维修费
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'get',
      success(res) {
        if (res.data.error == 0) {   //成功
          console.log(res.data)
          wx.showToast({
            icon: "none",
            title: '提交成功',
          })
          setTimeout(function () {
            that.setData({
              btnkg: 0
            })
            var id = that.data.o_id
            that.getData(id)
          }, 500)
        } else {  //失败
          that.setData({
            btnkg: 0
          })
          if (res.data.returnstr) {
            wx.showToast({
              icon: 'none',
              title: res.data.returnstr
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '操作失败'
            })
          }
        }
      },
      fail(err) {
        that.setData({
          btnkg: 0
        })
        wx.showToast({
          icon: "none",
          title: "操作失败"
        })

        console.log(err)
      }
    })
  },
  subfuc3(e) {
    var that = this

    wx.showModal({
      title: '提示',
      content: '是否确定完成服务',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.IPurl,
            data: {
              apipage: 'smwx',
              "tokenstr": wx.getStorageSync('tokenstr').tokenstr,
              op: 'order_taskover',
              "out_trade_no": that.data.xqData.out_trade_no,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
            method: 'get',
            success(res) {
              if (res.data.error == 0) {   //成功
                console.log(res.data)
                wx.showToast({
                  icon: "none",
                  title: '操作成功',
                })
                setTimeout(function () {
                  that.setData({
                    btnkg: 0
                  })
                  var id = that.data.o_id
                  that.getData(id)
                }, 500)
              } else {  //失败
                that.setData({
                  btnkg: 0
                })
                if (res.data.returnstr) {
                  wx.showToast({
                    icon: 'none',
                    title: res.data.returnstr
                  })
                } else {
                  wx.showToast({
                    icon: 'none',
                    title: '操作失败'
                  })
                }
              }
            },
            fail(err) {
              that.setData({
                btnkg: 0
              })
              wx.showToast({
                icon: "none",
                title: "操作失败"
              })

              console.log(err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  jump(e){
    app.jump(e)
  },
  pveimg(e){
    var curr = e.currentTarget.dataset.src
    var urls = e.currentTarget.dataset.array
    app.pveimg(curr, urls)
  }
})