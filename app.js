// 載入express、express-handlebars、餐廳名單JSON檔
const express = require('express')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const app = express()

// 設定預設的port
const port = 3000

// 設定為handlebars引擎
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 設定靜態檔案的位置
app.use(express.static('public'))

// 設定路由
// (主頁) : 把資料帶入 handlebars 樣板中動態呈現
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

// (餐廳資訊) : 應用 params 打造動態路由
app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.id)
  res.render('show', { restaurant: restaurant })
})

// 搜尋功能(Query String)
app.get('/search', (req, res) => {
  let keyword = req.query.keyword.trim()    // 避免使用者輸入多餘的空格
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })
  // 搜尋沒有結果時也有對應頁面提示
  if (!restaurants || restaurants.length === 0) {
    keyword = `找不到此餐廳，請重新輸入關鍵字! `
  }
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

// 監聽
app.listen(port, () => {
  console.log(`server: http://localhost:${port}`)
})