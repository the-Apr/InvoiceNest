<template>
  <div @click="checkClick" ref="invoiceWrap" class="invoice-wrap flex flex-col">
    <form @submit.prevent="submitForm" class="invoice-content">
      <loading v-show="loading" />
      <h1 v-if="!editInvoice">New Invoice</h1>
      <h1 v-else>Edit Invoice</h1>

      <!-- Bill From -->
      <div class="bill-from flex flex-col">
        <h4>Bill From</h4>
        <div class="input flex flex-col">
          <label for="billerStreetAddress">Street Address</label>
          <input required type="text" name="" id="billerStreetAddress" v-model="billerStreetAddress">
        </div>

        <div class="location-details flex">
          <div class="input flex flex-col">
            <label for="billerCity">City</label>
            <input required type="text" name="" id="billerCity" v-model="billerCity">
          </div>
          <div class="input flex flex-col">
            <label for="billerZipCode">Zip Code</label>
            <input required type="text" name="" id="billerZipCode" v-model="billerZipCode">
          </div>
          <div class="input flex flex-col">
            <label for="billerCountry">Country</label>
            <input required type="text" name="" id="billerCountry" v-model="billerCountry">
          </div>
        </div>
      </div>

      <!-- Bill To -->
      <div class="bill-to flex flex-col">
        <h4>Bill To</h4>
        <div class="input flex flex-col">
          <label for="clientName">Client's Name</label>
          <input required type="text" name="" id="clientName" v-model="clientName">
        </div>
        <div class="input flex flex-col">
          <label for="clientEmail">Client's Email</label>
          <input required type="text" name="" id="clientEmail" v-model="clientEmail">
        </div>
        <div class="input flex flex-col">
          <label for="clientStreetAddress">Street Address</label>
          <input required type="text" name="" id="clientStreetAddress" v-model="clientStreetAddress">
        </div>

        <div class="location-details flex">
          <div class="input flex flex-col">
            <label for="clientCity"> Client City</label>
            <input required type="text" name="" id="clientCity" v-model="clientCity">
          </div>
          <div class="input flex flex-col">
            <label for="clientZipCode"> Client Zip Code</label>
            <input required type="text" name="" id="clientZipCode" v-model="clientZipCode">
          </div>
          <div class="input flex flex-col">
            <label for="clientCountry">Client Country</label>
            <input required type="text" name="" id="clientCountry" v-model="clientCountry">
          </div>
        </div>
      </div>

      <!-- Invoice Work Details -->
      <div class="invoice-work flex flex-col">
        <div class="payment flex">
          <div class="input flex flex-col">
            <label for="invoiceDate">Invoice Date</label>
            <input disabled type="text" name="" id="invoiceDate" v-model="invoiceDate">
          </div>
          <div class="input flex flex-col">
            <label for="paymentDueDate">Payment Due Date</label>
            <input disabled type="text" name="" id="paymentDueDate" v-model="paymentDueDate">
          </div>
        </div>
        <div class="input flex flex-col">
          <label for="paymentTerms">Payment Terms</label>
          <select required name="" id="paymentTerms" v-model="paymentTerms">
            <option value="30">Net 30 Days</option>
            <option value="60">Net 60 Days</option>
          </select>
        </div>
        <div class="input flex flex-col">
          <label for="productDescription">Product Description</label>
          <input required type="text" name="" id="productDescription" v-model="productDescription">
        </div>
        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading">
              <th class="item-name">Item Name</th>
              <th class="qty">Qty</th>
              <th class="price">Price</th>
              <th class="total">Total</th>
            </tr>

            <tr class="table-items flex" v-for="(item, index) in invoiceItemList" :key="index">
              <td class="item-name">
                <input type="text" v-model="item.itemName">
              </td>
              <td class="qty">
                <input type="text" v-model="item.qty">
              </td>
              <td class="price">
                <input type="text" v-model="item.price">
              </td>
              <td class="total flex">${{item.total = item.qty * item.price}}</td>
              <fa-icon class="icon" @click="deleteInvoice(item.id)" :icon="['fas', 'trash']" />
            </tr>
          </table>

          <div @click="addNewInvoiceItem" class="flex button">
            <fa-icon class="icon" :icon="['fas', 'plus']" />
            Add New Item
          </div>
        </div>
      </div>

      <!-- Save/Exit  -->
      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeInvoice" class="red">Cancel</button>
        </div>
        <div class="right flex">
          <button v-if="!editInvoice" type="submit"  @click="saveDraft" class="dark-purple">Save Draft</button>
          <button  v-if="!editInvoice" type="submit" @click="publishInvoice" class="purple">Create Invoice</button>
          <button  v-if="editInvoice" type="submit" class="purple">Update Invoice</button>
          
        </div>

      </div>
    </form>
  </div>
</template>

<script>
import { db } from '../firebase/firebaseInit';
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { mapActions, mapMutations, mapState } from 'vuex';
import { uid } from 'uid';
import Loading from '@/components/Loading.vue'

export default {
  name: "InvoiceModal",
  components: {
    Loading,
  },
  data() {
    return {
      docId: null,
      loading: null,
      dateOptions: { year: "numeric", month: "short", day: "numeric" },
      docId: null,
      loading: null,
      billerStreetAddress: null,
      billerCity: null,
      billerZipCode: null,
      billerCountry: null,
      clientName: null,
      clientEmail: null,
      clientStreetAddress: null,
      clientCity: null,
      clientZipCode: null,
      clientCountry: null,
      invoiceDateUnix: null,
      invoiceDate: null,
      paymentTerms: null,
      paymentDueDateUnix: null,
      paymentDueDate: null,
      productDescription: null,
      invoicePending: null,
      invoiceDraft: null,
      invoiceItemList: [],
      invoiceTotal: 0,
    };
  },

  created() {

    // get current date field
    if (!this.editInvoice) {
      this.invoiceDateUnix = Date.now();
      this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString("en-us",this.dateOptions);
    }

    if(this.editInvoice) {
      const currentInvoice = this.currentInvoiceArray[0];
      this.docId = currentInvoice.docId;
      this.billerStreetAddress = currentInvoice.billerStreetAddress;
      this.billerCity = currentInvoice.billerCity;
      this.billerZipCode = currentInvoice.billerZipCode;
      this.billerCountry = currentInvoice.billerCountry;
      this.clientName = currentInvoice.clientName;
      this.clientEmail = currentInvoice.clientEmail;
      this.clientStreetAddress = currentInvoice.clientStreetAddress;
      this.clientCity = currentInvoice.clientCity;
      this.clientZipCode = currentInvoice.clientZipCode;
      this.clientCountry = currentInvoice.clientCountry;
      this.invoiceDateUnix = currentInvoice.invoiceDateUnix;
      this.invoiceDate = currentInvoice.invoiceDate;
      this.paymentTerms = currentInvoice.paymentTerms;
      this.paymentDueDateUnix = currentInvoice.paymentDueDateUnix;
      this.paymentDueDate = currentInvoice.paymentDueDate;
      this.productDescription = currentInvoice.productDescription;
      this.invoicePending = currentInvoice.invoicePending;
      this.invoiceDraft = currentInvoice.invoiceDraft;
      this.invoiceItemList = currentInvoice.invoiceItemList;
      this.invoiceTotal = currentInvoice.invoiceTotal;
    }
  },

  methods: {
    ...mapMutations(['toggleInvoice', 'toggleModal', 'toggleEditInvoice']),

    ...mapActions(['updateInvoice', 'getInvoices']),

    checkClick(e) {
      if(e.target ===this.$refs.invoiceWrap) {
        this.toggleModal();
      }
    },

    closeInvoice() {
      this.toggleInvoice();
      if (this.editInvoice) {
        this.toggleEditInvoice()
      }
    },
    
    addNewInvoiceItem() {
      this.invoiceItemList.push({
      id: uid(),
      itemName: "",
      qty: "",
      price: 0,
      total: 0,
      })
    },

    deleteInvoice(id) {
      this.invoiceItemList = this.invoiceItemList.filter(item => item.id !== id)
    },

    calInvoiceTotal() {
      this.invoiceTotal = 0;
      this.invoiceItemList.forEach(item => {
        this.invoiceTotal += item.total;
      })
    },

    publishInvoice() {
      this.invoicePending = true;
    },

    saveDraft() {
      this.invoiceDraft = true;
    },

    async uploadInvoice() {
      if (this.invoiceItemList.length <= 0) {
        alert ('Please fill in the work items');
        return;
      }

      this.loading = true;

      this.calInvoiceTotal();

      // const dataBase = db.collection('invoices').doc();

      const invoicesCollection = collection(db, 'invoices');
      const newInvoiceDoc = doc(invoicesCollection);

      try {
        await setDoc(newInvoiceDoc, {
          invoiceId: uid(6),
          billerStreetAddress: this.billerStreetAddress,
          billerCity: this.billerCity,
          billerZipCode: this.billerZipCode,
          billerCountry: this.billerCountry,
          clientName: this.clientName,
          clientEmail: this.clientEmail,
          clientStreetAddress: this.clientStreetAddress,
          clientCity: this.clientCity,
          clientZipCode: this.clientZipCode,
          clientCountry: this.clientCountry,
          invoiceDate: this.invoiceDate,
          invoiceDateUnix: this.invoiceDateUnix,
          paymentTerms: this.paymentTerms,
          paymentDueDate: this.paymentDueDate,
          paymentDueDateUnix: this.paymentDueDateUnix,
          productDescription: this.productDescription,
          invoiceItemList: this.invoiceItemList,
          invoiceTotal: this.invoiceTotal,
          invoicePending: this.invoicePending,
          invoiceDraft: this.invoiceDraft,
          invoicePaid: null,
        })
        this.loading = false;

        this.toggleInvoice();

        this.getInvoices();
      } catch (error) {
         console.error("Error uploading invoice:", error);
      }
    },

    async updatesInvoice() {
      if (this.invoiceItemList.length <= 0) {
        alert ('Please fill in the work items');
        return;
      }

      this.loading = true;

      this.calInvoiceTotal();

      const invoicesCollection = collection(db, 'invoices');
      const newInvoiceDoc = doc(invoicesCollection, this.docId);

      try {
        await updateDoc(newInvoiceDoc, {
          billerStreetAddress: this.billerStreetAddress,
          billerCity: this.billerCity,
          billerZipCode: this.billerZipCode,
          billerCountry: this.billerCountry,
          clientName: this.clientName,
          clientEmail: this.clientEmail,
          clientStreetAddress: this.clientStreetAddress,
          clientCity: this.clientCity,
          clientZipCode: this.clientZipCode,
          clientCountry: this.clientCountry,
          invoiceDate: this.invoiceDate,
          invoiceDateUnix: this.invoiceDateUnix,
          paymentTerms: this.paymentTerms,
          paymentDueDate: this.paymentDueDate,
          paymentDueDateUnix: this.paymentDueDateUnix,
          productDescription: this.productDescription,
          invoiceItemList: this.invoiceItemList,
          invoiceTotal: this.invoiceTotal,
        });
        
        this.loading = false;

        const data = {
          docId: this.docId,
          routeId: this.$route.params.invoiceId,
        };

        this.updateInvoice(data);

      } catch (error) {
         console.error("Error updating invoice:", error);
        }
    },

    submitForm() {
      if(this.editInvoice) {
        this.updatesInvoice();
        return;
      }
      this.uploadInvoice();
    }
  },

  computed: {
    ...mapState(['editInvoice', 'currentInvoiceArray']),
  },

  watch: {
    paymentTerms() {
      const futureDate = new Date();
      this.paymentDueDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(this.paymentTerms));
      this.paymentDueDate = new Date(this.paymentDueDateUnix).toLocaleDateString("en-us", this.dateOptions)
    }
  }
}
</script>

<style lang="scss" scoped>
.invoice-wrap{
  @apply fixed top-0 left-0 w-full overflow-scroll bg-transparent;
  height: 100vh;
  &::-webkit-scrollbar{
    display: none;
  }

  @screen lg{
    left: 90px;
  }
  
  .invoice-content {
    @apply relative p-14 w-full;
    max-width: 700px;
    background-color: #141625;
    color: #fff;
    box-shadow:  10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      color: #fff;
    }
    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }
    h4{
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
      text-align: start;
    }

    //bill to/ bill from
    .bill-to,
    .bill-from {
      @apply  mb-12;

      .location-details {
        @apply  gap-3;

        div{
         @apply flex-1
        }
      }
    }

    // Invoice-work

    .invoice-work {
      .payment {
        @apply gap-6;

        div{
          @apply flex-1
        }
      }

      .work-items {
        .item-list {
          @apply w-full;

          //item table
        
          .table-heading{
            @apply  mb-6 flex;
          }

          .table-items {
            @apply relative mb-6;

            .icon {
              @apply absolute top-4 right-0 w-3 h-4;
            }
          }

          .table-heading,
          .table-items {
            @apply gap-4 text-xs;

            .item-name {
              @apply basis-1/2  text-start pl-2;
            }

            .qty {
              flex-basis: 10%;
              
            }

            .price {
              flex-basis: 20%;
              
            }

            .total {
              flex-basis: 20%;
              justify-content: center;
              align-items: center;
              
            }

          }
        }

        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin-top: 20px;

          .icon{
            margin-right: 4px
          }
        }
      }
    }

    .save {
      margin-top: 60px;

      div{
        flex: 1;
      }

      .right {
        justify-content: flex-end;
      }

      .left{
        text-align: left;
      }
    }
  }

  .input {
    @apply mb-6
  }

  label {
    @apply text-xs mb-2 text-start
  }

  input,
  select {
    @apply w-full p-3 border-none;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    text-align: left;

    &:focus {
      outline: none;
    }
  }

 

}
</style>