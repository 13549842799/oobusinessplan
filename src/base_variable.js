
// const baseUrl = 'http://localhost:8082/O.OBusinessPlan'
const baseUrl = 'http://106.53.102.49:80/app/O.OBusinessPlan'
const adminUrl = baseUrl + '/api/admin'
const employeeUrl = baseUrl + '/api/employee'
const roleUrl = baseUrl + '/api/authority/roles'
const resouUrl = baseUrl + '/api/authority/resource'
const authUrl = baseUrl + '/api/authority/auth'
const classifyUrl = baseUrl + '/api/article/classify'
const memoUrl = baseUrl + '/api/article/memo'
const diaryUrl = baseUrl + '/api/article/diary'
const labelUrl = baseUrl + '/api/article/label'
const quartzUrl = baseUrl + '/api/quartz/sysTaskCronJob' // 时钟
const novelUrl = baseUrl + '/api/article/novel' // 小说
const upLoadUrl = baseUrl + '/api/upload/uploadFile' // 上传文件接口路径
const portionUrl = baseUrl + '/api/article/portion' // 分卷
const sectionUrl = baseUrl + '/api/article/section' // 章节
const ouserUrl = baseUrl + '/api/ouser'
const accountUrl = baseUrl + '/api/account'

// const loginUrl = 'http://localhost:8082/computer/#/login'
const loginUrl = 'http://localhost:8082/oobusinessplan/#/login'
const fileUrl = 'http://www.caiyangzhi.com/img' // 请求图片文件的路径

export {
  baseUrl,
  adminUrl,
  employeeUrl,
  roleUrl,
  resouUrl,
  authUrl,
  classifyUrl,
  diaryUrl,
  labelUrl,
  loginUrl,
  quartzUrl,
  novelUrl,
  upLoadUrl,
  fileUrl,
  portionUrl,
  sectionUrl,
  ouserUrl,
  accountUrl,
  memoUrl
}
