<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Search</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-searchbar v-model="query" :debounce="300" placeholder="Search for a song or artist"></ion-searchbar>

      <ion-list>
        <ion-item v-for="song in filteredSongs" :key="song.id">
          <ion-thumbnail slot="start">
            <img :src="song.link" alt="cover" />
          </ion-thumbnail>
          <ion-label>
            <h2>{{ song.title }}</h2>
            <p>{{ song.artist }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonList, IonItem, IonLabel, IonThumbnail
} from '@ionic/vue'
import { ref, computed, watchEffect } from 'vue'

interface Song {
  id: number
  title: string
  artist: string
  link: string
  mood: string
  rating: number
  addedDate: string
  coordinates: { lat: number; lng: number } | null
  mp3DataUrl: string
}

const query = ref('')
const allSongs = ref<Song[]>([])

// Neue Songs bei jeder Änderung der Suche laden

import { onIonViewWillEnter } from '@ionic/vue'

onIonViewWillEnter(() => {
  allSongs.value = JSON.parse(localStorage.getItem('songs') || '[]')
})

const filteredSongs = computed(() =>
  allSongs.value.filter((song: Song) => {
    const q = query.value.toLowerCase()
    return song.title.toLowerCase().includes(q) || song.artist.toLowerCase().includes(q)
  })
)
</script>

<style scoped>
ion-searchbar {
  margin-bottom: 16px;
}

ion-item {
  --background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 10px;
}

ion-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
