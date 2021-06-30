/* eslint-disable no-alert */
/* eslint-disable no-underscore-dangle */
const { VueRouter, marked } = window;

const Note = {
  template: `
    <div class="note">
      <nav class="navbar">
        <ul class="breadcrumb">
          <li><router-link to="/home">🏠</router-link></li>
          <li v-if="path[0]?.parentNodeId">...</li>
          <li v-for="note in path" v-bind:key="note._id">
            <router-link v-bind:to="'/notes/'+note._id">{{ note.title || 'Untitled' }}</router-link>
          </li>
        </ul>

        <ul class="control">
          <li><a href="/update" class="btn-plain" v-on:click="updateParentId">🔃</a></li>
          <li><a href="/delete" class="btn-plain" v-on:click="deleteNote">🗑️</a></li>
          <li><router-link class="btn-plain" v-bind:to="'/edit/'+id">✏️</router-link></li>
        </ul>
      </nav>

      <div class="content" v-html="html">
      </div>
      
      <div class="child-notes">
        <h3>Notes</h3>
        <ul>
          <li v-for="note in childNotes" v-bind:key="note._id">
            <router-link v-bind:to="'/notes/'+note._id">{{ note.title || 'Untitled' }}</router-link>
          </li>
          <li>
            <form action="/create" method="POST" v-on:submit="createNote">
              <input type="hidden" name="parentNodeId" v-bind:value="note.nodeId" />
              <input type="submit" class="btn-link" value="Add a note" />
            </form>
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
      note: {},
      html: '',
      childNotes: [],
      path: [],
    };
  },

  emits: [
    'loading',
  ],

  props: [
    'id',
  ],

  watch: {
    id: {
      handler() { this.fetchData(); },
      immediate: true,
    },
  },

  methods: {
    async fetchData() {
      this.$emit('loading', true);
      const token = this.getToken();

      const response = await fetch(`/notes/${this.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        this.childNotes = data.childNotes;
        this.path = data.path;
        this.note = data.note;
        this.html = marked(data.note.markdown);
      } else {
        this.$router.push('/login');
      }
      this.$emit('loading', false);
    },
    async createNote(e) {
      e.preventDefault();
      const token = this.getToken();
      const { nodeId } = this.note;

      const response = await fetch('/notes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId }),
      });

      if (response.ok) {
        const data = await response.json();
        this.$router.push(`/edit/${data.note._id}`);
      } else {
        this.$router.push('/login');
      }
    },
    async deleteNote(e) {
      e.preventDefault();
      const result = window.confirm('Are you sirius?');
      if (result) {
        const token = this.getToken();

        const response = await fetch(`/notes/${this.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.parentNote) {
            this.$router.push(`/notes/${data.parentNote._id}`);
          } else {
            this.$router.push('/home');
          }
        }
      }
    },
    async updateParentId(e) {
      e.preventDefault();
      const result = window.prompt('Enter the new parent id');
      if (result) {
        this.$emit('loading', true);
        const token = this.getToken();

        const response = await fetch(`/notes/${this.id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentId: result }),
        });

        if (response.ok) {
          const data = await response.json();
          this.path = data.path;
        } else {
          this.$router.push('/login');
        }
        this.$emit('loading', false);
      }
    },
    getToken() {
      const token = localStorage.getItem('auth-token');
      // if (!token) { this.$router.push('/login'); }
      return token;
    },
  },
};

export default Note;
