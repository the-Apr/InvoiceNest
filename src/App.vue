<template>
  <div>
    <div v-if="!mobile" class="app">
      <navigation />
      <div class="app-content">
        <invoice-modal />
        <router-view />
      </div>
    </div>
    <div v-else class="mobile-message">
      <h2>Sorry, this app is not supported on mobile devices</h2>
      <p>To use this app, please use a computer or tablet</p>
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import InvoiceModal from '@/components/InvoiceModal.vue'

export default {
  name: "app",
  
  components: {
    Navigation,
    InvoiceModal
  },

  data() {
    return {
      mobile: null,
    }
  },

  created() {
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen)
  },

  methods: {
    checkScreen() {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 750) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
    }
  }
}
</script>



<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

$box-shadow:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.app {
  background-color: #141625;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @screen lg {
    flex-direction: row !important;
  }

  .app-content {
    @apply px-5 flex-1 relative flex flex-col
  }
}
.mobile-message {
  @apply flex flex-col items-center justify-center px-4 text-center;
  height: 100vh;
  background-color: #141625;
  color: #fff;

  h2{
    font-size: 18px;
    font-weight: 500;
  }

  p { 
    margin-top: 16px;
  }
}

button,
.button {
  cursor: pointer;
  padding: 16px 24px;
  border-radius: 30px;
  border: none;
  font-size: 12px;
  margin-right: 8px;
  color: #fff;
}

.dark-purple {
  background-color: #252945;
}

.red {
  background-color: #ec5757;
}

.purple {
  background-color: #7c5dfa;
}

.green {
  background-color: #33d69f;
}

.orange {
  background-color: #ff8f00;
}

.box {
  width: 100%;
  padding: 40px 10px;
  max-width: 850px;
  margin: 0 auto;

  @media (min-width: 900px) {
    padding-top: 72px;
  }
}

.icon {
  @apply w-3 h-3;
  color: #7c5dfa;
}
// Status Button Styling

.status-button {
  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }
  font-size: 12px;
  margin-right: 30px;
  align-items: center;
  padding: 8px 30px;
  border-radius: 10px;
}

.paid {
  &::before {
    background-color: #33d69f;
  }
  color: #33d69f;
  background-color: rgba(51, 214, 160, 0.1);
}

.pending {
  &::before {
    background-color: #ff8f00;
  }
  color: #ff8f00;
  background-color: rgba(255, 145, 0, 0.1);
}

.draft {
  &::before {
    background-color: #dfe3fa;
  }
  color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.1);
}
</style>
