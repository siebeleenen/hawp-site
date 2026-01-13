<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import FoodCarousel from './components/FoodCarousel.vue'

const activeSection = ref('home')
const photos = ref([])
const sponsors = ref([])
const currentPhotoIndex = ref(0)
const mobileMenuOpen = ref(false)
const showScrollTop = ref(false)
const showTicketNotification = ref(false)

const scrollToSection = (section) => {
  activeSection.value = section
  mobileMenuOpen.value = false
  const element = document.getElementById(section)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const showTicketAlert = () => {
  showTicketNotification.value = true
  setTimeout(() => {
    showTicketNotification.value = false
  }, 5000)
}

const updateActiveSection = () => {
  const sections = ['home', 'informatie', 'sponsors', 'food', 'gallery', 'tickets']
  const scrollPosition = window.scrollY + 200 // Offset for header

  // Show scroll to top button after scrolling down
  showScrollTop.value = window.scrollY > 500

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

  // Load sponsor logos dynamically from the hawp_sponsors folder
  const sponsorModules = import.meta.glob('/public/hawp_sponsors/*', { eager: true, as: 'url' })
  sponsors.value = Object.keys(sponsorModules).map(path => {
    const fileName = path.split('/').pop()
    const name = fileName.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/[-_]/g, ' ')
    return {
      name: name,
      logo: `/hawp_sponsors/${fileName}`
    }
  })

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
    <!-- Ticket Notification Toast -->
    <Transition name="slide-down">
      <div v-show="showTicketNotification" class="fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-2xl">
        <div class="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-2xl shadow-2xl border-2 border-amber-300 overflow-hidden">
          <div class="bg-slate-900/95 backdrop-blur-xl m-1 rounded-xl p-6 md:p-8">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                <div class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                  <span class="text-3xl md:text-4xl">🎟️</span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  Ticketverkoop Start Binnenkort!
                </h3>
                <p class="text-gray-300 text-base md:text-lg leading-relaxed mb-3">
                  De verkoop start op <span class="font-bold text-amber-400">25 januari 2026</span>
                </p>
                <p class="text-gray-400 text-sm md:text-base">
                  📱 Houd onze website en social media in de gaten voor de exacte starttijd!
                </p>
              </div>
              <button @click="showTicketNotification = false" class="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-amber-500/20">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex items-center justify-between h-16 md:h-20">
          <!-- Logo -->
          <a href="#home" @click.prevent="scrollToSection('home')" class="flex items-center hover:scale-105 transition-transform duration-300 z-50">
            <img src="/afterwork logo.png" alt="HAWP Logo" class="h-10 w-10 md:h-16 md:w-16" />
          </a>
          
          <!-- Desktop Nav Links -->
          <div class="hidden md:flex space-x-2 lg:space-x-4">
            <button @click="scrollToSection('informatie')" 
                    :class="activeSection === 'informatie' ? 'bg-white text-slate-900' : 'text-white hover:bg-white/10'"
                    class="px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold text-sm lg:text-base transition-all duration-300">
              Informatie
            </button>
            <button @click="scrollToSection('sponsors')" 
                    :class="activeSection === 'sponsors' ? 'bg-white text-slate-900' : 'text-white hover:bg-white/10'"
                    class="px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold text-sm lg:text-base transition-all duration-300">
              Sponsors
            </button>
            <button @click="scrollToSection('food')" 
                    :class="activeSection === 'food' ? 'bg-white text-slate-900' : 'text-white hover:bg-white/10'"
                    class="px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold text-sm lg:text-base transition-all duration-300">
              Food
            </button>
            <button @click="scrollToSection('gallery')" 
                    :class="activeSection === 'gallery' ? 'bg-white text-slate-900' : 'text-white hover:bg-white/10'"
                    class="px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold text-sm lg:text-base transition-all duration-300">
              Foto's
            </button>
            <a href="https://hawp.eventsquare.store/" target="_blank" rel="noopener noreferrer"
               class="px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-bold text-sm lg:text-base bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              Koop Tickets
            </a>
          </div>

          <!-- Mobile Menu Button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors z-50">
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-show="mobileMenuOpen" class="md:hidden absolute top-16 left-0 right-0 bg-slate-900 backdrop-blur-xl border-b border-amber-500/30 shadow-2xl z-50">
          <div class="flex flex-col p-4 space-y-2">
            <!-- Navigation Links -->
            <button @click="scrollToSection('informatie')" 
                    :class="activeSection === 'informatie' ? 'bg-white text-slate-900' : 'bg-slate-800 text-white hover:bg-slate-700'"
                    class="px-4 py-3 rounded-lg font-bold text-base transition-all duration-200 text-left">
              Informatie
            </button>
            <button @click="scrollToSection('sponsors')" 
                    :class="activeSection === 'sponsors' ? 'bg-white text-slate-900' : 'bg-slate-800 text-white hover:bg-slate-700'"
                    class="px-4 py-3 rounded-lg font-bold text-base transition-all duration-200 text-left">
              Sponsors
            </button>
            <button @click="scrollToSection('food')" 
                    :class="activeSection === 'food' ? 'bg-white text-slate-900' : 'bg-slate-800 text-white hover:bg-slate-700'"
                    class="px-4 py-3 rounded-lg font-bold text-base transition-all duration-200 text-left">
              🍽️ Food
            </button>
            <button @click="scrollToSection('gallery')" 
                    :class="activeSection === 'gallery' ? 'bg-white text-slate-900' : 'bg-slate-800 text-white hover:bg-slate-700'"
                    class="px-4 py-3 rounded-lg font-bold text-base transition-all duration-200 text-left">
              Foto's
            </button>
            
            <!-- Tickets Button -->
            <a href="https://hawp.eventsquare.store/" target="_blank" rel="noopener noreferrer"
               class="px-4 py-3 rounded-lg font-bold text-base bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 hover:shadow-xl transition-all duration-200 text-center flex items-center justify-center gap-2 cursor-pointer">
              🎟️ Koop Tickets
            </a>
            
            <!-- Social Media -->
            <div class="pt-2 mt-1 border-t border-slate-700">
              <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-2 px-1">Volg Ons</h4>
              <div class="flex gap-3 items-center">
                <a href="https://www.facebook.com/HerkseAfterworkParty/?locale=nl_NL" target="_blank" rel="noopener noreferrer" 
                   class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl w-14 h-14 flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/herkse_afterwork_party/" target="_blank" rel="noopener noreferrer"
                   class="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-xl w-14 h-14 flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="min-h-screen relative overflow-hidden pt-16 md:pt-20">
      <!-- Background decorative elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[600px] md:h-[600px] bg-amber-600/5 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 container mx-auto px-4 md:px-6 flex flex-col justify-center items-center min-h-screen py-8">
        <!-- Event Info Card -->
        <div class="w-full max-w-5xl mb-8 md:mb-12">
          <div class="bg-slate-800/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 border border-amber-500/30 shadow-2xl">
            <!-- Mobiel: Alles onder elkaar -->
            <div class="md:hidden space-y-4">
              <div class="text-center">
                <h1 class="font-bebas text-4xl text-white mb-2 leading-tight">Herkse Afterwork Party 2026</h1>
                <p class="text-amber-400 text-xl font-bold">13de Editie - Altijd Uitverkocht!</p>
              </div>
              <div class="text-center py-2">
                <div class="text-white text-2xl font-bold">13 Maart 2026</div>
                <div class="text-gray-300 text-base">17:00 - 02:00</div>
              </div>
              <a href="https://hawp.eventsquare.store/" target="_blank" rel="noopener noreferrer"
                 class="block w-full px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center cursor-pointer">
                🎟️ Koop Tickets Nu
              </a>
            </div>
            
            <!-- Desktop: Originele layout -->
            <div class="hidden md:flex items-center justify-between gap-4">
              <div class="text-left">
                <h1 class="font-bebas text-5xl text-white mb-2">Herkse Afterwork Party 2026</h1>
                <p class="text-amber-400 text-2xl font-bold">13de Editie - Altijd Uitverkocht!</p>
              </div>
              <div class="flex flex-col items-end gap-2">
                <div class="text-right">
                  <div class="text-white text-3xl font-bold">13 Maart 2026</div>
                  <div class="text-gray-300 text-base">17:00 - 02:00</div>
                </div>
                <a href="https://hawp.eventsquare.store/" target="_blank" rel="noopener noreferrer"
                   class="px-8 py-3 rounded-lg font-bold text-base bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer">
                  🎟️ Koop Tickets Nu
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Image -->
        <div class="relative w-full max-w-5xl">
          <img src="/hawpomslag 2026.png" alt="HAWP 2026" class="w-full rounded-2xl md:rounded-3xl shadow-2xl relative z-10" />
          <!-- Gradient glow behind image -->
          <div class="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-400/20 to-amber-600/20 rounded-2xl md:rounded-3xl blur-3xl transform scale-105 -z-10"></div>
        </div>

        <!-- Quick Info Pills -->
        <div class="flex flex-wrap justify-center gap-3 md:gap-4 mt-8 md:mt-12 w-full max-w-5xl">
          <div class="bg-slate-800/50 backdrop-blur-md rounded-full px-4 md:px-6 py-2 md:py-3 border border-amber-500/20 flex items-center gap-2">
            <span class="text-2xl">🍽️</span>
            <span class="text-white text-sm md:text-base font-semibold">All-Around Dinner</span>
          </div>
          <div class="bg-slate-800/50 backdrop-blur-md rounded-full px-4 md:px-6 py-2 md:py-3 border border-amber-500/20 flex items-center gap-2">
            <span class="text-2xl">🎵</span>
            <span class="text-white text-sm md:text-base font-semibold">Live DJ's</span>
          </div>
          <div class="bg-slate-800/50 backdrop-blur-md rounded-full px-4 md:px-6 py-2 md:py-3 border border-amber-500/20 flex items-center gap-2">
            <span class="text-2xl">⚡</span>
            <span class="text-white text-sm md:text-base font-semibold">Premium Experience</span>
          </div>
        </div>

        <!-- Scroll Down Indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
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
                <strong class="text-2xl text-amber-400">Vrijdag 13 maart 2026</strong><br>
                Van <strong>17:00u tot 02:00u</strong>
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
                <a href="mailto:wout.ector@hotmail.com" class="text-amber-400 font-semibold hover:text-amber-300 transition-colors">wout.ector@hotmail.com</a>
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

    <!-- Food Carousel Section -->
    <section id="food" class="min-h-screen relative py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <!-- Background Decorative Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10">
        <div class="text-center mb-16">
          <h2 class="font-bebas text-4xl md:text-6xl text-white mb-6 tracking-wide">
            New Food Concept
          </h2>
          <div class="w-32 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 mx-auto mb-8"></div>
        </div>

        <!-- Premium Food Carousel Component -->
        <FoodCarousel />

        <!-- Additional Info -->
        <div class="mt-16 max-w-4xl mx-auto">
          <div class="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-amber-500/20 shadow-2xl">
            <div class="text-center space-y-6">
              <div class="flex items-center justify-center gap-3 mb-6">
                <div class="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/50"></div>
                <span class="text-amber-400 text-sm font-semibold tracking-widest uppercase">Nieuw dit jaar</span>
                <div class="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/50"></div>
              </div>
              
              <h3 class="text-white text-2xl md:text-3xl font-bold mb-4">
                All-Around Dinner
              </h3>
              
              <p class="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                Geniet van <span class="text-amber-400 font-semibold">18:00u tot 21:00u</span> van een culinaire ervaring 
                met verschillende signature gerechten, zorgvuldig geselecteerd om de perfecte start van je avond te creëren.
              </p>

              <div class="flex flex-wrap justify-center gap-4 mt-8">
                <div class="flex items-center gap-2 text-gray-400">
                  <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-sm md:text-base">Meerdere keuzes</span>
                </div>
                <div class="flex items-center gap-2 text-gray-400">
                  <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-sm md:text-base">Overheerlijk</span>
                </div>
                <div class="flex items-center gap-2 text-gray-400">
                  <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm md:text-base">3 uur Service</span>
                </div>
              </div>
            </div>
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
              Email: wout.ector@hotmail.com<br>
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

    <!-- Scroll to Top Button -->
    <Transition name="scroll-top">
      <button
        v-show="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 p-3 md:p-4 rounded-full shadow-2xl hover:shadow-amber-500/50 hover:scale-110 transition-all duration-300 border-2 border-amber-500/50"
        aria-label="Scroll naar boven"
      >
        <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
        </svg>
      </button>
    </Transition>
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

/* Scroll to top button transitions */
.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: all 0.3s ease;
}

.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* Toast notification transitions */
.slide-down-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-100px) scale(0.9);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-50px) scale(0.95);
}
</style>
