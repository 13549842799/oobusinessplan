
const baseUrl = 'http://localhost:8081/O.OBusinessPlan'
// const baseUrl = 'http://39.97.99.250:8080/O.OBusinessPlan'
// const baseUrl = 'http://www.caiyangzhi.com/O.OBusinessPlan'
// const baseUrl = 'http://www.caiyangzhi.com/appServer'
const adminUrl = baseUrl + '/api/admin'
const employeeUrl = baseUrl + '/api/employee'
const roleUrl = baseUrl + '/api/authority/roles'
const resouUrl = baseUrl + '/api/authority/resource'
const authUrl = baseUrl + '/api/authority/auth'
const classifyUrl = baseUrl + '/api/article/classify'
const diaryUrl = baseUrl + '/api/article/diary'
const labelUrl = baseUrl + '/api/article/label'
const quartzUrl = baseUrl + '/api/quartz/sysTaskCronJob' // 时钟
const novelUrl = baseUrl + '/api/article/novel' // 小说
const upLoadUrl = baseUrl + '/api/upload/uploadFile' // 上传文件接口路径

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
  fileUrl
}
