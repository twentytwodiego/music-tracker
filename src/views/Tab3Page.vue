<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Add Song</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
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

      <div class="floating-input">
        <input
          id="ratingInput"
          type="number"
          step="0.1"
          min="1"
          max="10"
          v-model.number="song.rating"
          placeholder=" "
        />
        <label for="ratingInput">Rating (1–10)</label>
      </div>

      <ion-item>
        <ion-label>Mood</ion-label>
        <ion-select v-model="song.mood" placeholder="Select mood">
          <ion-select-option value="happy">Happy</ion-select-option>
          <ion-select-option value="sad">Sad</ion-select-option>
          <ion-select-option value="chill">Chill</ion-select-option>
          <ion-select-option value="angry">Angry</ion-select-option>
          <ion-select-option value="romantic">Romantic</ion-select-option>
          <ion-select-option value="motivated">Motivated</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-label>Location</ion-label>
        <ion-button expand="block" @click="loadMap">Pin on map</ion-button>
        <ion-button expand="block" @click="useCurrentLocation">Current location</ion-button>
      </ion-item>

      <div v-if="showMap" class="map-container">
        <div id="map3"></div>
      </div>

      <p v-if="song.coordinates">
        Standort gespeichert: {{ song.coordinates.lat }}, {{ song.coordinates.lng }}
      </p>

      <ion-button expand="block" @click="saveSong" :disabled="!isFormValid">Save</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonSelect, IonSelectOption, IonButton
} from '@ionic/vue'
import { ref, computed, nextTick } from 'vue'
import L from 'leaflet'

const song = ref({
  title: '',
  artist: '',
  link: '',
  mood: '',
  coordinates: null as null | { lat: number; lng: number },
  rating: null as number | null
})

const showMap = ref(false)
let map: any = null
let marker: any = null

const isFormValid = computed(() =>
  song.value.title &&
  song.value.artist &&
  song.value.link &&
  song.value.mood &&
  song.value.coordinates &&
  typeof song.value.rating === 'number' &&
  song.value.rating >= 1 &&
  song.value.rating <= 10
)

function loadMap() {
  showMap.value = true

  nextTick(() => {
    setTimeout(() => {
      const mapElement = document.getElementById('map3')
      if (!mapElement) return

      if (map) {
        map.remove()
        map = null
      }

      map = L.map('map3', {
        center: [47.3769, 8.5417],
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      marker = L.marker([47.3769, 8.5417], { draggable: true }).addTo(map)
      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        song.value.coordinates = { lat: pos.lat, lng: pos.lng }
      })

      map.invalidateSize()
    }, 200)
  })
}

function useCurrentLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      song.value.coordinates = { lat: latitude, lng: longitude }

      if (map) {
        map.setView([latitude, longitude], 13)
        marker.setLatLng([latitude, longitude])
      }

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
  resetForm()
}

function resetForm() {
  song.value = {
    title: '',
    artist: '',
    link: '',
    mood: '',
    coordinates: null,
    rating: null
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
  color: rgb(0, 0, 0);
}
.floating-input label {
  position: absolute;
  left: 5px;
  top: 12px;
  font-size: 14px;
  color: #333232;
  pointer-events: none;
  transition: all 0.2s ease;
}
.floating-input input:focus + label,
.floating-input input:not(:placeholder-shown) + label {
  top: -8px;
  font-size: 12px;
  color: #333232;
}
.map-container {
  height: 300px;
  margin: 1rem 0;
}
#map3 {
  height: 100%;
  width: 100%;
  border: 2px solid #444;
  border-radius: 10px;
}
</style>
