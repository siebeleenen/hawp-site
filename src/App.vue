<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('home')
const photos = ref([])
const sponsors = ref([])
const currentPhotoIndex = ref(0)

const scrollToSection = (section) => {
  activeSection.value = section
  const element = document.getElementById(section)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const updateActiveSection = () => {
  const sections = ['home', 'informatie', 'sponsors', 'gallery', 'tickets']
  const scrollPosition = window.scrollY + 200 // Offset for header

  for (const section of sections) {
    const element = document.getElementById(section)
    if (element) {
      const { offsetTop, offsetHeight } = element
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        activeSection.value = section
        break
      }
    }
  }
}

const nextPhoto = () => {
  currentPhotoIndex.value = (currentPhotoIndex.value + 1) % photos.value.length
}

const prevPhoto = () => {
  currentPhotoIndex.value = (currentPhotoIndex.value - 1 + photos.value.length) % photos.value.length
}

const goToPhoto = (index) => {
  currentPhotoIndex.value = index
}

onMounted(() => {
  // Generate array of photo paths (1.jpg through 100.jpg)
  photos.value = Array.from({ length: 100 }, (_, i) => `/hawp_2025_fotos/${i + 1}.jpg`)

  // Load sponsor logos dynamically
  sponsors.value = [
    { name: 'Alelek', logo: '/hawp_sponsors/alelek.jpeg' },
    { name: 'Autobanden Mathijs', logo: '/hawp_sponsors/autobanden_mathijs.jpg' },
    { name: 'Bierpunt', logo: '/hawp_sponsors/bierpunt.png' },
    { name: 'Hannick', logo: '/hawp_sponsors/Hannick.jpg' },
    { name: 'Vos Technics', logo: '/hawp_sponsors/Kopie van vos technics.png' },
    { name: 'Brasserie \'t Krievelkuut', logo: '/hawp_sponsors/logo-Brasserie-t-Krievelkuut.png' },
    { name: 'Chanry', logo: '/hawp_sponsors/logo_chanry.png' },
    { name: 'Gulden Mortier', logo: '/hawp_sponsors/gulden_mortier_logo-DPdFlTs0.png' },
  ]

  // Add scroll listener for dynamic navigation
  window.addEventListener('scroll', updateActiveSection)
  updateActiveSection() // Initialize on mount
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-amber-500/20">
      <div class="px-6">
        <div class="flex items-center justify-start gap-6 h-20 md:h-32">
          <!-- Logo -->
          <a href="#home" @click.prevent="scrollToSection('home')" class="flex items-center hover:scale-105 transition-transform duration-300">
            <img src="/afterwork logo.png" alt="HAWP Logo" class="h-12 w-12 md:h-20 md:w-20" />
          </a>
          
          <!-- Nav Links -->
          <div class="flex space-x-1 md:space-x-3">
            <button @click="scrollToSection('informatie')" 
                    :class="activeSection === 'informatie' ? 'bg-white text-slate-900' : 'text-white hover:bg-white/10'"
                    class="px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300">
              Informatie
            </button>
            <button @click="scrollToSection('sponsors')" 
                    :class="activeSection === 'sponsors' ? 'bg-white text-slate-900' : 'text-white hover:bg-white/10'"
                    class="px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300">
              Sponsors
            </button>
            <button @click="scrollToSection('gallery')" 
                    :class="activeSection === 'gallery' ? 'bg-white text-slate-900' : 'text-white hover:bg-white/10'"
                    class="px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300">
              Foto's
            </button>
            <a href="https://hawp.eventsquare.store/nl/3cxjdhhzpetb/jw1otf5pbv3v" target="_blank" rel="noopener noreferrer"
               class="px-3 md:px-6 py-2 md:py-3 rounded-lg font-bold text-sm md:text-base bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Koop Tickets
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="h-screen relative overflow-hidden pt-24 md:pt-36">
      <!-- Background decorative elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 left-10 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 container mx-auto px-6 flex flex-col justify-center items-center h-full">
        <div class="relative">
          <img src="/hawpomslag 2026.png" alt="HAWP 2026" class="w-full max-w-4xl rounded-3xl shadow-2xl relative z-10" />
          <!-- Gradient glow behind image -->
          <div class="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-400/20 to-amber-600/20 rounded-3xl blur-3xl transform scale-105 -z-10"></div>
        </div>
      </div>
    </section>

    <!-- Informatie Section -->
    <section id="informatie" class="min-h-screen relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="font-bebas text-4xl md:text-5xl text-white mb-6">INFORMATIE</h2>
          <div class="w-32 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          <!-- Info Cards -->
          <div class="space-y-6">
            <div class="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-amber-500/20 hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300">
              <h3 class="font-bebas text-3xl text-amber-400 mb-4 flex items-center">
                <span class="text-4xl mr-3">🎉</span> WAT IS DE HAWP?
              </h3>
              <p class="text-gray-300 text-lg leading-relaxed">
                Een <strong>Afterworkparty</strong> vol gezelligheid en goede vibes! 
                Ontspan en geniet van geweldige muziek en een onvergetelijke sfeer!
              </p>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-amber-500/20 hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300">
              <h3 class="font-bebas text-3xl text-amber-400 mb-4 flex items-center">
                <span class="text-4xl mr-3">🆕</span> NIEUW CONCEPT 2026
              </h3>
              <p class="text-gray-300 text-lg leading-relaxed mb-4">
                <strong>All-around-dinner</strong> van <span class="font-bold text-amber-400">18:00u tot 21:00u</span>
              </p>
              <p class="text-gray-400 italic">
                💡 Er zullen een beperkt aantal tickets beschikbaar zijn die enkel toegang geven tot de HAWP na 21:00u (exclusief eten).
              </p>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-amber-500/20 hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300">
              <h3 class="font-bebas text-3xl text-amber-400 mb-4 flex items-center">
                <span class="text-4xl mr-3">📅</span> WANNEER?
              </h3>
              <p class="text-gray-300 text-lg leading-relaxed">
                <strong class="text-2xl text-amber-400">Donderdag 13 maart 2026</strong><br>
                Van <strong>17:00u tot 01:00u</strong>
              </p>
            </div>

            <div class="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-amber-500/30 hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300">
              <h3 class="font-bebas text-3xl text-amber-300 mb-4 flex items-center">
                <span class="text-4xl mr-3">⚡</span> EXCLUSIEF!
              </h3>
              <p class="text-gray-300 text-lg leading-relaxed">
                Uitverkocht tijdens alle vorige edities! Wees er snel bij en mis deze dertiende editie niet!
              </p>
            </div>
          </div>

          <!-- Map Integration -->
          <div class="space-y-6">
            <div class="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-amber-500/20">
              <h3 class="font-bebas text-3xl text-amber-400 mb-6 flex items-center">
                <span class="text-4xl mr-3">📍</span> LOCATIE
              </h3>
              <div class="bg-slate-900/80 rounded-2xl overflow-hidden shadow-lg mb-4">
                <!-- Google Maps Embed -->
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2505.847!2d5.1638!3d50.9425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c124e7f0f0f0f0%3A0x0!2sIndustrieweg%201062%2C%203540%20Herk-de-Stad!5e0!3m2!1snl!2sbe!4v1700000000000"
                  width="100%" 
                  height="400" 
                  style="border:0;" 
                  allowfullscreen="" 
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade"
                  class="w-full"
                ></iframe>
              </div>
              <div class="space-y-3">
                <p class="text-gray-300 text-lg">
                  <strong class="text-amber-400">Adres:</strong><br>
                  Industrieweg 1062<br>
                  3540 Herk-de-Stad
                </p>
                <a href="https://www.google.com/maps/search/?api=1&query=Industrieweg+1062,+3540+Herk-de-Stad" target="_blank" rel="noopener noreferrer" class="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold px-6 py-3 rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Open in Google Maps
                </a>
              </div>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-amber-500/20">
              <h3 class="font-bebas text-3xl text-amber-400 mb-4 flex items-center">
                <span class="text-4xl mr-3">💬</span> CONTACT
              </h3>
              <p class="text-gray-300 text-lg leading-relaxed">
                Vragen? Neem contact op via:<br>
                <a href="mailto:info@herkseafterworkparty.be" class="text-amber-400 font-semibold hover:text-amber-300 transition-colors">info@herkseafterworkparty.be</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sponsors Section -->
    <section id="sponsors" class="min-h-screen relative py-24 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="font-bebas text-4xl md:text-5xl text-white mb-6">SPONSORS</h2>
          <div class="w-32 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-8"></div>
          <p class="text-white/80 text-xl max-w-3xl mx-auto">
            Mede mogelijk gemaakt door onze geweldige partners
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <!-- Sponsor logos -->
          <div v-for="sponsor in sponsors" :key="sponsor.name" class="bg-white/10 backdrop-blur-md rounded-2xl p-6 flex items-center justify-center aspect-square border border-amber-500/20 hover:bg-white/20 hover:border-amber-500/40 hover:scale-105 transition-all duration-300 shadow-xl">
            <img :src="sponsor.logo" :alt="sponsor.name" class="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Section (Slideshow) -->
    <section id="gallery" class="min-h-screen relative py-24 bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="font-bebas text-4xl md:text-5xl text-white mb-6">FOTO'S HAWP 2025</h2>
          <div class="w-32 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>
          <p class="text-gray-400 text-xl max-w-3xl mx-auto">
            Beleef de sfeer van onze vorige editie opnieuw! 📸
          </p>
        </div>

        <div class="max-w-5xl mx-auto">
          <!-- Slideshow -->
          <div class="relative bg-slate-900/50 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-amber-500/20 mb-12">
            <!-- Main Image -->
            <div class="relative aspect-[16/10] bg-gray-900">
              <img 
                v-if="photos.length > 0"
                :src="photos[currentPhotoIndex]" 
                :alt="`HAWP 2025 foto ${currentPhotoIndex + 1}`"
                class="w-full h-full object-contain"
              />
              
              <!-- Navigation Arrows -->
              <button 
                @click="prevPhoto"
                class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button 
                @click="nextPhoto"
                class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              <!-- Photo Counter -->
              <div class="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                <span class="font-semibold">{{ currentPhotoIndex + 1 }} / {{ photos.length }}</span>
              </div>
            </div>

            <!-- Thumbnail Navigation -->
            <div class="bg-slate-800/80 backdrop-blur-sm p-4">
              <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <button
                  v-for="(photo, index) in photos"
                  :key="index"
                  @click="goToPhoto(index)"
                  :class="[
                    'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300',
                    currentPhotoIndex === index
                      ? 'ring-4 ring-amber-500 scale-110' 
                      : 'opacity-60 hover:opacity-100'
                  ]">
                  <img 
                    :src="photo" 
                    :alt="`Thumbnail ${index + 1}`"
                    class="w-full h-full object-cover"
                    loading="eager"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- Call to Action -->
          <div class="text-center">
            <a 
              href="https://www.facebook.com/media/set/?set=a.975245517921839&type=3" 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold text-xl px-10 py-5 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Bekijk Alle Foto's Op Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-black text-white py-12">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 class="font-bebas text-2xl mb-4">HAWP 2026</h4>
            <p class="text-gray-400">
              De beste afterwork party!
            </p>
          </div>
          <div>
            <h4 class="font-bebas text-2xl mb-4">CONTACT</h4>
            <p class="text-gray-400">
              Email: info@herkseafterworkparty.be<br>
            </p>
          </div>
          <div>
            <h4 class="font-bebas text-2xl mb-4">VOLG ONS</h4>
            <div class="flex space-x-4">
              <a href="https://www.facebook.com/HerkseAfterworkParty/?locale=nl_NL" target="_blank" rel="noopener noreferrer" class="group" title="Facebook">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-600">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
              </a>
              <a href="https://www.instagram.com/herkse_afterwork_party/" target="_blank" rel="noopener noreferrer" class="group" title="Instagram">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300 group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-orange-400">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2026 Herkse Afterwork Party - Alle rechten voorbehouden</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
