<script setup>
import { computed, nextTick, ref } from 'vue'
import photos from '../data/photos-2026.json'
import { links } from '../data/event.js'

const selected = ref(0)
const dialog = ref(null)
const opener = ref(null)
const strip = ref(null)
const expanded = ref(false)
const visibleCount = ref(18)
const imageFailed = ref(false)
const featuredNumbers = [13, 57, 22, 37, 93, 95]
const featured = featuredNumbers.map(number => photos.find(photo => photo.number === number))
const visiblePhotos = computed(() => photos.slice(0, visibleCount.value))
const currentPhoto = computed(() => photos[selected.value])
let touchStart = null

async function openPhoto(photo, event) {
  selected.value = photos.indexOf(photo)
  imageFailed.value = false
  opener.value = event.currentTarget
  await nextTick()
  dialog.value.showModal()
}
function move(direction) {
  selected.value = (selected.value + direction + photos.length) % photos.length
  imageFailed.value = false
}
function closePhoto() { dialog.value.close() }
function restoreFocus() { opener.value?.focus() }
function moveStrip(direction) {
  strip.value.scrollBy({ left: strip.value.clientWidth * direction * .8, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}
function onTouchStart(event) {
  touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }
}
function onTouchEnd(event) {
  if (!touchStart) return
  const dx = event.changedTouches[0].clientX - touchStart.x
  const dy = event.changedTouches[0].clientY - touchStart.y
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1)
  touchStart = null
}
</script>

<template>
  <section id="gallery" class="gallery-section" aria-labelledby="gallery-title">
    <div class="container gallery-heading">
      <div>
        <span class="eyebrow">EEN AVOND OM TE HERBELEVEN</span>
        <h2 id="gallery-title">Dit was HAWP 2026.</h2>
      </div>
      <div class="gallery-controls" aria-label="Bladeren door sfeerbeelden">
        <button class="icon-button" aria-label="Vorige sfeerbeelden" aria-controls="photo-strip" @click="moveStrip(-1)">←</button>
        <button class="icon-button" aria-label="Volgende sfeerbeelden" aria-controls="photo-strip" @click="moveStrip(1)">→</button>
      </div>
    </div>

    <div id="photo-strip" ref="strip" class="photo-strip">
      <button v-for="photo in featured" :key="photo.number" class="photo-tile" :aria-label="`Vergroot sfeerfoto ${photo.number} van HAWP 2026`" @click="openPhoto(photo, $event)">
        <img :src="photo.thumbnail" :alt="`Sfeerfoto van de Herkse Afterwork Party 2026, foto ${photo.number}`" width="640" height="427" loading="lazy" />
        <span class="photo-zoom" aria-hidden="true">↗</span>
      </button>
    </div>

    <div class="container">
      <div class="gallery-actions">
        <p>Jullie, de muziek en de momenten ertussen.<br /><span>Foto’s van de editie 2026.</span></p>
        <button class="button button-dark" :aria-expanded="expanded" aria-controls="full-album" @click="expanded = !expanded">
          {{ expanded ? 'Sluit het fotoalbum' : `Alle ${photos.length} foto’s van 2026` }} <span aria-hidden="true">{{ expanded ? '−' : '+' }}</span>
        </button>
      </div>
      <div v-if="expanded" id="full-album" class="full-album">
        <div class="album-grid">
          <button v-for="photo in visiblePhotos" :key="photo.number" class="photo-tile" :aria-label="`Vergroot foto ${photo.number} van HAWP 2026`" @click="openPhoto(photo, $event)">
            <img :src="photo.thumbnail" :alt="`HAWP 2026, foto ${photo.number}`" width="640" height="427" loading="lazy" />
            <span class="photo-zoom" aria-hidden="true">↗</span>
          </button>
        </div>
        <div class="album-more">
          <p aria-live="polite">{{ Math.min(visibleCount, photos.length) }} van {{ photos.length }} foto’s</p>
          <button v-if="visibleCount < photos.length" class="button button-outline" @click="visibleCount += 18">Meer foto’s laden <span aria-hidden="true">+</span></button>
        </div>
      </div>
      <div class="previous-album"><span>Nog even terugblikken?</span><a class="text-link" :href="links.previousAlbum" target="_blank" rel="noopener noreferrer">Het album van vorig jaar op Facebook <span aria-hidden="true">↗</span></a></div>
    </div>

    <dialog ref="dialog" class="photo-dialog" aria-label="Fotogalerij HAWP 2026" @close="restoreFocus" @click="event => { if (event.target === dialog) closePhoto() }" @keydown.left.prevent="move(-1)" @keydown.right.prevent="move(1)">
      <div class="lightbox">
        <div class="lightbox-top"><p aria-live="polite">HAWP 2026 <span>·</span> {{ selected + 1 }} / {{ photos.length }}</p><button autofocus class="lightbox-close" @click="closePhoto">Sluiten <span aria-hidden="true">×</span></button></div>
        <div class="lightbox-stage" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
          <img :key="currentPhoto.src" :src="currentPhoto.src" :alt="`Herkse Afterwork Party 2026, foto ${currentPhoto.number}`" :width="currentPhoto.width" :height="currentPhoto.height" @error="imageFailed = true" />
          <p v-if="imageFailed" class="image-error" role="status">Deze foto kan niet geladen worden. Ga naar de volgende foto.</p>
        </div>
        <div class="lightbox-controls"><button class="button button-outline" aria-label="Vorige foto" @click="move(-1)">← <span>Vorige</span></button><span class="lightbox-hint">Blader met de pijltjes of swipe</span><button class="button button-outline" aria-label="Volgende foto" @click="move(1)"><span>Volgende</span> →</button></div>
      </div>
    </dialog>
  </section>
</template>

