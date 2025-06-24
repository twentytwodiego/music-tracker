<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Add Song</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Floating Inputs -->
      <div class="floating-input">
        <input id="titleInput" type="text" v-model="song.title" placeholder=" " />
        <label for="titleInput">Title</label>
      </div>

      <div class="floating-input">
        <input id="artistInput" type="text" v-model="song.artist" placeholder=" " />
        <label for="artistInput">Artist</label>
      </div>

      <div class="floating-input">
        <input id="linkInput" type="text" v-model="song.link" placeholder=" " />
        <label for="linkInput">Link to coverart</label>
      </div>

      <!-- Mood -->
      <ion-item>
        <ion-label>Mood</ion-label>
        <ion-select v-model="song.mood" placeholder="Select mood">
          <ion-select-option value="happy">Happy</ion-select-option>
          <ion-select-option value="sad">Sad</ion-select-option>
          <ion-select-option value="chill">Chill</ion-select-option>
          <ion-select-option value="energetic">Energetic</ion-select-option>
          <ion-select-option value="romantic">Romantic</ion-select-option>
          <ion-select-option value="nostalgic">Nostalgic</ion-select-option>
          <ion-select-option value="angry">Angry</ion-select-option>
          <ion-select-option value="motivated">Motivated</ion-select-option>
          <ion-select-option value="lonely">Lonely</ion-select-option>
          <ion-select-option value="melancholic">Melancholic</ion-select-option>
        </ion-select>
      </ion-item>

      <!-- Bewertung mit Eingabe -->
      <ion-item lines="none" class="rating-item">
        <ion-label>Rating</ion-label>
        <div class="rating-input-wrapper">
          <ion-input
            type="number"
            step="0.1"
            min="0"
            max="10"
            v-model.number="song.rating"
            class="rating-input"
          ></ion-input>
          <span class="rating-suffix">/10</span>
        </div>
      </ion-item>

      <!-- MP3 Datei -->
      <ion-item>
        <ion-label>File</ion-label>
        <div class="file-input-wrapper">
          <label class="custom-file-input-label">
            {{ selectedFileName || 'Choose File' }}
            <input type="file" accept="audio/mpeg" @change="handleFileUpload" class="custom-file-input" />
          </label>
        </div>
      </ion-item>

      <!-- Standortwahl -->
      <ion-item>
        <ion-label>Location</ion-label>
        <ion-button expand="block" @click="openMap">Auf Karte setzen</ion-button>
        <ion-button expand="block" @click="useCurrentLocation">Aktueller Standort</ion-button>
      </ion-item>

      <div v-if="showMap" style="height: 300px; margin: 1rem 0;">
        <div id="map" style="height: 100%;"></div>
      </div>

      <p v-if="song.coordinates">Standort gespeichert: {{ song.coordinates.lat }}, {{ song.coordinates.lng }}</p>

      <ion-button expand="block" @click="saveSong" :disabled="!isFormValid">Save</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { computed } from 'vue'

const isFormValid = computed(() => {
  return (
    song.value.title.trim() &&
    song.value.artist.trim() &&
    song.value.link.trim() &&
    song.value.mood &&
    song.value.rating &&
    song.value.coordinates &&
    song.value.mp3DataUrl
  )
})


import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonSelect, IonSelectOption,
  IonButton, IonInput
} from '@ionic/vue'
import { ref, onMounted, nextTick } from 'vue'
import L from 'leaflet'

const showMap = ref(false)
const mapInstance = ref<any>(null)
const marker = ref<any>(null)

const selectedFileName = ref('')

const song = ref({
  title: '',
  artist: '',
  link: '',
  mood: '',
  rating: 5,
  addedDate: new Date().toISOString(),
  coordinates: null as null | { lat: number; lng: number },
  mp3DataUrl: ''
})

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  selectedFileName.value = file.name
  const reader = new FileReader()
  reader.onload = () => {
    song.value.mp3DataUrl = reader.result as string
  }
  reader.readAsDataURL(file)
}

function openMap() {
  showMap.value = true
  nextTick(() => {
    if (!mapInstance.value) {
      mapInstance.value = L.map('map').setView([47.3769, 8.5417], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapInstance.value)

      marker.value = L.marker([47.3769, 8.5417], { draggable: true }).addTo(mapInstance.value)

      marker.value.on('dragend', () => {
        const pos = marker.value.getLatLng()
        song.value.coordinates = { lat: pos.lat, lng: pos.lng }
      })
    }
  })
}

function useCurrentLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      song.value.coordinates = { lat: latitude, lng: longitude }
      alert('Standort gespeichert!')
    },
    () => {
      alert('Standort konnte nicht ermittelt werden.')
    }
  )
}

function saveSong() {
  const songs = JSON.parse(localStorage.getItem('songs') || '[]')
  songs.push({ ...song.value, id: Date.now() })
  localStorage.setItem('songs', JSON.stringify(songs))
  alert('Song gespeichert!')

  song.value = {
    title: '',
    artist: '',
    link: '',
    mood: '',
    rating: 5,
    addedDate: new Date().toISOString(),
    coordinates: null,
    mp3DataUrl: ''
  }
  selectedFileName.value = ''

  if (mapInstance.value) {
    mapInstance.value.remove()
    mapInstance.value = null
    showMap.value = false
  }
}
</script>

<style scoped>
.floating-input {
  position: relative;
  margin-bottom: 20px;
}

.floating-input input {
  width: 100%;
  padding: 12px 4px 6px 4px;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid #ccc;
  background: transparent;
  outline: none;
}

.floating-input label {
  position: absolute;
  left: 5px;
  top: 12px;
  font-size: 14px;
  color: #666;
  pointer-events: none;
  transition: all 0.2s ease;
}

.floating-input input:focus + label,
.floating-input input:not(:placeholder-shown) + label {
  top: -8px;
  font-size: 12px;
  color: #333;
}

.file-input-wrapper {
  margin-left: 12px;
  flex: 1;
}

.custom-file-input-label {
  display: inline-block;
  background: #3880ff;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.custom-file-input {
  display: none;
}

.rating-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rating-input-wrapper {
  display: flex;
  align-items: center;
}

.rating-input {
  width: 70px;
  text-align: right;
}

.rating-suffix {
  margin-left: 4px;
  font-weight: bold;
  color: #555;
}
</style>
