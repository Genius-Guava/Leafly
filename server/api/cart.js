const router = require('express').Router()
const {Order, LineItem, Plant, User} = require('../db/models')
module.exports = router

const isLoggedIn = (req, res, next) =>
  req.user ? next() : res.send('Please log in')

//localhost:8080/api/cart
router.get('/', isLoggedIn, async (req, res, next) => {
  // console.log(req.user)
  const cart = await Order.findOne({
    include: {
      model: Plant
    },
    where: {
      status: 'In Cart',
      userId: req.user.id
    }
  })
  // console.log('CART',cart)
  if (cart) {
    res.json(cart)
  } else {
    console.log('Cart is currently empty.')
    res.json('Cart is currently empty.')
  }
})

router.put('/', async (req, res, next) => {
  console.log('try not working')
  try {
    console.log('attempting to add')
    const cart = await Order.findOrCreate({
      where: {
        status: 'In Cart',
        userId: req.user.id
      }
    })

    const item = await LineItem.findOne({
      where: {
        plantId: req.body.id,
        orderId: cart[0].id
      }
    })

    if (item) {
      const newQuant = item.quantity + 1
      item.update({quantity: newQuant})
    } else {
      await LineItem.create({
        plantId: req.body.id,
        orderId: cart[0].id
      })
    }
    // the blink doesnt happen if I do newOrder but happens if I do cart - why? (ask during code review)
    // const newCart= await Order.findOne({
    //   where: {
    //     status: 'In Cart',
    //     userId: req.user.id
    //   },
    //   include: {
    //     model: Plant
    //   }
    // })
    res.json(cart)
  } catch (err) {
    next(err)
  }
})

router.put('/checkout', async (req, res, next) => {
  try {
    const cart = await Order.findByPk(req.body.cartId)
    await cart.update({status: 'Past'})
    res.json(cart)
  } catch (err) {
    next(err)
  }
})

router.delete('/', async (req, res, next) => {
  try {
    const cart = await Order.findOne({
      where: {
        status: 'In Cart',
        userId: req.user.id
      }
    })
    console.log(req.body)
    if (cart) {
      const deletedItem = await LineItem.findAll({
        where: {
          plantId: req.body.plantId,
          orderId: cart.id
        }
      })
      await deletedItem[0].destroy()
    }
    res.json(cart)
  } catch (err) {
    next(err)
  }
})
