/* eslint-disable no-underscore-dangle */
const { VueRouter } = window;

const Home = {
  template: `
    <div class="home">
      <nav class="navbar">
        <ul>
          <li><router-link to="/home">🏠</router-link></li>
        </ul>
        <ul>
          <li><a href="/logout" class="btn-plain" v-on:click="logout">🚪</a></li>
        </ul>
      </nav>

      <div class="child-notes">
        <h3>Notes</h3>
        <ul>
          <li v-for="note in childNotes" v-bind:key="note._id">
            <router-link v-bind:to="'/notes/'+note._id">{{ note.title || 'Untitled' }}</router-link>
          </li>
          <li>
            <form action="/create" method="POST" v-on:submit="createNote">
              <input type="hidden" name="parentNodeId" value="" />
              <input type="submit" class="btn-link" value="Add a note" />
            </form>
          </li>
        </ul>
      </div>
      
      <div class="search-form">
        <h3>Search</h3>
        <form action="/search" method="GET" v-on:submit="searchNotes">
          <input type="text" name="query" />
          <input type="submit" value="Search" />
        </form>
      </div>
      
      <div class="recent-notes">
        <h3>Recent</h3>
        <ul>
          <li v-for="note in recentNotes" v-bind:key="note._id">
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
      childNotes: [],
      recentNotes: [],
    };
  },

  emits: [
    'loading',
  ],

  mounted() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      this.$emit('loading', true);
      const token = this.getToken();
      const response = await fetch('/home', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        this.childNotes = data.childNotes;
        this.recentNotes = data.recentNotes;
      } else {
        this.$router.push('/login');
      }
      this.$emit('loading', false);
    },
    async createNote(e) {
      e.preventDefault();
      const token = this.getToken();
      const nodeId = '';

      const response = await fetch('/notes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId }),
      });

      if (response.ok) {
        const data = await response.json();
        this.$router.push(`/notes/${data.note._id}`);
      } else {
        this.$router.push('/login');
      }
    },
    searchNotes(e) {
      e.preventDefault();
      const query = e.target.elements.query.value;
      if (query) this.$router.push(`/search/${query}`);
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

export default Home;
