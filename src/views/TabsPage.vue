<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="triangle" />
          <ion-label>Map</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="ellipse" />
          <ion-label>Ranking</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon aria-hidden="true" :icon="square" />
          <ion-label>Add Song</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/tabs/tab4">
          <ion-icon aria-hidden="true" :icon="ellipse" />
          <ion-label>Moods</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="ellipse" />
          <ion-label>Search</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { ellipse, square, triangle } from 'ionicons/icons';
</script>
