<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import PhotoArchive from './components/PhotoArchive.vue'
import { edition, links, atmosphere } from './data/event.js'

const menuOpen = ref(false)
const scrolled = ref(false)
const menuButton = ref(null)
const updateHeader = () => { scrolled.value = window.scrollY > 40 }
function closeMenu(restoreFocus = false) {
  menuOpen.value = false
  if (restoreFocus) menuButton.value?.focus()
}
onMounted(() => {
  updateHeader()
  window.addEventListener('scroll', updateHeader, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', updateHeader))
</script>

<template>
  <a class="skip-link" href="#main">Ga naar inhoud</a>

  <header class="site-header" :class="{ 'is-scrolled': scrolled, 'menu-is-open': menuOpen }" @keydown.esc="closeMenu(true)">
    <div class="header-inner container">
      <a class="brand" href="#home" aria-label="Herkse Afterwork Party — home" @click="closeMenu()">
        <img src="/images/logo.webp" alt="Herkse Afterwork Party" width="80" height="62" />
      </a>
      <nav id="main-navigation" aria-label="Hoofdnavigatie" :class="{ 'is-open': menuOpen }">
        <a href="#over" @click="closeMenu()">De party</a>
        <a href="#gallery" @click="closeMenu()">Foto’s</a>
        <a href="#informatie" @click="closeMenu()">Praktisch</a>
        <a href="#faq" @click="closeMenu()">FAQ</a>
        <a href="#contact" @click="closeMenu()">Contact</a>
      </nav>
      <a class="button button-gold header-tickets" :href="links.tickets" target="_blank" rel="noopener noreferrer">
        Tickets <span aria-hidden="true">↗</span>
      </a>
      <button ref="menuButton" class="menu-toggle" :aria-expanded="menuOpen" aria-controls="main-navigation" :aria-label="menuOpen ? 'Menu sluiten' : 'Menu openen'" @click="menuOpen = !menuOpen">
        <span>{{ menuOpen ? 'Sluiten' : 'Menu' }}</span>
        <svg v-if="!menuOpen" aria-hidden="true" width="22" height="18" viewBox="0 0 22 18"><path d="M1 3h20M1 9h20M1 15h20" stroke="currentColor" stroke-width="1.5" /></svg>
        <svg v-else aria-hidden="true" width="22" height="22" viewBox="0 0 22 22"><path d="m4 4 14 14M18 4 4 18" stroke="currentColor" stroke-width="1.5" /></svg>
      </button>
    </div>
  </header>

  <main id="main">
    <section id="home" class="hero" aria-labelledby="hero-title">
      <picture class="hero-image">
        <source media="(max-width: 700px)" :srcset="atmosphere.heroMobile" />
        <img :src="atmosphere.hero" alt="Sfeer op de dansvloer tijdens HAWP 2026" width="1920" height="1280" fetchpriority="high" />
      </picture>
      <div class="hero-shade"></div>
      <div class="hero-content container">
        <p class="eyebrow hero-eyebrow">HERK-DE-STAD <span aria-hidden="true">/</span> VRIJDAG 5 MAART 2027</p>
        <h1 id="hero-title">Herkse<br />Afterwork<br /><span>Party.</span></h1>
        <div class="hero-bottom">
          <p>Van de werkdag naar de dansvloer.<br />We zien elkaar op 5 maart.</p>
          <a class="button button-gold" :href="links.tickets" target="_blank" rel="noopener noreferrer">Ontdek de tickets <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <span class="hero-caption">Sfeerbeeld uit de editie 2026</span>
      <a class="hero-scroll" href="#over" aria-label="Ontdek de Herkse Afterwork Party"><span aria-hidden="true">↓</span></a>
    </section>

    <div class="event-bar">
      <div class="container event-bar-inner">
        <div class="event-date"><span class="date-day">05</span><span>MAART<br /><strong>2027</strong></span></div>
        <div class="event-bar-location"><span class="eyebrow">DE VOLGENDE AFSPRAAK</span><p>Herk-de-Stad</p><span>Industrieweg 1062</span></div>
        <a class="text-link" href="#informatie">Alle praktische info <span aria-hidden="true">↗</span></a>
      </div>
    </div>

    <section id="over" class="about-section section-space">
      <div class="container about-layout">
        <div class="about-pictures">
          <figure class="about-picture-main"><img :src="atmosphere.people" alt="Vrienden samen op de Herkse Afterwork Party 2026" width="960" height="1280" loading="lazy" /></figure>
          <figure class="about-picture-small"><img :src="atmosphere.detail" alt="Een moment op de dansvloer van HAWP 2026" width="800" height="800" loading="lazy" /><figcaption>HAWP 2026 — de sfeer blijft.</figcaption></figure>
        </div>
        <div class="about-copy">
          <span class="eyebrow">HERKSE AFTERWORK PARTY</span>
          <h2>Werkdag voorbij.<br />Avond voor ons.</h2>
          <div class="small-rule"></div>
          <p>De laptop dicht. Je vrienden bij elkaar. En dan de dansvloer op. Dat is Herkse Afterwork Party.</p>
          <p>Op vrijdag 5 maart 2027 spreken we opnieuw af in Herk-de-Stad. Een nieuwe editie, op de vertrouwde locatie.</p>
          <a class="text-link" href="#gallery">Alvast in de sfeer <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>

    <PhotoArchive />

    <section id="informatie" class="practical-section" aria-labelledby="practical-title">
      <figure class="practical-picture">
        <img :src="atmosphere.practical" alt="Feestverlichting en publiek op HAWP 2026" width="1200" height="1400" loading="lazy" />
      </figure>
      <div class="practical-copy">
        <span class="eyebrow">PLAN JE AVOND</span>
        <h2 id="practical-title">Goed om<br />te weten.</h2>
        <dl class="event-details">
          <div><dt>Wanneer</dt><dd><time datetime="2027-03-05">Vrijdag 5 maart 2027</time></dd></div>
          <div><dt>Waar</dt><dd>Industrieweg 1062<br />3540 Herk-de-Stad</dd></div>
          <div><dt>Line-up</dt><dd>Wordt aangekondigd</dd></div>
          <div><dt>Deuren</dt><dd>17:00 - 02:00</dd></div>
        </dl>
        <div id="tickets" class="practical-actions">
          <a class="button button-dark" :href="links.tickets" target="_blank" rel="noopener noreferrer">Naar de ticketshop</a>
          <a class="text-link" :href="links.maps" target="_blank" rel="noopener noreferrer">Route <span aria-hidden="true">🗺️</span></a>
        </div>
        <p class="ticket-note">Bekijk de ticketshop voor prijzen en beschikbaarheid.</p>
      </div>
    </section>

    <section id="faq" class="faq-section section-space">
      <div class="container faq-layout">
        <div><span class="eyebrow">NOG EEN VRAAG?</span><h2>Even<br />praktisch.</h2></div>
        <div class="faq-list">
          <details v-for="item in edition.faq" :key="item.question">
            <summary>{{ item.question }}<span class="faq-symbol" aria-hidden="true"></span></summary>
            <p>{{ item.answer }} <a v-if="item.link" :href="links[item.link]" :target="item.link === 'email' ? undefined : '_blank'" rel="noopener noreferrer">{{ item.linkText }} <span aria-hidden="true">↗</span></a></p>
          </details>
        </div>
      </div>
    </section>

    <section id="contact" class="contact-section">
      <div class="contact-photo"><img :src="atmosphere.contact" alt="Bezoekers van de Herkse Afterwork Party in 2026" width="1200" height="1000" loading="lazy" /></div>
      <div class="contact-copy">
        <span class="eyebrow">WE HOREN GRAAG VAN JE</span>
        <h2>Tot op de<br />dansvloer.</h2>
        <p>Een vraag over de party?<br />Stuur de organisatie een bericht.</p>
        <a class="contact-email" :href="links.email">{{ links.emailLabel }} </a>
        <div class="social-links">
          <a :href="links.facebook" target="_blank" rel="noopener noreferrer" aria-label="Volg Herkse Afterwork Party op Facebook" title="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
            </svg>
          </a>
          <a :href="links.instagram" target="_blank" rel="noopener noreferrer" aria-label="Volg Herkse Afterwork Party op Instagram" title="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-main">
      <a href="#home" class="footer-brand" aria-label="Herkse Afterwork Party — terug naar boven"><img src="/images/logo.webp" alt="Herkse Afterwork Party" width="80" height="62" /></a>
      <p>Vrijdag 5 maart 2027<br /><span>Herk-de-Stad</span></p>
      <a class="text-link" href="#home">Terug naar boven <span aria-hidden="true">↑</span></a>
    </div>
    <div class="container footer-bottom"><span>© {{ edition.year }} Herkse Afterwork Party</span></div>
  </footer>
</template>

