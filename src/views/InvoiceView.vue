<template>
  <div v-if="currentInvoice" class="invoice-view box"> 
    
    <router-link class="nav-link flex" :to="{name: 'home'}">
      <fa-icon class="icon" :icon="['fas', 'arrow-left']" /> Go Back
    </router-link>
    <div class="header flex">
      <!-- <loading v-show="loading"/> -->
      <div class="left flex">
        <span>Status</span>
        <div 
          class="status-button flex" 
          :class="{
            paid: currentInvoice.invoicePaid, 
            draft: currentInvoice.invoiceDraft, 
            pending: currentInvoice.invoicePending}"
          >
          <span v-if="currentInvoice.invoicePaid">Paid</span>
          <span v-if="currentInvoice.invoiceDraft">Draft</span>
          <span v-if="currentInvoice.invoicePending">Pending</span>
        </div>
      </div>

      <div class="right flex">
        <button @click="toggleInvoiceEdit" class="dark-purple">Edit</button>

        <button @click="deleteInvoice(currentInvoice.docId)" class="red">Delete</button>

        <button v-if="currentInvoice.invoicePending" @click="updateStatusToPaid(currentInvoice.docId)" class="green">Mark as Paid</button>

        <button v-if="currentInvoice.invoiceDraft || currentInvoice.invoicePaid" @click="updateStatusToPending(currentInvoice.docId)" class="orange">Mark as Pending</button>
      </div>
    </div>

    <!-- Invoice Details -->
    <div class="invoice-details flex flex-col">
      <div class="top flex">
        <div class="left flex flex-col">
          <p><span>#</span>{{currentInvoice.invoiceId}}</p>
          <p>{{currentInvoice.productDescription}}</p>
        </div>
        <div class="right flex flex-col">
          <p>{{currentInvoice.billerStreetAddress}}</p>
          <p>{{currentInvoice.billerCity}}</p>
          <p>{{currentInvoice.billerZipCode}}</p>
          <p>{{currentInvoice.billerCountry}}</p>
        </div>
      </div>

      <div class="middle flex">
        <div class="payment flex flex-col">
          <h4>Invoice Date</h4>
          <p>{{currentInvoice.invoiceDate}}</p>
          <h4>Payment Date</h4>
          <p>{{currentInvoice.paymentDueDate}}</p>
        </div>
        <div class="bill flex flex-col">
          <h4>Bill To</h4>
          <p>{{currentInvoice.clientName}}</p>
          <p>{{currentInvoice.clientStreetAddress}}</p>
          <p>{{currentInvoice.clientCity}}</p>
          <p>{{currentInvoice.clientZipCode}}</p>
          <p>{{currentInvoice.clientCountry}}</p>
        </div>
        <div class="send-to flex flex-col">
          <h4>Send To</h4>
          <p>{{currentInvoice.clientEmail}}</p>
        </div>
      </div>

      <div class="bottom flex flex-col">
        <div class="billing-items">
          <div class="heading flex">
            <p>Item Name</p>
            <p>QTY</p>
            <p>Price</p>
            <p>Total</p>
          </div>
          <div class="item flex" v-for="(item, index) in currentInvoice.invoiceItemList" :key="index">
            <p>{{item.itemName}}</p>
            <p>{{item.qty}}</p>
            <p>{{item.price}}</p>
            <p>${{item.total}}</p>
          </div>
        </div>

        <div class="total flex">
          <p>Amount Due</p>
          <p>${{currentInvoice.invoiceTotal}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import Loading from '@/components/Loading.vue'

export default {
  name: "InvoiceView",

  components: {
    Loading,
  },

  data() {
    return{
      currentInvoice: null,
    }
  },

  created () {
    this.getCurrentInvoice();
  },

  methods: {
    ...mapMutations(['setCurrentInvoice', 'toggleEditInvoice', 'toggleInvoice']),

    ...mapActions(['DELETE_Invoice', 'updateStatusToPaidSt', 'updateStatusToPendingSt']),

    getCurrentInvoice() {
      this.setCurrentInvoice(this.$route.params.invoiceId);
      this.currentInvoice = this.currentInvoiceArray[0];
      console.log(this.currentInvoice)
    },

    toggleInvoiceEdit() {
      this.toggleEditInvoice();
      this.toggleInvoice();

    },

    async deleteInvoice(docId) {
      this.loading = true;
      await this.DELETE_Invoice(docId);
      this.$router.push({name: 'home'});
      this.loading = false;
    },

    updateStatusToPaid(docId) {
      this.updateStatusToPaidSt(docId)
    },

    updateStatusToPending(docId) {
      this.updateStatusToPendingSt(docId)
    },
  },

  computed: {
    ...mapState(['currentInvoiceArray', 'editInvoice'])
  },

  watch: {
    editInvoice() {
      if(!this.editInvoice) {
        this.currentInvoice = this.currentInvoiceArray[0];
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.invoice-view {
  .nav-link {
    @apply mb-8 items-center text-white text-xs no-underline;

    .icon {
      @apply mr-4 w-2 h-3
    }
  }

  .header,
  .invoice-details{
    background-color: #1e2139;
    border-radius: 20px;
  }

  .header {
    @apply items-center py-6  px-8 text-xs;

    .left {
      align-items: center;

      span {
        color: #dfe3fa;
        margin-right: 16px;
      }
    }

    .right {
      flex: 1;
      justify-content: flex-end;

      button {
        color: #fff;
      }
    }
  }

  .invoice-details {
    @apply p-12 mt-6;

    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }

      .left {
        font-size: 12px;
        align-items: flex-start;
        p:first-child{
          @apply text-2xl uppercase text-white mb-2;
        }

        p:nth-child(2) {
          font-size: 16px;
        }

        span {
          color: #888eb0;
        }
      }
      .right {
        font-size: 12px;
        align-items: flex-end;
      }
    }

    .middle {
      @apply mt-12 gap-4;
      color: #dfe3fa;
      

      h4 {
        @apply mb-3 text-xs font-normal
      }

      p {
        font-size: 16px;
      }

      .bill,
      .payment {
        flex: 1;
        align-items: flex-start;
      }

      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }

        p{
          font-weight: 600px;
        }
      }

      .bill {
        justify-content: center;
        p:nth-child(2) {
          font-size: 16px;
          margin-bottom: 20px;
        }
        p:nth-child(3) {
          margin-top: auto;
        }

        p {
          font-size: 12px;
          text-align: start;
        }
      }

      .send-to {
        flex: 2;
        // align-items: flex-start;
      }
    }

    .bottom {
      margin-top: 50px;

      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #252945;

        .heading {
          color: #dfe3fa;
          font-size: 12px;
          margin-bottom: 32px;

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }

        .item {
          margin-bottom: 32px;
          font-size: 13px;
          color: #fff;

          &:last-child {
            margin-bottom: 0;
          }

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p{
            flex: 1;
            text-align: right;
          }
        }
      }

      .total {
        color: #fff;
        padding: 32px;
        background-color: rgba(12, 14, 22, 0.7);
        align-items: center;
        border-radius: 0 0 20px 20px;

        p {
          flex: 1;
          font-size: 12px;
          text-align: left;
        }

        p:nth-child(2) {
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }
}
</style>