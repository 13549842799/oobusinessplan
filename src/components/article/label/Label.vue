<template>
  <div style="height: 100%;">
    <el-container>
      <el-header height="150px">
        <div style="height:50px">
          标签管理
        </div>
        <div>
          <el-form :inline="true" :model="page.params">
            <el-form-item label="标签名">
              <el-input size="medium" v-model="page.params.name" placeholder="标题" clearable></el-input>
            </el-form-item>
            <el-form-item label="最小数">
              <el-input-number size="medium" v-model="page.params.minCount" controls-position="right"  :min="0" style="width: 100px"></el-input-number>
            </el-form-item>
            <el-form-item label="最大数">
              <el-input-number size="medium" v-model="page.params.maxCount" controls-position="right"  :min="1" style="width: 100px"></el-input-number>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="page.params.targetTypeArr" multiple placeholder="请选择" size="medium" @change="alterTargetTypes">
                <el-option label="日记" value="1"></el-option>
                <el-option label="备忘" value="2"></el-option>
                <el-option label="灵感" value="3"></el-option>
                <el-option label="小说" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="page.searchPage()">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
          ref="LabelPageTable"
          :data="page.list"
          style="width: 100%">
          <el-table-column
            property="name"
            label="标签名"
            width="350">
          </el-table-column>
          <el-table-column
            label="类别"
            width="190">
            <template slot-scope="scope">
            <el-tag :type="scope.row.targetType === 1 ? 'success' : (scope.row.targetType === 4 ? '' : 'info')" effect="dark" size="mini"> {{ scope.row.targetTypeName }} </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            property="count"
            label="使用次数"
            width="150">
          </el-table-column>
          <el-table-column label="操作">
            <!-- <template slot-scope="scope">
              <el-button size="mini">详情</el-button>
            </template> -->
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px; height: 50px">
          <div style="height: 100%; width: 50%;float: left">
          </div>
          <div style="height: 100%; width: 50%;float: left;display: flex;flex-direction: row-reverse">
            <el-pagination
              small
              layout="prev, pager, next"
              @current-change="currentChange"
              :current-page.sync="page.pageNum"
              :page-size="page.pageSize"
              :total="page.total">
            </el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import pageBasic from '@/components/common/page/pagerequireBasic'
import basicTable from '@/components/common/table/basicMethod'
import util from '@/components/common/objUtil'

import labelApi from '@/components/article/label/labelApi'

export default {
  components: {},
  mixins: [pageBasic, basicTable],
  data () {
    return {
      targetTypes: [{label: '日记', val: 1}, {label: '备忘', val: 2}, {label: '灵感', val: 3}, {label: '小说', val: 4}]
    }
  },
  created () {
    let v = this
    v.page = v.createPage({url: labelApi.listUrl(), pageSize: 12, total: 12})
  },
  computed: {
  },
  methods: {
    alterTargetTypes (val) {
      this.page.params.targetTypes = util.strDef(val.join())
    }
  }
}

</script>

<style>
</style>
