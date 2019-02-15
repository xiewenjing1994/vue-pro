<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/img/heima.png"/>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="cancelbtn">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menushow?'60px':'200px'">
        <div
        style="color: white;height: 25px;line-height: 25px;font-size: 12px;background-color:#4a5064;letter-spacing: 0.1em;cursor: pointer;user-select:none;"
        @click="menushow = !menushow"
        >|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :style="menushow?'width=60px;':'width=200px;'"
          :collapse="menushow"
          :collapse-transition="false"
          :unique-opened="true"
        >
          <el-submenu :index="item.id + ''" v-for="(item,k) in menuList" :key="item.id">
            <template slot="title">
              <i :class="'iconfont icon-'+menuicon[k]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              index="item.id + '-' + item2.id"
              v-for="item2 in item.children"
              :key="item2.id"
            >
              <i class="el-icon-menu"></i>
              {{ item2.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    export default {
      created() {
        this.getMenuListdata();
      },
      data() {
        return {
          // 设置菜单展开、收起
          menushow: false,
          menuList: [],
          menuicon: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
        }
      },
      methods: {
        // 退出登录
        cancelbtn() {
          this.$confirm('确定要退出吗','提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              window.sessionStorage.removeItem('token');
              this.$router.push('/login');
            })
            .catch(() =>{ })
        },
        // 获取左侧导航数据
        async getMenuListdata() {
          const { data: res } = await this.$http.get('menus');
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          this.menuList = res.data;
          // console.log(this.menuList)
        }
      }
    }
</script>

<style lang="less" scoped>
    .el-container {
      height: 100%;
      .el-header {
        padding: 0 20px 0 0;
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select:none;
        div {
          font-size: 17px;
          color: #fff;
          display: flex;
          align-items: center;
          img {
            width: 50px;
            height: 50px;
            margin-right: 10px;
          }
        }
      }
      .el-aside {
        background-color: #333744;
      }
      .el-main {
        background-color: #eaedf1;
      }
    }
</style>
