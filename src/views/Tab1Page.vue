<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div id="map" style="height: 500px;"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent
} from '@ionic/vue'
import { onMounted, onActivated } from 'vue'
import L from 'leaflet'

let map: any

const songs = JSON.parse(localStorage.getItem('songs') || '[]')

onMounted(() => {
  map = L.map('map', {
    center: [46.8, 8.2],
    zoom: 7,
    zoomControl: false,
    attributionControl: false,
    inertia: false
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  songs.forEach((song: any) => {
    if (song.coordinates?.lat && song.coordinates?.lng && song.title && song.link) {
      const html = `
        <div class="custom-marker" style="
          width: 60px;
          height: 60px;
          border-radius: 10px;
          background-image: url('${song.link}');
          background-size: cover;
          background-position: center;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          color: white;
          font-size: 10px;
          font-weight: bold;
          padding-bottom: 4px;
          text-shadow: 0 0 2px black;
        ">
          ${song.title}
        </div>
      `

      L.marker([song.coordinates.lat, song.coordinates.lng], {
        icon: L.divIcon({
          className: '',
          html: html,
          iconSize: [60, 60],
          iconAnchor: [30, 60]
        })
      }).addTo(map)
    }
  })
})

onActivated(() => {
  if (map) {
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }
})
</script>

<style scoped>
#map {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}
</style>
