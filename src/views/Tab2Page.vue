<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Ranking</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label>Sort by</ion-label>
        <ion-select v-model="selectedSort" @ionChange="applySorting">
          <ion-select-option value="newest">Newest</ion-select-option>
          <ion-select-option value="oldest">Oldest</ion-select-option>
          <ion-select-option value="az">A-Z</ion-select-option>
          <ion-select-option value="rating-high">Rating: High → Low</ion-select-option>
          <ion-select-option value="rating-low">Rating: Low → High</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-list>
        <ion-item v-for="song in filteredAndSortedSongs" :key="song.id" button @click="editOrDelete(song)">
          <ion-thumbnail slot="start">
            <img :src="song.link" />
          </ion-thumbnail>
          <ion-label>
            <h2>{{ song.title }}</h2>
            <p>{{ song.artist }}</p>
            <p>Mood: {{ song.mood }}</p>
          </ion-label>
          <div class="rating-box" :class="getRatingClass(song.rating)">{{ song.rating }}</div>
        </ion-item>
      </ion-list>

      <ion-modal :is-open="isEditOpen" @didDismiss="closeEdit">
        <ion-header>
          <ion-toolbar>
            <ion-title>Bearbeiten</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeEdit">Schliessen</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="stacked">Titel</ion-label>
            <ion-input v-model="editSong.title" placeholder="Titel"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Artist</ion-label>
            <ion-input v-model="editSong.artist" placeholder="Artist"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Link zum Cover</ion-label>
            <ion-input v-model="editSong.link" placeholder="Link"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Mood</ion-label>
            <ion-select v-model="editSong.mood" interface="popover">
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

          <ion-item>
            <ion-label position="stacked">Rating</ion-label>
            <ion-input
              v-model.number="editSong.rating"
              type="number"
              :min="0"
              :max="10"
              step="0.1"
              @input="enforceRatingLimits"
            ></ion-input>
          </ion-item>

          <ion-button expand="block" @click="saveEditedSong">Speichern</ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonSelect, IonSelectOption, IonList, IonThumbnail,
  alertController, IonModal, IonButtons, IonButton, IonInput
} from '@ionic/vue'
import { ref, computed } from 'vue'
import { onIonViewWillEnter } from '@ionic/vue'

const selectedSort = ref('newest')
const allSongs = ref<any[]>([])
const isEditOpen = ref(false)
const editSong = ref<any>({})

const filteredAndSortedSongs = computed(() => {
  const validSongs = allSongs.value

  switch (selectedSort.value) {
    case 'oldest':
      return [...validSongs].sort((a, b) => new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime())
    case 'az':
      return [...validSongs].sort((a, b) => a.title?.localeCompare(b.title || '') || 0)
    case 'rating-high':
      return [...validSongs].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    case 'rating-low':
      return [...validSongs].sort((a, b) => (a.rating || 0) - (b.rating || 0))
    default:
      return [...validSongs].sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
  }
})


function applySorting() {}

function getRatingClass(rating: number): string {
  if (rating === 0) return 'rating-0'
  if (rating <= 3) return 'rating-1'
  if (rating <= 5) return 'rating-2'
  if (rating <= 6.9) return 'rating-3'
  if (rating <= 8.3) return 'rating-4'
  if (rating <= 9.9) return 'rating-5'
  return 'rating-6'
}

function enforceRatingLimits() {
  if (editSong.value.rating < 0) editSong.value.rating = 0
  if (editSong.value.rating > 10) editSong.value.rating = 10
}

async function editOrDelete(song: any) {
  const alert = await alertController.create({
    header: 'Aktion wählen',
    buttons: [
      {
        text: 'Löschen',
        role: 'destructive',
        handler: async () => {
          const confirm = await alertController.create({
            header: 'Bist du sicher?',
            message: 'Willst du diesen Song wirklich löschen?',
            buttons: [
              {
                text: 'Ja, löschen',
                role: 'destructive',
                handler: () => {
                  allSongs.value = allSongs.value.filter(s => s.id !== song.id)
                  localStorage.setItem('songs', JSON.stringify(allSongs.value))
                }
              },
              {
                text: 'Abbrechen',
                role: 'cancel'
              }
            ]
          })
          await confirm.present()
        }
      },
      {
        text: 'Bearbeiten',
        handler: () => {
          editSong.value = { ...song }
          isEditOpen.value = true
        }
      },
      {
        text: 'Abbrechen',
        role: 'cancel'
      }
    ]
  })
  await alert.present()
}

function closeEdit() {
  isEditOpen.value = false
}

function saveEditedSong() {
  const index = allSongs.value.findIndex(s => s.id === editSong.value.id)
  if (index !== -1) {
    allSongs.value[index] = { ...editSong.value }
    localStorage.setItem('songs', JSON.stringify(allSongs.value))
    isEditOpen.value = false
  }
}

onIonViewWillEnter(() => {
  const saved = localStorage.getItem('songs')
  allSongs.value = saved ? JSON.parse(saved) : []
})
</script>

<style scoped>
ion-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rating-box {
  width: 40px;
  height: 40px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-left: auto;
}

.rating-0 {
  background: black;
  color: white;
}
.rating-1 {
  background: #8B0000;
  color: white;
}
.rating-2 {
  background: #ff9999;
  color: black;
}
.rating-3 {
  background: #ffff66;
  color: black;
}
.rating-4 {
  background: #b2ff66;
  color: black;
}
.rating-5 {
  background: #228B22;
  color: black;
}
.rating-6 {
  background: gold;
  color: black;
}
</style>
