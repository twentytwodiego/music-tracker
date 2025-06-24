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
          <ion-item button @click="toggleMood(mood.value)">
            <ion-label>
              <h2>{{ mood.emoji }} {{ mood.label }} Playlist</h2>
            </ion-label>
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
  IonContent, IonList, IonItem, IonLabel
} from '@ionic/vue'
import { ref } from 'vue'

const moods = [
  { value: 'happy', label: 'Happy', emoji: '😊' },
  { value: 'sad', label: 'Sad', emoji: '😢' },
  { value: 'chill', label: 'Chill', emoji: '😎' },
  { value: 'energetic', label: 'Energetic', emoji: '⚡' },
  { value: 'romantic', label: 'Romantic', emoji: '❤️' },
  { value: 'nostalgic', label: 'Nostalgic', emoji: '📻' },
  { value: 'angry', label: 'Angry', emoji: '😠' },
  { value: 'motivated', label: 'Motivated', emoji: '🔥' },
  { value: 'lonely', label: 'Lonely', emoji: '🥺' },
  { value: 'melancholic', label: 'Melancholic', emoji: '🌧️' }
]

const expandedMood = ref('')
const allSongs = ref(JSON.parse(localStorage.getItem('songs') || '[]'))

function toggleMood(mood: string) {
  expandedMood.value = expandedMood.value === mood ? '' : mood
}

function getSongsByMood(mood: string) {
  return allSongs.value.filter((song:any) => song.mood === mood && song.title && song.artist && song.link)
}
</script>

<style scoped>
ion-item {
  --background: #f4f4f4;
  margin-bottom: 8px;
  border-radius: 8px;
}
ion-item h2 {
  font-size: 18px;
  margin: 0;
}
ion-item h3 {
  margin: 0;
  font-weight: 500;
}
ion-item p {
  margin: 0;
  font-size: 14px;
  color: #666;
}
</style>
