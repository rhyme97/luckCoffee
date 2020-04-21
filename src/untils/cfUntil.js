export const randomArr = (num,length) => {
  let rng = []
  for (let i = 0; i< num; i++) {
    let a = parseInt(Math.random()*length)
    rng.push(a)
    a = length - 1
    length--
  }
  return [...rng]
}

export const createHotSell = (key,result) => {
  return result[key]
}

export const changeData = item=>{
	switch(item.defaultMilk){
        case '1':item.defaultMilk = '默认奶油' ;break;
        case '2':item.defaultMilk = '半份奶' ;break;
        case '3':item.defaultMilk = '双份奶'; break;
        case '4':item.defaultMilk = '无奶';break;
        case null:item.defaultMilk = '.'
    }
    switch(item.defaultSugar){
    	case '1':item.defaultSugar = '无糖'; break;
    	case '2':item.defaultSugar = '半糖'; break;
    	case '3':item.defaultSugar = '全糖' ;break;
    	case null:item.defaultSugar = '.'
    }
    switch(item.defaultTemperature){
    	case '1':item.defaultTemperature = '冷'; break;
    	case '2':item.defaultTemperature = '热';break;
    	case null:item.defaultTemperature = '.'
    }
    return item
}

export const getvaluefromStore = (key) => {
	return new Promise((resolve,reject) => {
		uni.getStorage({
			key: key,
			success(data) {
				resolve(data)
			},
			fail(err){
				reject(err)
			}
		})
	})
}

export const request = ({url,method,data}) => {
	return new Promise((resolve) => {
		uni.request({
			url,
			method,
			data,
			success(res) {
				resolve(res)
			}
		})
	})
}
