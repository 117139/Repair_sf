// pages/index/index.js
var htmlStatus = require('../../utils/htmlStatus/index.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
		rw_data:[
		]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    
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
    var that =this
    that.setData({
      page: 1,
      rw_data: []
    })
    if (!wx.getStorageSync('userInfo')) {
      setTimeout(function () {
        console.log('onshow')
        that.getOrderList('onShow')
      }, 1000)
    }else{
      that.getOrderList('onShow')
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
    console.log('下拉')
    this.setData({
      page: 1,
      rw_data: []
    })
    this.getOrderList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    this.getOrderList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
	jump(e){
		app.jump(e)
	},
  //接单
	order(e){
		console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    var that =this
    if (!wx.getStorageSync('member').Phone) {
      wx.showModal({
        title: '提示',
        content: '请先绑定用户信息',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: "/pages/renzheng/renzheng"
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    if (wx.getStorageSync('member').IdCard_Confirm !== 1){
      wx.showToast({
        icon:'none',
        title:'您的身份认证还未通过审核无法接单'
      })
      return
    }
    wx.request({
      url: app.IPurl,
      data: {
        apipage: 'smwx',
        'op': 'order_taskget',
        'id': id,
        "tokenstr": wx.getStorageSync('tokenstr').tokenstr
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'get',
      success(res) {
        console.log(res.data)
        that.setData({
          btnkg: 0
        })
        if (res.data.error == 0) {
          wx.showToast({
            icon:"none",
            title: '接单成功'
          })
          setTimeout(function(){
            that.setData({
              page: 1,
              rw_data: []
            })
            that.getOrderList()
          },500)

        } else {
          if (res.data.returnstr) {
            wx.showToast({
              title: res.data.returnstr,
              duration: 2000,
              icon: 'none'
            });
          } else {
            wx.showToast({
              title: '网络异常',
              duration: 2000,
              icon: 'none'
            });
          }
        }
      },
      fail() {
        that.setData({
          btnkg: 0
        })
        wx.showToast({
          title: '网络异常',
          duration: 2000,
          icon: 'none'
        });
      }
    })
	},
  //获取列表
  getOrderList(ttype) {

    let that = this
    const htmlStatus1 = htmlStatus.default(that)
    console.log('获取列表')
    if (!wx.getStorageSync('userInfo')) {
      htmlStatus1.dataNull()
      wx.setNavigationBarTitle({
        title: '首页'
      })
      return
    }
    wx.setNavigationBarTitle({
      title: '加载中...',
    })
    wx.request({
      url: app.IPurl,
      data: {
        apipage: 'smwx',
        "tokenstr": wx.getStorageSync('tokenstr').tokenstr,
        op: 'orderlist_index',
        "pageindex": that.data.page,
        "pagesize": "20"
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
          console.log(ttype)
          let resultd = res.data.list
          if (res.data.list.length == 0) {  //数据为空
            if (that.data.page == 1) {      //第一次加载
              htmlStatus1.dataNull()    // 切换为空数据状态
            } else {
              wx.showToast({
                icon: 'none',
                title: '暂无更多数据'
              })
            }

          } else {                           //数据不为空
            if (that.data.page == 1){
              that.data.rw_data = resultd
            }else{
              that.data.rw_data = that.data.rw_data.concat(resultd)
            }
           
            that.data.page++
            that.setData({
              rw_data: that.data.rw_data,
            })
            console.log(that.data.rw_data)
            htmlStatus1.finish()    // 切换为finish状态
          }
          // console.log(res.data.list)


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
          title: '首页'
        })
      }
    })
  },
})