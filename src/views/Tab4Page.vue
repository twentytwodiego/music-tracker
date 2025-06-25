<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Playlists</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <div v-for="mood in moods" :key="mood.value">
          <ion-item button @click="toggleMood(mood.value)" :detail="false">
            <ion-label>
              <h2>{{ mood.label }}</h2>
            </ion-label>
            <ion-icon
              :icon="expandedMood === mood.value ? chevronDownOutline : chevronForwardOutline"
              slot="end"
            />
          </ion-item>

          <ion-list v-show="expandedMood === mood.value">
            <ion-item v-for="song in getSongsByMood(mood.value)" :key="song.id">
              <ion-label>
                <h3>{{ song.title }}</h3>
                <p>{{ song.artist }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonIcon
} from '@ionic/vue'

import { ref } from 'vue'
import { chevronForwardOutline, chevronDownOutline } from 'ionicons/icons'

const moods = [
  { value: 'happy', label: 'Happy' },
  { value: 'sad', label: 'Sad' },
  { value: 'chill', label: 'Chill' },
  { value: 'angry', label: 'Angry' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'motivated', label: 'Motivated' },
]

const expandedMood = ref('')
const allSongs = ref(JSON.parse(localStorage.getItem('songs') || '[]'))

function toggleMood(mood: string) {
  expandedMood.value = expandedMood.value === mood ? '' : mood
}

function getSongsByMood(mood: string) {
  return allSongs.value.filter((song: any) =>
    song.mood === mood &&
    song.title &&
    song.artist &&
    song.link
  )
}
</script>

<style scoped>
ion-item {
  --background: #f4f4f4;
  margin-bottom: 8px;
  border-radius: 8px;
  color: black;
}

ion-item h2,
ion-item h3,
ion-item p {
  color: black;
  margin: 0;
}

ion-item h2 {
  font-size: 18px;
}

ion-item h3 {
  font-weight: 500;
}

ion-item p {
  font-size: 14px;
}
</style>
