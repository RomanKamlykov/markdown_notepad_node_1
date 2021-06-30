const { VueRouter } = window;

const Login = {
  template: `
    <div class="login">
      <h1>Login</h1>
      <form action="/login" method="POST" v-on:submit="submitLogin">
        <div>
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
      <router-link to="/register">Register</router-link>
    </div>
  `,

  components: {
    'router-link': VueRouter.RouterLink,
  },

  methods: {
    async submitLogin(e) {
      e.preventDefault();
      const name = e.target.elements.name.value;
      const password = e.target.elements.password.value;

      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('auth-token', token);
        this.$router.push('/home');
      }
    },
  },
};

export default Login;
