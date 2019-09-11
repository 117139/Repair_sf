// pages/tixian/tixian.js
const app=getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		money: '',
    skimg:''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
    this.setData({
      'member': wx.getStorageSync('member'),
      'zprice': wx.getStorageSync('zprice'),
    })
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	},
  moneyall(){
    this.setData({
      money: this.data.zprice
    })
  },
	oniptblur(e) {
		console.log(e.detail.value)
		this.setData({
			money: e.detail.value
		})
	},
	txfuc() {
    var that = this
    if (!that.data.skimg) {
      wx.showToast({
        icon: "none",
        title: '请上传收款码'
      })
      return
    }
    if (!that.data.money || that.data.money==0) {
      wx.showToast({
        icon: "none",
        title: '请输入提现金额'
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
    wx.request({
      url: app.IPurl,
      data: {
        apipage: 'tixian',
        "tokenstr": wx.getStorageSync('tokenstr').tokenstr,
        price: that.data.money,
        pics: that.data.skimg
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
            that.setData({
              btnkg: 0
            })
            wx.navigateBack()
          }, 1000)

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
        // wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '操作失败'
        })
      }
    })
	},
  scpic() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.IPurl, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
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
              // that.data.imgb.push(ndata.url)
              that.setData({
                skimg: ndata.url
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
    })
  },
})
