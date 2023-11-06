import { createStore } from 'vuex';
import { db } from "../firebase/firebaseInit"
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default createStore({
  state: {
    invoiceData: [],
    invoiceModal: null,
    modalActive: null,
    invoicesLoaded: null,
    currentInvoiceArray: null,
    editInvoice: null,
  },

  getters: {
  },

  mutations: {
    toggleInvoice(state) {
      state.invoiceModal = !state.invoiceModal;
    },

    toggleModal(state) {
      state.modalActive  = !state.modalActive;
    },

    setInvoiceData(state, payload) {
      state.invoiceData.push(payload)
    },

    invoicesLoaded(state) {
      state.invoicesLoaded = true;
    },

    setCurrentInvoice(state, payload) {
      state.currentInvoiceArray = state.invoiceData.filter(invoice => {
        return invoice.invoiceId === payload;
      })
    },

    toggleEditInvoice(state) {
      state.editInvoice = !state.editInvoice;
    },

    deleteInvoice (state, payload) {
      state.invoiceData = state.invoiceData.filter(invoice => invoice.docId !== payload)
    },

    updateStatusToPaid(state, payload) {
      state.invoiceData.forEach(invoice => {
        if (invoice.docId === payload){
          invoice.invoicePaid = true;
          invoice.invoicePending =false;
        }
      })
    },

    updateStatusToPending(state, payload) {
      state.invoiceData.forEach(invoice => {
        if (invoice.docId === payload){
          invoice.invoicePaid = false;
          invoice.invoicePending = true;
          invoice.invoiceDraft = false;
        }
      })
    }
  }, 

  actions: {
    async getInvoices({commit, state}){
      const getCollection = collection(db, 'invoices');
      const results = await getDocs(getCollection);
      results.forEach(doc => {
        if(!state.invoiceData.some((invoice) => invoice.docId === doc.id)) {
          const data = {
            docId: doc.id,
            invoiceId: doc.data().invoiceId,
            billerStreetAddress: doc.data().billerStreetAddress,
            billerCity: doc.data().billerCity,
            billerZipCode: doc.data().billerZipCode,
            billerCountry: doc.data().billerCountry,
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            clientStreetAddress: doc.data().clientStreetAddress,
            clientCity: doc.data().clientCity,
            clientZipCode: doc.data().clientZipCode,
            clientCountry: doc.data().clientCountry,
            invoiceDateUnix: doc.data().invoiceDateUnix,
            invoiceDate: doc.data().invoiceDate,
            paymentTerms: doc.data().paymentTerms,
            paymentDueDateUnix: doc.data().paymentDueDateUnix,
            paymentDueDate: doc.data().paymentDueDate,
            productDescription: doc.data().productDescription,
            invoiceItemList: doc.data().invoiceItemList,
            invoiceTotal: doc.data().invoiceTotal,
            invoicePending: doc.data().invoicePending,
            invoiceDraft: doc.data().invoiceDraft,
            invoicePaid: doc.data().invoicePaid,
          };
          commit('setInvoiceData', data);
        }
      });

      commit('invoicesLoaded')
    },

    async updateInvoice({commit, dispatch}, {docId, routeId}) {
      commit('deleteInvoice', docId);
      await dispatch ('getInvoices');
      commit('toggleInvoice');
      commit('toggleEditInvoice');
      commit('setCurrentInvoice', routeId)
    },

    async DELETE_Invoice({commit}, docId) {
      const getCollection = collection(db, 'invoices');
      const getInvoice = doc(getCollection, docId);
      await deleteDoc(getInvoice);
      commit('deleteInvoice', docId);
    },

    async updateStatusToPaidSt({commit}, docId) {
      const getCollection = collection(db, 'invoices');
      const getInvoice = doc(getCollection, docId);
      await updateDoc(getInvoice, {
        invoicePaid: true,
        invoicePending: false,
      });
      commit('updateStatusToPaid', docId);
    },

    async updateStatusToPendingSt({commit}, docId) {
      const getCollection = collection(db, 'invoices');
      const getInvoice = doc(getCollection, docId);
      await updateDoc(getInvoice, {
        invoicePaid: false,
        invoicePending: true,
        invoiceDraft: false,
      });
      commit('updateStatusToPending', docId);
    }
  },
  modules: {
  }
})
