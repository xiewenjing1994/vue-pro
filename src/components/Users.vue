<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" v-model="queryParams.query" :clearable="true" @clear="getUserData" @keyup.enter.native="getUserData">
            <el-button slot="append" icon="el-icon-search" @click="getUserData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <!--添加用户功能-->
          <el-button type="primary" @click="addDialogForm = true">添加用户</el-button>
          <el-dialog title="添加用户" :visible.sync="addDialogForm">
            <el-form
              :model="addUserForm"
              label-width="80px"
              :rules="addUserRules"
              ref="addForm"
              :close="resetAddForm">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addUserForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addUserForm.password" type="password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addUserForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="addUserForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addDialogForm = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
      <el-table
        :data="usersData"
        border
        style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="140"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="160"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column label="状态" width="70">
          <el-switch v-model="info.row.mg_state" slot-scope="info">
          </el-switch>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <!--编辑用户-->
           <el-button
             type="primary"
             icon="el-icon-edit"
             size="mini"
             @click="getEditId(info.row.id)"></el-button>
           <el-dialog title="修改用户" :visible.sync="editDialogForm">
              <el-form
                :model="editUserForm"
                label-width="80px"
                :rules="editUserRules"
                ref="editForm"
                :close="resetEditForm">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="editUserForm.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                  <el-input v-model="editUserForm.mobile"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogForm = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
              </div>
           </el-dialog>
          <!--删除用户-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.pagenum"
          :page-sizes="[2, 4, 8, 10]"
          :page-size="queryParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryParams.total">
        </el-pagination>
    </el-card>
  </div>
</template>

<script>
    export default {
      created() {
        this.getUserData();
      },
      data() {
          // 添加用户 手机号码验证
          var validateMobile = (rule, value, callback) => {
            if (!/^\d{11}$/.test(value)) {
              return callback(new Error('请输入正确的手机号码格式'));
            }
            callback();
          };
          return {
            // 用户数据
            usersData: [],
            // 用户数据列表请求参数
            queryParams: {
              // 查询参数
              query: '',
              // 当前页码
              pagenum: 1,
              // 每页显示条数
              pagesize: 2,
              // 记录总条数
              total: 0
            },
            // 搜索关键词
            keywords: '',
            // 删除单个用户 弹窗是否显示
            addDialogForm: false,
            // 添加用户
            addUserForm: {
              username: '',
              password: '',
              email: '',
              mobile: ''
            },
            // 添加用户规则
            addUserRules: {
              username: [
                { required: true, message: '用户名必填', trigger: 'blur' }
              ],
              password: [
                { required: true, message: '密码必填', trigger: 'blur' }
              ],
              mobile: [
                { required: true, message: '密码必填', trigger: 'blur' },
                { validator: validateMobile, trigger: 'blur' }
              ]
            },
            // 编辑用户
            editDialogForm: false,
            editUserForm: {
              username: '',
              email: '',
              mobile: ''
            },
            // 编辑用户规则
            editUserRules: {
              mobile: [
                { required: true, message: '密码必填', trigger: 'blur' },
                { validator: validateMobile, trigger: 'blur' }
              ]
            }
          }
      },
      methods: {
        // 获取用户数据列表
          async getUserData() {
            const { data: res } = await this.$http.get('users',{ params: this.queryParams });
            // console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg);
            }
            // 获取总条数
            this.queryParams.total = res.data.total;
            this.usersData = res.data.users;
          },
        // pageSize 改变时会触发
        handleSizeChange(val) {
          // val: 每页条数
          this.queryParams.pagesize = val;
          this.getUserData();
        },
        // currentPage 改变时会触发
        handleCurrentChange(val) {
          this.queryParams.pagenum = val;
          this.getUserData();
        },
        // 删除单个用户
        delUser(id) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            const {data: res} = await this.$http.delete('users/'+ id);
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg);
            }
            this.$message.success(res.meta.msg);
            this.getUserData();
          }).catch(() => { });
        },
        // 添加用户功能
        addUser() {
            // 首先进行form表单验证，再提交axios请求
          this.$refs.addForm.validate(async (valid) => {
            if (valid) {
              const { data: res } = await this.$http.post('users', this.addUserForm);
              if (res.meta.status !== 201) {
                return this.$message.error(res.meta.msg);
              }
              this.$message.success(res.meta.msg);
              this.addDialogForm = false;
              this.getUserData();
            }
          });
        },
        // 添加用户完毕重置form表单
        resetAddForm() {
          this.$refs.addForm.resetFields();
        },
        // 编辑用户：获取用户id
        async getEditId(id) {
          this.editDialogForm = true;
          const { data: res } = await this.$http.get('users/'+id);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          this.editUserForm = res.data;
        },
        // 编辑用户完毕确定提交功能
        editUser() {
          this.$refs.editForm.validate(async (valid) => {
            if (valid) {
              const {data: res } = await this.$http.put('users/'+this.editUserForm.id,this.editUserForm);
              if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg);
              }
              this.editDialogForm = false;
              this.$message.success(res.meta.msg);
              this.getUserData();
            }
          });
        },
        // 编辑用户完毕重置form表单
        resetEditForm() {
          this.$refs.editForm.resetFields();
        }
      }
    }
</script>

<style lang="less" scoped>
  .el-card {
    margin-top: 15px;
    box-shadow: 0 1px 1px rgba(0,0,0,0.15) !important;
  }

</style>
