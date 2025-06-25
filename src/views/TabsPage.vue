<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <font-awesome-icon class="tab-icon" :icon="['fas', 'map']" size="lg"/>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <font-awesome-icon  class="tab-icon" :icon="['fas', 'star']" size="lg" />
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <font-awesome-icon  class="tab-icon" :icon="['fas', 'plus']" size="lg" />
        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/tabs/tab4">
          <font-awesome-icon  class="tab-icon" :icon="['fas', 'masks-theater']" size="lg" />
        </ion-tab-button>

        <ion-tab-button tab="tab5" href="/tabs/tab5">
          <font-awesome-icon  class="tab-icon" :icon="['fas', 'magnifying-glass']" size="lg" />
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonPage, IonRouterOutlet } from '@ionic/vue';
</script>
