const { VueRouter } = window;

const Error = {
  template: `
    <div class="error">
      <h1>Error</h1>
      <p>{{ error }}</p>
      <router-link to="/home">Home</router-link>
    </div>
  `,

  data() {
    return {
      error: '',
    };
  },

  components: {
    'router-link': VueRouter.RouterLink,
  },
};

export default Error;
