/* eslint-disable object-curly-newline */
/* eslint-disable import/extensions */
import Home from './Home.js';
import Note from './Note.js';
import Note2 from './Note2.js';
import Edit from './Edit.js';
import Search from './Search.js';
import Login from './Login.js';
import Register from './Register.js';
import Error from './Error.js';

const { VueRouter } = window;

const Foo = { template: '<div>foo</div>' };

const routes = [
  { path: '/home', component: Home, meta: { requiresAuth: true } },
  { path: '/notes/:id', component: Note, props: true, meta: { requiresAuth: true } },
  { path: '/edit/:id', component: Edit, props: true, meta: { requiresAuth: true } },
  { path: '/search/:query', component: Search, props: true, meta: { requiresAuth: true } },
  { path: '/searchTitles/:query', component: SearchTitles, props: true, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/error', component: Error },
  { path: '/help', component: Foo },
  { path: '/notes-tree', component: Foo },
  { path: '/:pathMatch(.*)*', redirect: '/home' },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

// check authentification
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem('auth-token') == null) {
      next();
      // next({
      //   path: '/login',
      //   // params: { nextUrl: to.fullPath }
      // })
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
