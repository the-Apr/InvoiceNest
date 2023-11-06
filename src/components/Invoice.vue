<template>
  <div>
    <router-link class="invoice flex" :to="{ name: 'Invoice', params: {invoiceId: invoice.invoiceId} }">
      <div class="left flex">
        <span class="tracking-number">#{{invoice.invoiceId}}</span>
        <span class="due-date">{{invoice.paymentDueDate}}</span>
        <span class="person">{{invoice.clientName}}</span>
      </div>

      <div class="right flex">
        <span class="price">${{invoice.invoiceTotal}}</span>
        <div 
        class="status-button flex" 
        :class="{paid: invoice.invoicePaid, 
        draft: invoice.invoiceDraft, 
        pending: invoice.invoicePending}">
          <span v-if="invoice.invoicePaid">Paid</span>
          <span v-if="invoice.invoiceDraft">Draft</span>
          <span v-if="invoice.invoicePending">Pending</span>
        </div>
        <div class="icon">
         <fa-icon :icon="['fas', 'arrow-right']" />
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "Invoice",
  props: ["invoice"]
}
</script>

<style lang="scss" scoped>
.invoice {
  @apply cursor-pointer gap-4 mb-4 py-7 px-8 items-center;
  text-decoration: none;
  color: #fff;
  border-radius: 20px;
  background-color: #1e2139;

  span {
    font-size: 13px;

  }

  .left {
    @apply items-center gap-4 basis-3/5;

    span {
      flex: 1;
    }

    .tracking-number {
      text-transform: uppercase;
    }
  }

  .right {
    @apply gap-4 basis-2/5 items-center;

    .price {
      flex: 1;
      font-size: 16px;
      font-weight: 600px;
    }
  }

}
</style>