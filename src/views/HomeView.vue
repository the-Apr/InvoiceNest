<template>
  <div class="home box">
    <div class="header flex">
      <div class="left flex flex-col">
        <h1>Invoices</h1>
        <span v-if="invoiceData.length == 1">There is {{invoiceData.length}} total invoice</span>
        <span v-else>There are {{invoiceData.length}} total invoices</span>
        
      </div>

      <div class="right flex">
        <div @click="toggleFilterMenu" class="filter flex">
          <span>Filter by status <span v-if="filteredInvoice">: {{filteredInvoice}}</span></span>
          <fa-icon class="icon" :icon="['fas', 'caret-down']" />
          <ul v-show="filterMenu" class="filter-menu">
            <li @click="filteredInvoices">Draft</li>
            <li @click="filteredInvoices">Pending</li>
            <li @click="filteredInvoices">Paid</li>
            <li @click="filteredInvoices">Clear Filter</li>
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

    <div v-if="invoiceData.length > 0">
      <invoice v-for="(invoice, index) in filteredData" :invoice= "invoice" :key="index"/>
    </div>

    <!-- empty list -->
    <div v-else class="empty flex flex-col">
      <img src="../assets/Wavy_Gen-03_Single-01.jpg" alt="">
      <h3>This is nothing here</h3>
      <p>Create a new invoice by clicking the New Invoice buton and get started</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapMutations, mapState } from 'vuex';
import Invoice from '@/components/InvoiceItem.vue'

export default {
  name: 'HomeView',
  components: {
   Invoice,
  },

  data() {
    return {
      filterMenu: null,
      filteredInvoice: null
    }
  },

  computed: {
    ...mapState(['invoiceData']),

    filteredData() {
      return this.invoiceData.filter(invoice => {
        if(this.filteredInvoice === 'Draft') {
          return invoice.invoiceDraft === true;
        }
        if(this.filteredInvoice === 'Pending') {
          return invoice.invoicePending === true;
        }
        if(this.filteredInvoice === 'Paid') {
          return invoice.invoicePaid === true;
        }
        return invoice;
      });
    }
  },

  methods: {
    toggleFilterMenu() {
      this.filterMenu = !this.filterMenu
    },

    ...mapMutations(['toggleInvoice']),
    
    newInvoice() {
      this.toggleInvoice()
    },

    filteredInvoices(e) {
      if(e.target.innerText === 'Clear Filter') {
        this.filteredInvoice =null;
        return;
      }
      this.filteredInvoice = e.target.innerText;
    }
  },
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

  .empty {
    @apply mt-40 items-center;

    img {
      @apply w-56 h-52;
    }

    h3 {
      @apply text-xl mt-10;
    }

    p {
      @apply text-center text-xs font-light mt-4;
      max-width: 224px;
    }
  }
}
</style>
