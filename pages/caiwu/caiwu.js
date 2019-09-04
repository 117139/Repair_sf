// pages/caiwu/caiwu.js
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
	bindcur(e){
		var that =this
	  console.log(e.currentTarget.dataset.type)
	  that.setData({
	    tidx: e.currentTarget.dataset.type
	  })
		return
		// that.getOrderList()
		if(that.data.goods[that.data.type].length==0){
			that.getOrderList()
		}
	},
})