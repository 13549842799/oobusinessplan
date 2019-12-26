import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/Login'
import IndexPage from '@/components/Index'
// import SystemAuthority from '@/components/system/SystemAuthority'
import EmployeeSys from '@/components/employee/EmployeeSys'
import AdminSys from '@/components/employee/AdminSys'
import Center from '@/components/my/center/PersonalCenter'
import Admin from '@/components/my/center/admin'
import Employee from '@/components/my/center/employee'
import Article from '@/components/my/article/Article'
import Diary from '@/components/my/article/diary/Diary'
import Classify from '@/components/my/article/classify/Classify'
import DiaryEdit from '@/components/my/article/diary/DiaryEdit'
import Label from '@/components/my/article/label/Label'
import SystemQuartz from '@/components/system/SystemQuartz'

Vue.use(Router)

const SystemAuthority = () => import('@/components/system/SystemAuthority')

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
          path: 'System/quartz',
          name: 'sysTaskCronJob',
          component: SystemQuartz
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
              component: Diary,
              meta: {name: '所有日记'}
            },
            {
              path: 'Classify',
              name: 'classify',
              component: Classify,
              props: true,
              meta: {name: '分类列表'}
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
