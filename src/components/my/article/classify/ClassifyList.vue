<template>
  <div>
    <table>
      <thead>
        <tr>
          <th style="width:10%;">排序</th>
          <th style="width:60%;text-align:left;">类别</th>
          <th style="width:20%;">操作</th>
          <th style="width:10%;">文章数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in page.list" :key="index">
          <td>{{index}}</td>
          <td style="text-align:left;">{{item.name}}</td>
          <td>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </td>
          <td>{{item.count}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr><th colspan=4 style="text-align: right">
          <el-pagination         
            layout="prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page.pageNum"
            :page-size="page.pageSize"
            :total="page.total">
          </el-pagination>
        </th></tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import pagePlug from '@/components/common/page'

export default {
  mixins: [pagePlug],
  props: {
    url: String
  },
  data () {
    return {}
  },
  created () {
    let v = this
    v.page.requestUrl = v.url
    v.searchPage({value: [null]})
  },
  methods: {
  }
}
</script>

<style scoped>
table {
  width: 100%;
  text-align: center;
}

thead > tr, tbody > tr {
  border-bottom: 1px solid #e9e9e9;
}
thead > tr {
  height: 30px;
  color: #999999;
}
tbody > tr {
  height: 50px;
}
</style>
