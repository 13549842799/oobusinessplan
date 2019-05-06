import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/Login'
import IndexPage from '@/components/Index'
import SystemAuthority from '@/components/system/SystemAuthority'
import Article from '@/components/my/article/Article'
import Diary from '@/components/my/article/diary/Diary'
import Classify from '@/components/my/article/classify/Classify'
import DiaryEdit from '@/components/my/article/diary/DiaryEdit'
import Label from '@/components/my/article/label/Label'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexPage,
      children: [
        {
          path: 'Home',
          name: 'home',
          component: Home
        },
        {
          path: 'System/Authority',
          name: 'systemAuthority',
          component: SystemAuthority
        },
        {
          path: 'My/Article',
          name: 'personalArticle',
          component: Article,
          children: [
            {
              path: 'Label',
              name: 'label',
              component: Label,
              meta: {name: '标签管理'}
            },
            {
              path: 'Diary',
              name: 'diary',
              component: Diary
            },
            {
              path: 'Classify',
              name: 'classify',
              component: Classify,
              props: true,
              meta: {name: '分类管理'}
            },
            {
              path: '/My/Article/Diary/edit/:diaryOrder?',
              name: 'diaryEdit',
              component: DiaryEdit,
              props: true
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
