const { VueRouter } = window;

const Edit = {
  template: `
    <div class="edit">
      <form action="/update>" method="POST" v-on:submit="updateMarkdown">
        <textarea id="markdown" name="markdown" rows="4" cols="50" v-model="markdown"></textarea>

        <ul class="control">
          <li><router-link to="/help" class="btn-plain">❔</router-link></li>
          <li><button type="submit" class="btn-plain">💾</button></li>
          <li><router-link v-bind:to="'/notes/'+id" class="btn-plain">❎</router-link></li>
        </ul>
      </form>
    </div>
  `,

  components: {
    'router-link': VueRouter.RouterLink,
  },

  data() {
    return {
      markdown: '',
    };
  },

  emits: [
    'loading',
  ],

  props: [
    'id',
  ],

  mounted() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      this.$emit('loading', true);
      const token = this.getToken();

      const response = await fetch(`/edit/${this.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        this.markdown = data.note.markdown;
      } else {
        this.$router.push('/login');
      }
      this.$emit('loading', false);
    },
    async updateMarkdown(e) {
      e.preventDefault();
      this.$emit('loading', true);
      const token = this.getToken();

      const response = await fetch(`/notes/${this.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: this.markdown }),
      });

      if (response.ok) {
        const note = await response.json();
        this.markdown = note.markdown;
      } else {
        this.$router.push('/login');
      }
      this.$emit('loading', false);
    },
    getToken() {
      const token = localStorage.getItem('auth-token');
      // if (!token) { this.$router.push('/login'); }
      return token;
    },
  },
};

export default Edit;
