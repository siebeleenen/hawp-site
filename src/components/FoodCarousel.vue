<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const images = ref([])
const currentIndex = ref(0)
const isLoading = ref(true)
const touchStartX = ref(0)
const touchEndX = ref(0)
const isDragging = ref(false)
const dragOffset = ref(0)
const containerRef = ref(null)

// Load images from /food directory
onMounted(async () => {
  try {
    // Dynamically import images from /food folder
    const imageModules = import.meta.glob('/public/food/*.(jpg|jpeg|png|webp)', { eager: true, as: 'url' })
    
    let imageList = Object.keys(imageModules).map(path => {
      const fileName = path.split('/').pop()
      return {
        src: `/food/${fileName}`,
        name: fileName,
        alt: fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/[-_]/g, ' ')
      }
    })

    // Sort: jacks.jpeg first, then alphabetically
    imageList.sort((a, b) => {
      if (a.name.toLowerCase() === 'jacks.jpeg') return -1
      if (b.name.toLowerCase() === 'jacks.jpeg') return 1
      return a.name.localeCompare(b.name)
    })

    images.value = imageList
    isLoading.value = false
  } catch (error) {
    console.error('Error loading images:', error)
    isLoading.value = false
  }
})

const goToSlide = (index) => {
  currentIndex.value = index
  dragOffset.value = 0
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length
  dragOffset.value = 0
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length
  dragOffset.value = 0
}

// Touch and Mouse gesture handlers
const handleTouchStart = (e) => {
  touchStartX.value = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
  isDragging.value = true
}

const handleTouchMove = (e) => {
  if (!isDragging.value) return
  
  const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
  dragOffset.value = currentX - touchStartX.value
}

const handleTouchEnd = (e) => {
  if (!isDragging.value) return
  
  const currentX = e.type.includes('mouse') ? e.clientX : (e.changedTouches?.[0]?.clientX || touchStartX.value)
  touchEndX.value = currentX
  
  const swipeDistance = touchEndX.value - touchStartX.value
  const threshold = 50 // Minimum swipe distance
  
  if (Math.abs(swipeDistance) > threshold) {
    if (swipeDistance > 0) {
      prevSlide()
    } else {
      nextSlide()
    }
  }
  
  isDragging.value = false
  dragOffset.value = 0
}

// Keyboard navigation
const handleKeydown = (e) => {
  if (e.key === 'ArrowLeft') prevSlide()
  if (e.key === 'ArrowRight') nextSlide()
  if (e.key === 'Escape') currentIndex.value = 0
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Calculate transform with drag offset
const slideTransform = computed(() => {
  const baseTransform = -currentIndex.value * 100
  const dragPercentage = containerRef.value ? (dragOffset.value / containerRef.value.offsetWidth) * 100 : 0
  return `translateX(${baseTransform + dragPercentage}%)`
})

const slideTransition = computed(() => {
  return isDragging.value ? 'none' : 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
})
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[600px]">
      <div class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
        <p class="text-white/60 text-lg font-medium">Loading culinary excellence...</p>
      </div>
    </div>

    <!-- Carousel Container -->
    <div v-else class="relative group">
      <!-- Main Image Display -->
      <div 
        ref="containerRef"
        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl shadow-2xl border border-amber-500/20"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @mousedown="handleTouchStart"
        @mousemove="handleTouchMove"
        @mouseup="handleTouchEnd"
        @mouseleave="isDragging = false"
      >
        <!-- Image Track -->
        <div 
          class="flex"
          :style="{ 
            transform: slideTransform,
            transition: slideTransition
          }"
        >
          <div
            v-for="(image, index) in images"
            :key="image.src"
            class="w-full flex-shrink-0"
          >
            <div class="relative aspect-[16/10] bg-slate-950">
              <img
                :src="image.src"
                :alt="image.alt"
                :loading="Math.abs(index - currentIndex) <= 1 ? 'eager' : 'lazy'"
                class="w-full h-full object-contain transition-all duration-700"
                :class="{ 
                  'scale-105': index === currentIndex && !isDragging,
                  'cursor-grab': !isDragging,
                  'cursor-grabbing': isDragging
                }"
              />
            </div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button
          @click="prevSlide"
          class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10
                 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-xl
                 text-white p-3 md:p-4 rounded-full
                 border border-amber-500/30 hover:border-amber-500/60
                 shadow-2xl hover:shadow-amber-500/25
                 transform transition-all duration-300 
                 hover:scale-110 hover:-translate-x-1
                 opacity-0 group-hover:opacity-100
                 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          aria-label="Previous image"
        >
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <button
          @click="nextSlide"
          class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10
                 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-xl
                 text-white p-3 md:p-4 rounded-full
                 border border-amber-500/30 hover:border-amber-500/60
                 shadow-2xl hover:shadow-amber-500/25
                 transform transition-all duration-300 
                 hover:scale-110 hover:translate-x-1
                 opacity-0 group-hover:opacity-100
                 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          aria-label="Next image"
        >
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Slide Counter Badge -->
        <div class="absolute top-4 md:top-6 right-4 md:right-6 z-10">
          <div class="bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 rounded-full px-4 md:px-5 py-2 md:py-2.5 shadow-2xl">
            <span class="text-amber-400 font-bold text-sm md:text-base tracking-wider">
              {{ currentIndex + 1 }} <span class="text-white/40">/</span> {{ images.length }}
            </span>
          </div>
        </div>
      </div>

      <!-- Thumbnail Navigation -->
      <div class="mt-6 md:mt-8">
        <div class="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-amber-500/10 shadow-xl">
          <div class="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-slate-800/20">
            <button
              v-for="(image, index) in images"
              :key="index"
              @click="goToSlide(index)"
              class="relative flex-shrink-0 group/thumb transition-all duration-300"
              :class="[
                currentIndex === index 
                  ? 'scale-110 md:scale-115' 
                  : 'scale-100 opacity-60 hover:opacity-100'
              ]"
            >
              <!-- Thumbnail Container -->
              <div class="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-xl md:rounded-2xl overflow-hidden">
                <img
                  :src="image.src"
                  :alt="image.alt"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                />
                
                <!-- Overlay Gradient -->
                <div 
                  class="absolute inset-0 transition-all duration-300"
                  :class="currentIndex === index 
                    ? 'bg-gradient-to-t from-amber-500/20 to-transparent' 
                    : 'bg-slate-950/40 group-hover/thumb:bg-slate-950/20'"
                ></div>
                
                <!-- Active Ring -->
                <div 
                  v-if="currentIndex === index"
                  class="absolute inset-0 rounded-xl md:rounded-2xl ring-3 md:ring-4 ring-amber-500 ring-offset-2 ring-offset-slate-900/50"
                ></div>
              </div>

              <!-- Active Indicator Dot -->
              <div 
                v-if="currentIndex === index"
                class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50"
              ></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Progress Indicator -->
      <div class="mt-6 md:mt-8 flex justify-center gap-2">
        <div
          v-for="(_, index) in images"
          :key="index"
          class="h-1.5 rounded-full transition-all duration-500 cursor-pointer"
          :class="[
            currentIndex === index 
              ? 'w-8 md:w-12 bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg shadow-amber-500/50' 
              : 'w-1.5 bg-slate-700 hover:bg-slate-600'
          ]"
          @click="goToSlide(index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for thumbnail strip */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.2);
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(245, 158, 11, 0.3);
  border-radius: 10px;
  transition: background 0.3s ease;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(245, 158, 11, 0.5);
}

/* Prevent text selection during drag */
.select-none {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Smooth hardware-accelerated animations */
.transform {
  transform: translateZ(0);
  will-change: transform;
}

/* Ring offset utility (if not in Tailwind) */
.ring-offset-2 {
  box-shadow: 0 0 0 2px var(--tw-ring-offset-color);
}

.ring-offset-slate-900\/50 {
  --tw-ring-offset-color: rgba(15, 23, 42, 0.5);
}
</style>
