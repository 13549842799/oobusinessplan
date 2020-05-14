import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/Login'
import IndexPage from '@/components/Index'
import EmployeeSys from '@/components/employee/EmployeeSys'
import AdminSys from '@/components/employee/AdminSys'
import Center from '@/components/my/center/PersonalCenter'
import Admin from '@/components/my/center/admin'
import Employee from '@/components/my/center/employee'
import Article from '@/components/my/article/Article'
import Classify from '@/components/article/classify/Classify'
import Label from '@/components/article/label/Label'
import SystemQuartz from '@/components/system/SystemQuartz'
import DiaryReader from '@/components/article/diary/DiaryReader'
import Memo from '@/components/article/memo/Memo'

Vue.use(Router)

const SystemAuthority = () => import('@/components/system/SystemAuthority')
const PortionList = () => import('@/components/my/article/novel/PortionList')

// 20200416
const SystemResources = () => import('@/components/system/resources/SystemResources')
const SystemAuthorities = () => import('@/components/system/authorities/SystemAuthorities')
const SystemRoles = () => import('@/components/system/roles/SystemRoles')
const SystemUsers = () => import('@/components/system/users/SystemUsers')

const Diary = () => import('@/components/article/diary/Diary')
const DiaryEditor = () => import('@/components/article/diary/DiaryEditor')

const Novel = () => import('@/components/article/novel/Novel')
const Portion = () => import('@/components/article/novel/portion/Portion')
const Section = () => import('@/components/article/novel/section/Section')

export default new Router({
  mode: 'hash',
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
          path: 'employee/employeesys',
          name: 'employeesys',
          component: EmployeeSys
        },
        {
          path: 'employee/adminsys',
          name: 'adminsys',
          component: AdminSys
        },
        {
          path: 'My/personalCenter',
          name: 'personalCenter',
          component: Center,
          children: [
            {
              path: 'Admin',
              name: 'admin',
              component: Admin,
              meta: {name: '账号信息'}
            },
            {
              path: 'Employee',
              name: 'employee',
              component: Employee,
              meta: {name: '职员信息'}
            }
          ]
        },
        {
          path: 'System/Authority',
          name: 'systemAuthority',
          component: SystemAuthority
        },
        {
          path: 'System/Resources',
          name: 'systemResources',
          component: SystemResources
        },
        {
          path: 'System/Authorities',
          name: 'systemAuthorities',
          component: SystemAuthorities
        },
        {
          path: 'System/Roles',
          name: 'systemRoles',
          component: SystemRoles
        },
        {
          path: 'System/Users',
          name: 'systemUsers',
          component: SystemUsers
        },
        {
          path: 'System/quartz',
          name: 'sysTaskCronJob',
          component: SystemQuartz
        },
        {
          path: 'Article/Diary',
          name: 'articleDiary',
          component: Diary,
          meta: {name: '个人日记'}
        },
        {
          path: 'Article/Diary/edit/:diaryOrder?',
          name: 'diaryEditor',
          component: DiaryEditor,
          props: true
        },
        {
          path: 'Article/Memo',
          name: 'articleMemo',
          component: Memo
        },
        {
          path: 'Article/Diary/reader/:id',
          name: 'diaryReader',
          component: DiaryReader,
          props: true
        },
        {
          path: 'Article/Novel',
          name: 'articleNovel',
          component: Novel,
          meta: {name: '脑洞小说'}
        },
        {
          path: 'Article/Classofy',
          name: 'articleClassify',
          component: Classify,
          props: true,
          meta: {name: '分类管理'}
        },
        {
          path: 'Article/Label',
          name: 'articleLabel',
          component: Label,
          meta: {name: '标签管理'}
        },
        {
          path: '/My/Article/Novel/:novelTitle/:novelOrder/portion',
          name: 'portionList',
          component: PortionList,
          meta: {name: '分卷列表'},
          props: true
        },
        {
          path: 'Article/Novel/:novelTitle/:novelOrder/portion',
          name: 'novelPortions',
          component: Portion,
          meta: {name: '分卷管理'},
          props: true
        },
        {
          path: 'Article/Novel/:novelTitle/:portionOrder/section/:id?',
          name: 'portionSection',
          component: Section,
          meta: {name: '章节编辑'},
          props: true
        },
        { // 留作学习用
          path: 'My/Article',
          name: 'personalArticle',
          component: Article,
          children: [
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
