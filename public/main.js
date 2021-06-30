/* eslint-disable import/extensions */
import router from './components/router.js';

const { Vue, VueRouter } = window;

// const template = '<router-view />';
// const components = { 'router-view': VueRouter.RouterView };
// const RootComponent = { template, components };

const RootComponent = {
  template: `
    <!-- <router-view v-on:loading="showLoader" /> -->

    <router-view v-slot="{Component}">
      <transition name="fade" mode="out-in">
        <component v-bind:is="Component" v-on:loading="showLoader"></component>
      </transition> 
    </router-view>
    
    <transition name="fade">
      <div class="loader" v-show="isLoading"></div>
    </transition>
  `,

  components: {
    'router-view': VueRouter.RouterView,
    transition: Vue.Transition,
  },

  data() {
    return {
      isLoading: false,
    };
  },

  methods: {
    showLoader(value) {
      this.isLoading = value;
    },
  },
};

const app = Vue.createApp(RootComponent);
app.use(router);
const vm = app.mount('#app');
