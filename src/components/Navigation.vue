<template>
  <header>
    <div class="branding">
      <fa-icon :icon="['fas', 'file-invoice']"  class="icon"/>
    </div>
  </header>
</template>

<script>
export default {
  name: "navigation"

}
</script>

<style lang="scss" scoped>
header {
  @apply flex flex-row ;
  z-index: 99;
  background-color: #1e2139;

  @screen lg{
    @apply min-h-full flex-col;
    min-width: 60px;
    border-radius: 0 20px 20px 0;
  }

  .branding {
    @apply p-6 flex h-7 justify-center items-center;
    border-radius: 0 20px 20px 0;
    background-color: #7c5dfa;

    @screen lg {
      width: 100%;
    }

    .icon {
      @apply w-auto h-7 text-white;
    }
  }


}
</style>