const { VueRouter } = window;

const Register = {
  template: `
    <div class="register">
      <h1>Register</h1>
      <form action="/register" method="POST" v-on:submit="submitRegister">
        <div>
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div>
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Register</button>
      </form>
      <router-link to="/login">Login</router-link>
    </div>
  `,

  components: {
    'router-link': VueRouter.RouterLink,
  },

  methods: {
    async submitRegister(e) {
      e.preventDefault();
      const email = e.target.elements.email.value;
      const name = e.target.elements.name.value;
      const password = e.target.elements.password.value;

      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      if (response.ok) {
        this.$router.push('/login');
      }
    },
  },
};

export default Register;
