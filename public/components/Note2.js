/* eslint-disable no-alert */
/* eslint-disable no-underscore-dangle */
const { VueRouter, marked } = window;

const Note2 = {
  template: `
    <div class="editor" v-if="isEditing">
      <form action="/update>" method="POST" v-on:submit="updateMarkdown">
        <ul class="control">
          <li><router-link to="/help" class="btn-plain">❔</router-link></li>
          <li><button type="submit" class="btn-plain">💾</button></li>
          <li><button class="btn-plain" v-on:click="toggleEditor">❎</button></li>
        </ul>

        <textarea id="markdown" name="markdown" rows="4" cols="50" v-model="note.markdown"></textarea>
      </form>
    </div>

    <div class="note" v-else>
      <nav class="nav">
        <ul class="breadcrumb">
          <li>
            <router-link to="/home">🏠</router-link>
          </li>
          <li v-if="path[0]?.parentNodeId">...</li>
          <li v-for="note in path" v-bind:key="note._id">
            <router-link v-bind:to="'/notes/'+note._id">{{ note.title || 'Untitled' }}</router-link>
          </li>
        </ul>
        <ul class="control">
          <li><button class="btn-plain" id="move-note-btn" v-on:click="updateParentId">🔃</button></li>
          <li><button class="btn-plain" id="delete-btn" v-on:click="noteDelete">🗑️</button></li>
          <li><button class="btn-plain" v-on:click="toggleEditor">✏️</button></li>
        </ul>
      </nav>

      <div class="content" v-html="html">
      </div>
      
      <div class="child-notes">
        <h3 class="child-notes__header">Notes</h3>
        <ul>
          <li v-for="note in childNotes" v-bind:key="note._id" class="child-notes__link">
            <router-link v-bind:to="'/notes/'+note._id">{{ note.title || 'Untitled' }}</router-link>
          </li>
          <li class="child-notes__new-note">
            <button class="btn-plain" v-on:click="submitCreate">Add a note</button>
            <!-- <form action="/create" method="POST" v-on:submit="submitCreate">
              <input type="hidden" name="parentNodeId" v-bind:value="id" />
              <input type="submit" value="Add a note" class="btn-link" />
            </form> -->
          </li>
        </ul>
      </div>
    </div>
  `,

  data() {
    return {
      note: {},
      html: '',
      childNotes: [],
      path: [],
      isEditing: false,
    };
  },

  props: [
    'id',
  ],

  emits: [
    'loading',
  ],

  watch: {
    id: {
      handler() { this.fetchData(); },
      immediate: true,
    },
  },

  components: {
    'router-link': VueRouter.RouterLink,
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
        this.note = data.note;
        this.html = marked(data.note.markdown);
        this.childNotes = data.childNotes;
        this.path = data.path;
      } else {
        this.$router.push('/login');
      }
      this.$emit('loading', false);
    },
    async submitCreate(e) {
      e.preventDefault();
      this.$emit('loading', true);
      const token = this.getToken();
      const { nodeId } = this.note;

      const response = await fetch('/notes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId }),
      });

      if (response.ok) {
        const data = await response.json();
        this.$router.push(`/notes/${data.note._id}`);
      } else {
        this.$router.push('/home');
      }
      this.$emit('loading', false);
    },
    async noteDelete() {
      const result = window.confirm('Are you sirius?');
      if (result) {
        this.$emit('loading', true);
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
        this.$emit('loading', false);
      }
    },
    async updateParentId() {
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
    async updateMarkdown(e) {
      e.preventDefault();
      this.$emit('loading', true);
      const token = this.getToken();
      const markdown = e.target.elements.markdown.value;

      const response = await fetch(`/notes/${this.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown }),
      });

      if (response.ok) {
        const data = await response.json();
        this.note = data.note;
        this.html = marked(data.note.markdown);
      } else {
        this.$router.push('/login');
      }
      this.$emit('loading', false);
    },
    toggleEditor() {
      this.isEditing = !this.isEditing;
    },
    getToken() {
      const token = localStorage.getItem('auth-token');
      // if (!token) { this.$router.push('/login'); }
      return token;
    },
  },
};

export default Note2;
