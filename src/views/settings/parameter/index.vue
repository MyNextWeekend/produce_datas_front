<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.filter.keyName" placeholder="参数" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.filter.value" placeholder="值" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
        @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
        @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参数" align="center" prop="key_name" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.keyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值" align="center">
        <template slot-scope="{row}">
          <span>{{ row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ new Date(row.createdAt) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ new Date(row.updatedAt) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
      @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="参数" prop="keyName">
          <el-input v-model="temp.keyName" />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="temp.value" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.description" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
            placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === '新增' ? createData() : updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { ParameterAdd, ParameterDelete, ParameterUpdate, ParameterQuery, ParameterStatistic, ParameterInfo } from '@/api/parameter'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name: 'ParameterTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20,
        filter: {
          keyName: '',
          value: ''
        },
        sortOrder: "asc",
        sortBy: 'id'
      },

      temp: {
        id: null,
        keyName: null,
        value: null,
        description: null
      },

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // 删除空字符串和 null
      this.listQuery.filter = Object.fromEntries(
        Object.entries(this.listQuery.filter).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );
      // 查询数据
      ParameterQuery(this.listQuery).then(response => {
        this.list = response.data
      })
      // 查询总数
      ParameterStatistic(this.listQuery).then(response => {
        this.total = response.data.total
      })
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      console.log('sortChange', data)
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.sortOrder = 'asc'
      } else {
        this.listQuery.sortOrder = 'desc'
      }
      this.listQuery.sortBy = prop
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: null,
        keyName: null,
        value: null,
        description: null
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = '新增'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 删除空字符串和 null
          this.temp = Object.fromEntries(
            Object.entries(this.temp).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
          );
          ParameterAdd(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
            // 重新查询最新的结果显示
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj 或者 调用 API 查询详情
      this.dialogStatus = '修改'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 删除空字符串和 null
          this.temp = Object.fromEntries(
            Object.entries(this.temp).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
          );
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          ParameterUpdate(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            // 重新查询最新的结果显示
            this.getList()
          })
        }
      })
    },
    handleDelete(row, index) {
      const h = this.$createElement;
      this.$msgbox({
        title: '消息',
        message: h('p', null, [
          h('span', null, '确定删除该条记录吗？ '),
          h('i', { style: 'color: teal' }, row.keyName)
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            ParameterDelete({ id: row.id }).then(() => {
              instance.confirmButtonLoading = false;
              done();
              this.$notify({
                title: 'Success',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              instance.confirmButtonLoading = false;
              this.$notify({
                title: 'Error',
                message: '删除失败',
                type: 'error',
                duration: 2000
              })
            });
          } else {
            done();
          }
        }
      }).then(action => {
        this.getList()
      });
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'createdAt' || j === 'updatedAt') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
