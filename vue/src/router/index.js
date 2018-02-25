import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/view/GoodsList'
import cart from '@/view/cart'
import address from '../view/address'
import orderConfirm from '../view/orderConfirm'
import orderSuccess from '../view/orderSuccess'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
    	path:'/cart',
    	name: 'cart',
    	component: cart
    },
    {
      path:'/address',
      name: 'address',
      component: address
    },
    {
      path:'/orderConfirm',
      name: 'orderConfirm',
      component: orderConfirm
    },
    {
      path:'/orderSuccess',
      name: 'orderSuccess',
      component: orderSuccess
    }
  ]
})
