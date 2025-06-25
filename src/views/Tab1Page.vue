<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Trackmap</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <div id="map1"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'
import { onMounted, nextTick } from 'vue'
import L from 'leaflet'

let map: any = null

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      if (map) {
        map.remove()
        map = null
      }

      map = L.map('map1', {
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

      const songs = JSON.parse(localStorage.getItem('songs') || '[]')

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
    }, 200)
  })
})
</script>

<style scoped>
#map1 {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
