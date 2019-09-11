// pages/caiwu/caiwu.js
var htmlStatus = require('../../utils/htmlStatus/index.js')
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		type:[
			'全部',
			'提现',
			'收益',
		],
		tidx:0,
    page:1,
    pagesize:20,
		cw_data:[
				[
					{
						name:'空调维修',
						pri:'+20元',
						time:'今天 15:26',
						inr:'材料费提成'
					},
					{
						name:'空调维修',
						pri:'+20元',
						time:'今天 15:26',
						inr:'材料费提成'
					},
					{
						name:'提现',
						pri:'+20元',
						time:'2019.08.14 12:00',
						inr:''
					},
					{
						name:'提现',
						pri:'+20元',
						time:'2019.08.14 12:00',
						inr:''
					},
				],
				[],
				[],
		],
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
    var pages = [1, 1, 1]
    var cw_data = [[], [], []]
    this.data.cw_data = cw_data
    this.setData({
      pages: pages,
      cw_data: this.data.cw_data
    })
    this.getOrderList('onshow')
  },
  retry(){
    var pages = [1, 1, 1]
    var cw_data = [[], [], []]
    this.data.cw_data = cw_data
    this.setData({
      pages: pages,
      cw_data: this.data.cw_data
    })
    this.getOrderList('onshow')
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
    this.retry()
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
	bindcur(e){
		var that =this
	  console.log(e.currentTarget.dataset.type)
	  that.setData({
	    tidx: e.currentTarget.dataset.type
	  })
    const htmlStatus1 = htmlStatus.default(that)
    htmlStatus1.finish()
		// that.getOrderList()
    if (that.data.cw_data[that.data.tidx].length==0){
			that.getOrderList()
		}
	},
  //获取列表
  getOrderList(ttype) {

    let that = this
    const htmlStatus1 = htmlStatus.default(that)
    console.log('获取列表')
    if (!wx.getStorageSync('userInfo')) {
      htmlStatus1.dataNull()
      return
    }
    // return
    /*typestr
      =t  (提现)
      =s  收益
      不传获取全部*/
      var typestr1
      if (that.data.tidx == 1) {
        typestr1 = 't'
      } else if (that.data.tidx == 2) {
        typestr1 = 's'
      }else{
        
      }
    wx.request({
      url: app.IPurl,
      data: {
        apipage: 'smwx',
        "tokenstr": wx.getStorageSync('tokenstr').tokenstr,
        apipage: 'priceinfo',
        pageindex: that.data.pages[that.data.tidx],
        pagesize: that.data.pagesize,
        typestr: typestr1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'get',
      success(res) {
        if (res.data.error == 0) {   //成功
          let resultd = res.data.datalist
          if (ttype == 'onshow') {
            var pages = [1, 1, 1]
            var cw_data = [[], [], [],]
            that.data.cw_data = cw_data
          }

          if (res.data.datalist.length == 0) {  //数据为空
            if (that.data.pages[that.data.tidx] == 1) {      //第一次加载
              htmlStatus1.dataNull()    // 切换为空数据状态
            } else {
              wx.showToast({
                icon: 'none',
                title: '暂无更多数据'
              })
            }

          } else {                           //数据不为空
            that.data.cw_data[that.data.tidx] = that.data.cw_data[that.data.tidx].concat(resultd)
            that.data.pages[that.data.tidx]++
            that.setData({
              cw_data: that.data.cw_data,
              pages: that.data.pages,
            })
            console.log(that.data.cw_data)
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
        // 停止下拉动作
        wx.stopPullDownRefresh();
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
          title: '财务记录'
        })
      }
    })
  },
})