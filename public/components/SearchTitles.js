const { VueRouter } = window;

const SearchTitles = {
  template: `
    <div class="search">
      <nav class="navbar">
        <ul>
          <li><router-link to="/home">🏠</router-link></li>
        </ul>
        <ul>
          <li><a href="/logout" class="btn-plain" v-on:click="logout">🚪</a></li>
        </ul>
      </nav>
      <div class="search-form">
        <h3>Search</h3>
        <form action="/searchTitles" method="GET" v-on:submit="searchTitles">
          <input type="text" name="query" v-bind:value="query" />
          <input type="submit" value="Search" />
        </form>
      </div>
      <div class="notes">
        <h3>Notes</h3>
        <ul>
          <li v-for="note in notes" v-bind:key="note._id">
            <router-link v-bind:to="'/notes/'+note._id">{{ note.title || 'Untitled' }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  `,

  components: {
    'router-link': VueRouter.RouterLink,
  },

  data() {
    return {
      notes: [],
      isLoading: false,
    };
  },

  emits: [
    'loading',
  ],

  props: [
    'query',
  ],

  watch: {
    query: {
      handler() { this.fetchData(); },
      immediate: true,
    },
  },

  methods: {
    async fetchData() {
      this.$emit('loading', true);
      const token = this.getToken();

      const response = await fetch(`/titles?query=${this.query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        this.notes = data.notes;
      } else {
        this.$router.push('/login');
      }
      this.$emit('loading', false);
    },
    searchTitles(e) {
      e.preventDefault();
      const query = e.target.elements.query.value;
      if (query) this.$router.push(`/searchTitles/${query}`);
    },
    logout(e) {
      e.preventDefault();
      localStorage.removeItem('auth-token');
      this.$router.push('/login');
    },
    getToken() {
      const token = localStorage.getItem('auth-token');
      // if (!token) { this.$router.push('/login'); }
      return token;
    },
  },
};

export default SearchTitles;
