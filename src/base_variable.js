
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
const quartzUrl = baseUrl + '/api/quartz/sysTaskCronJob'
const novelUrl = baseUrl + '/api/article/novel'

// const loginUrl = 'http://localhost:8082/computer/#/login'
const loginUrl = 'http://localhost:8082/oobusinessplan/#/login'

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
  novelUrl
}
