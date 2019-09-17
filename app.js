//app.js
App({
	IPurl: 'http://smwx.800123456.top/api.aspx',
	IPurl1:'http://smwx.800123456.top/',
  onLaunch: function () {
    let that=this
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('userWxmsg')
    wx.removeStorageSync('tokenstr')
    wx.removeStorageSync('member')
    wx.removeStorageSync('zprice')
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log('16app'+JSON.stringify(res))
        // console.log(res.authSetting['scope.userInfo'])
        if (res.authSetting['scope.userInfo']==true) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log('已经授权')
    			wx.getUserInfo({
    				success(res) {
    					that.globalData.userInfo = res.userInfo
    					console.log(that.globalData.userInfo)
    					wx.setStorageSync('userInfo', res.userInfo)
    					if(!that.globalData.userInfo){
    						// wx.reLaunch({
    						//   url: '/pages/login/login',
    						//   fail: (err) => {
    						//     console.log("失败: " + JSON.stringify(err));
    						//   }
    						// })
    					}else{
    						// that.dologin()
                wx.login({
                  success: function (res) {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    var uinfo = that.globalData.userInfo
                    let data = {
                      key: 'server_mima',
                      code: res.code,
                      apipage: 'login',
                      nickname: uinfo.nickName,
                      headpicurl: uinfo.avatarUrl,
                      homeid: 1   //0用户端，1师傅端
                    }
                    let rcode = res.code
                    console.log(res.code)
                    wx.request({
                      url: that.IPurl,
                      data: data,
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      dataType: 'json',
                      method: 'POST',
                      success(res) {
                        console.log(res.data)
                        if (res.data.error == 0) {
                          console.log('登录成功')
                          wx.setStorageSync('tokenstr', res.data.tokenstr)
                          wx.setStorageSync('member', res.data.member)
                          wx.setStorageSync('zprice', res.data.price)
                        } else {
                          wx.removeStorageSync('userInfo')
                          wx.removeStorageSync('userWxmsg')
                          wx.removeStorageSync('tokenstr')
                          wx.removeStorageSync('member')
                          wx.removeStorageSync('zprice')
                          wx.showToast({
                            icon: 'none',
                            title: '登录失败',
                          })
                        }

                      },
                      fail() {
                        wx.showToast({
                          icon: 'none',
                          title: '登录失败'
                        })
                      }
                    })
                  }
                })
    					}
    				}
    			})
    			
        }else{
				  // wx.reLaunch({
				  //     url: '/pages/login/login',
				  //     fail: (err) => {
				  //       console.log("失败: " + JSON.stringify(err));
				  //     }
    			// })
        }
      }
    })
  },
	dologin(type){
		let that =this
		wx.login({
		  success: function (res) {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
	      var uinfo = that.globalData.userInfo
		    let data = {
					key:'server_mima',
					code:res.code,
	        apipage:'login',
	        nickname: uinfo.nickName,
	        headpicurl: uinfo.avatarUrl,
	        homeid: 1   //0用户端，1师傅端
		    }
				let rcode=res.code
				console.log(res.code)
				wx.request({
					url:  that.IPurl,
					data: data,
					header: {
						'content-type': 'application/x-www-form-urlencoded' 
					},
					dataType:'json',
					method:'POST',
					success(res) {
						console.log(res.data)
						if(res.data.error==0){
	            console.log('登录成功')
	            wx.setStorageSync('tokenstr', res.data.tokenstr)
              wx.setStorageSync('member', res.data.member)
	            wx.setStorageSync('zprice', res.data.price)
              setTimeout(function () {
                if (getCurrentPages().length != 0) {
                  getCurrentPages()[getCurrentPages().length - 1].onLoad()
                }
              }, 0)
	            // wx.setStorageSync('login', 'login')
	            // wx.setStorageSync('morenaddress', res.data.user_member_shopping_address)
	            // wx.setStorageSync('appcode', rcode)
							if(type=='shouquan'){
								// wx.reLaunch({
								//   url: '/pages/index/index',
								//   fail: (err) => {
								//     console.log("失败: " + JSON.stringify(err));
								//   }
								// })
                wx.navigateBack()
							}
							
							
							
						}else{
              wx.removeStorageSync('userInfo')
              wx.removeStorageSync('userWxmsg')
              wx.removeStorageSync('tokenstr')
              wx.removeStorageSync('member')
              wx.removeStorageSync('zprice')
	            wx.showToast({
	              icon:'none',
	              title: '登录失败',
	            })
	          }
					
					},
					fail() {
						wx.showToast({
							icon:'none',
							title:'登录失败'
						})
					}
				})
		  }
		})
	},
	jump(e){
		console.log(e)
		wx.navigateTo({
			url:e.currentTarget.dataset.url
		})
	},
	retry(tit){
		wx.setNavigationBarTitle({
		  title: '加载中...',
		  success: function(res) {},
		  fail: function(res) {},
		  complete: function(res) {},
		})
		if (getCurrentPages().length != 0) {
		  getCurrentPages()[getCurrentPages().length - 1].onLoad()
		  getCurrentPages()[getCurrentPages().length - 1].onShow()
		}
		setTimeout(function(){
			wx.setNavigationBarTitle({
			  title: tit,
			})
		},1000)
	},
  globalData: {
    userInfo: null
  },
  pveimg(current,urls) {
    let urls1 = []
    if (urls) {
      urls1 = urls
      
    } else {
      urls1[0] = current
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls1 // 需要预览的图片http链接列表
    })
  },
	data: {
			haveLocation: false,
			activity_lat: -1,
			activity_lng: -1,
			activity_location: ""
	}
})