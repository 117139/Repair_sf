// pages/renzheng/renzheng.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'member': wx.getStorageSync('member'),
    yzm:'',
		setstate:0,
		time:60,
		tel:'',
		sex:1,
		items: [
      {name: '0', value: '家电维修0'},
      {name: '1', value: '家电维修1', checked: 'true'},
      {name: '12', value: '家电维修12'},
      {name: '3', value: '家电维修3'},
      {name: '45', value: '家电维修45'},
      {name: '999', value: '家电维修999'},
    ],
		index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gettype()
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
	bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
	checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
	sexfuc(e){
		console.log(e)
		this.setData({
			sex:e.currentTarget.dataset.sex
		})
	},
	oniptblur(e){
		console.log(e.detail.value)
		this.setData({
			tel:e.detail.value
		})
	},
  
	getcode(){
		let that =this
		
		if(that.data.tel=='' || !(/^1\d{10}$/.test(that.data.tel))){
			wx.showToast({
				icon:'none',
				title:'手机号有误'
			})
			return 
		}
		if(that.data.btnkg==1){
			return
		}else{
			that.setData({
				btnkg:1
			})
		}
    //'apipage': 'sendcode', "op": "reg", 'tel': vm.usertel
    wx.request({
      url: app.IPurl,
      data: {
        'apipage': 'sendcode',
        "op": "reg", 
        'tel': that.data.tel,
        "tokenstr": wx.getStorageSync('tokenstr').tokenstr
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'get',
      success(res) {
        wx.hideLoading()
        console.log(res.data)


        if (res.data.error == 0) {

          wx.showToast({
            icon: 'none',
            title: '发送成功',
            duration: 1000
          })
          that.setData({
            yzm: res.data.code.substr(0, 4)
          })
          that.codetime()
        } else {
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
      fail() {
        that.setData({
          btnkg: 0
        })
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '操作失败'
        })
      }
    })
	
    
	},
	codetime(){
		let that =this
		let time=60
		let st=setInterval(function(){
		    if(time==0){
		        that.setData({
							setstate:0,
						})
		        clearInterval(st);
		    }else{
		        let news=time--;
						// console.log(news)
						that.setData({
							setstate:1,
							time:news
						})
		        
		    }
		},1000);
	},
	//提交表单
	formSubmit(e) {
		console.log(app.globalData.userInfo)
		let uinfo=app.globalData.userInfo
		let that =this
	  console.log('form发生了submit事件，携带数据为：', e.detail.value)
		let formresult=e.detail.value
		if (formresult.name=='') {
			wx.showToast({
				title: '姓名不能为空',
				duration: 2000,
				icon:'none'
			});
			return false;
		}
		if (!(/^1\d{10}$/.test(formresult.tel))) {
			wx.showToast({
				title: '手机号码有误',
				duration: 2000,
				icon:'none'
			});
			return false;
    }
    if (formresult.code == '') {
      wx.showToast({
        title: '验证码不能为空',
        duration: 2000,
        icon: 'none'
      });
      return false;
    }
    if (formresult.code !== that.data.yzm) {
      wx.showToast({
        title: '验证码错误',
        duration: 2000,
        icon: 'none'
      });
      return false;
    }
    if (formresult.catid == '') {
      wx.showToast({
        title: '身份证不能为空',
        duration: 2000,
        icon: 'none'
      });
      return false;
    }
    if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(formresult.carid))) {

      wx.showToast({
        title: '身份证号码有误',
        duration: 2000,
        icon: 'none'
      });

      return false;

    }
    if (formresult.shanchang == '') {
      wx.showToast({
        title: '擅长不能为空',
        duration: 2000,
        icon: 'none'
      });
      return false;
    }
	
    wx.showModal({
      title: '提示',
      content: '信息提交后将不可更改，请确认无误后进行提交',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '正在提交',
          })
          wx.request({
            url: app.IPurl,
            data: {
              apipage: 'edituserinfo',
              realname: formresult.name,
              sex: formresult.sex,
              phone: formresult.tel,
              idcard: formresult.carid,
              usersign: formresult.shanchang,
              "tokenstr": wx.getStorageSync('tokenstr').tokenstr
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
            method: 'POST',
            success(res) {
              // wx.hideLoading()
              console.log(res.data)


              if (res.data.error == 0) {

                wx.showToast({
                  icon: 'none',
                  title: '提交成功',
                  duration: 2000
                })
                app.dologin()
                setTimeout(function () {
                  wx.navigateBack()
                }, 1000)

              } else {
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
            fail() {
              // wx.hideLoading()
              wx.showToast({
                icon: 'none',
                title: '操作失败'
              })
            },
            complete(){
              wx.hideLoading()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

	},
  gettype() {
    var that = this
    wx.request({
      url: app.IPurl,
      data: {
        apipage: "shop",
        op: "grouplist",
        // tokenstr:wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'get',
      success(res) {
        console.log(res.data)
        if (res.data.list.length == 0) {  //数据为空
          wx.showToast({
            icon: 'none',
            title: '暂无擅长分类'
          })
        } else if (res.data.list.length > 0) {                           //数据不为空
          that.setData({
            items: res.data.list
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '加载失败'
          })
        }
      },
      fail() {
        wx.showToast({
          icon: 'none',
          title: '加载失败'
        })
      },
      complete() {
      }
    })
  },
})