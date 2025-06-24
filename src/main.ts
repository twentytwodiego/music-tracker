import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { IonicVue } from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

/* Dark Mode */
import '@ionic/vue/css/palettes/dark.system.css'

/* Theme variables */
import './theme/variables.css'

/* Leaflet */
import 'leaflet/dist/leaflet.css'

/* FontAwesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faMap,
  faStar,
  faPlus,
  faMasksTheater,
  faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons'

library.add(faMap, faStar, faPlus, faMasksTheater, faMagnifyingGlass)

const app = createApp(App)
  .use(IonicVue)
  .use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

router.isReady().then(() => {
  app.mount('#app')
})
