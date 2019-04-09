<template>
  <div class="tap">
    <div class="head"></div>
    <div class="content">
      <el-table
    :data="tableData"
    height="350"
    border
    ref="multipleTable"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      fixed
      type="index"
      :index="1">
    </el-table-column>
    <el-table-column
      fixed
      prop="accountname"
      label="用户名"
      width="100">
    </el-table-column>
    <el-table-column
      prop="nikename"
      label="昵称"
      width="100">
    </el-table-column>
    <el-table-column
      prop="province"
      label="自动登陆mac"
      show-overflow-tooltip
      width="110">
    </el-table-column>
    <el-table-column
      prop="state"
      label="状态"
      width="80">
    </el-table-column>
    <el-table-column
      prop="address"
      label="创建时间"
      width="300">
    </el-table-column>
    <el-table-column
      prop="zip"
      label="邮编"
      width="120">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        <el-button type="text" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage3"
      :page-size="100"
      layout="prev, pager, next, jumper"
      :total="1000">
    </el-pagination>
  </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'userManager',
  methods: {
      handleClick(row) {
        console.log(row)
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      cancelrSelected () {
        this.$refs.multipleTable.clearSelection();
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    },

    data() {
      return {
        currentPage3: 5,
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海sadfasdfadsfsdafad',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }],
        multipleSelection: []
      }
    }
}
</script>

<style scoped>
@import './common.css';

.head, .content {
  width: 95%;
  margin-left: 2.5%
}

.head {
  height: 10%;
  margin-bottom: 10px;
}

.content {
    height: 80%;
}
</style>
