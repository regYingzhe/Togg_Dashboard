import lazyLoading from './lazyLoading'

export default {
  name: 'Dashboard',
  path: '/dashboard',
  component: lazyLoading('statistics/charts/Charts'),
  meta: {
    default: true,
    title: 'menu.dashboard',
    iconClass: 'vuestic-icon vuestic-icon-dashboard'
  }
}
