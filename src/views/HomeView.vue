<template>
  <div class="home box">
    <div class="header flex">
      <div class="left flex flex-col">
        <h1>Invoices</h1>
        <span>Thre are 4 total invoices</span>
      </div>
      <div class="right flex">
        <div @click="toggleFilterMenu" class="filter flex">
          <span>Filter by status</span>
          <fa-icon class="icon" :icon="['fas', 'caret-down']" />
          <ul v-show="filterMenu" class="filter-menu">
            <li>Draft</li>
            <li>Pending</li>
            <li>Paid</li>
            <li>Clear Filter</li>
          </ul>
        </div>
        <div @click="newInvoice" class="button flex">
          <div class="inner-button flex">
            <fa-icon class="icon" :icon="['fas', 'plus']" />
          </div>
          <span>New Invoice</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {
   
  },

  data() {
    return {
      filterMenu: null,
    }
  },

  methods: {
    toggleFilterMenu() {
      this.filterMenu = !this.filterMenu
    },

    newInvoice() {

    }
  }
}
</script>

<style lang="scss" scoped>
$box-shadow:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

.home {
  color: #fff;

  .header {
    margin-bottom: 65px;

    .left,
    .right {
      flex: 1;
    }

    .left{
      @apply items-start ;

      h1{
        @apply text-2xl font-bold
      }

      span{
        @apply text-xs
      }
    }

    .right{
      @apply justify-end items-center;

      .button,
      .filter {
        @apply items-center;

        span {
          font-size: 12px;
        }
      }

      .filter {
        @apply relative mr-10 cursor-pointer;

        .icon {
          @apply ml-3
        }

        .filter-menu{
          @apply absolute list-none top-6;
          width: 120px;
          background-color: #1e2139;
          box-shadow: $box-shadow;

          li{
            @apply cursor-pointer text-xs py-3 px-7;

            &:hover {
              color: #1e2139;
              background-color: #fff
            }
          }
        }
      }

      .button{
        @apply py-2 px-3;
        background-color: #7c5dfa;
        border-radius: 40px;

        .inner-button {
          @apply mr-2 p-2 items-center justify-center;
          border-radius: 50%;
          background-color: #fff;
        }
      }
    }
  }
}
</style>
