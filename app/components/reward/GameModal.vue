<script setup lang="ts">
import { formatCoins } from '#shared/utils/coin'

const open = defineModel<boolean>('open', { default: false })

const activeTab = ref<'game' | 'leaderboard' | 'achievements' | 'coins'>('game')
const leaderboard = ref<any[]>([])
const loadingLeaderboard = ref(false)
const toast = useToast()
const { loggedIn, user, fetch: refreshSession } = useUserSession()
const { fetchStatus } = useCoins()

// Max statistics saved locally
const gameStats = ref({
  maxKills: 0,
  maxLevel: 1,
  maxTime: 0,
  gamesPlayed: 0
})

const achievements = [
  { id: 'first_kill', title: 'Pemburu Tikus Pemula', desc: 'Bunuh 5 ekor tikus dalam satu permainan.', icon: 'i-lucide-shield', check: (stats: any) => stats.maxKills >= 5 },
  { id: 'rat_slayer', title: 'Slayer Tikus Sejati', desc: 'Bunuh 20 ekor tikus dalam satu permainan.', icon: 'i-lucide-swords', check: (stats: any) => stats.maxKills >= 20 },
  { id: 'survivor_60', title: 'Kucing Gesit', desc: 'Bertahan hidup selama lebih dari 60 detik.', icon: 'i-lucide-timer', check: (stats: any) => stats.maxTime >= 60 },
  { id: 'level_5', title: 'Kucing Sakti', desc: 'Mencapai LV. 5 atau lebih.', icon: 'i-lucide-zap', check: (stats: any) => stats.maxLevel >= 5 },
  { id: 'loyal_player', title: 'Pemain Setia', desc: 'Mainkan game ini sebanyak 5 kali.', icon: 'i-lucide-trophy', check: (stats: any) => stats.gamesPlayed >= 5 }
]

const unlockedAchievements = ref<string[]>([])

// Fetch statistics and achievements from localStorage
function loadLocalStats() {
  if (!import.meta.client) return
  const stats = JSON.parse(localStorage.getItem('game_stats') || '{"maxKills":0,"maxLevel":1,"maxTime":0,"gamesPlayed":0}')
  gameStats.value = stats
  
  unlockedAchievements.value = achievements
    .filter(ach => ach.check(stats))
    .map(ach => ach.id)
}

function checkNewAchievements() {
  if (!import.meta.client) return
  const stats = JSON.parse(localStorage.getItem('game_stats') || '{"maxKills":0,"maxLevel":1,"maxTime":0,"gamesPlayed":0}')
  const currentUnlocked = achievements
    .filter(ach => ach.check(stats))
    .map(ach => ach.id)
    
  currentUnlocked.forEach(id => {
    if (!unlockedAchievements.value.includes(id)) {
      const ach = achievements.find(a => a.id === id)
      if (ach) {
        toast.add({
          title: `Lencana Dibuka: ${ach.title}! 🏆`,
          description: ach.desc,
          color: 'success',
          icon: ach.icon
        })
      }
    }
  })
  
  unlockedAchievements.value = currentUnlocked
  gameStats.value = stats
}

async function fetchLeaderboard() {
  loadingLeaderboard.value = true
  try {
    const response = await $fetch<{ success: boolean, data: { leaderboard: any[] } }>('/api/game/leaderboard')
    leaderboard.value = response.data.leaderboard
  } catch (e) {
    console.error(e)
  } finally {
    loadingLeaderboard.value = false
  }
}

async function submitGameScore(score: number, level: number, time: string, kills: number) {
  try {
    const response = await $fetch<{
      success: boolean
      message: string
      data: {
        earnedCoins: number
        newBalance: number
      }
    }>('/api/game/submit', {
      method: 'POST',
      body: { score, level, time, kills }
    })

    if (response.success) {
      toast.add({
        title: 'Hasil Game Disimpan!',
        description: response.message,
        color: response.data.earnedCoins > 0 ? 'success' : 'primary',
        icon: response.data.earnedCoins > 0 ? 'i-lucide-coins' : 'i-lucide-check-circle'
      })
      
      // Update balance & session
      await fetchStatus()
      await refreshSession()
      
      // Refresh leaderboard
      await fetchLeaderboard()
    }
  } catch (error) {
    console.error(error)
  }
}

function parseTime(timeStr: string) {
  const parts = timeStr.split(':')
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1])
  }
  return 0
}

function handleMessage(event: MessageEvent) {
  if (!open.value) return

  if (event.data?.type === 'GAME_START') {
    const stats = JSON.parse(localStorage.getItem('game_stats') || '{"maxKills":0,"maxLevel":1,"maxTime":0,"gamesPlayed":0}')
    stats.gamesPlayed++
    localStorage.setItem('game_stats', JSON.stringify(stats))
    checkNewAchievements()
  }
  
  if (event.data?.type === 'GAME_KILL') {
    const kills = event.data.kills
    const stats = JSON.parse(localStorage.getItem('game_stats') || '{"maxKills":0,"maxLevel":1,"maxTime":0,"gamesPlayed":0}')
    if (kills > stats.maxKills) {
      stats.maxKills = kills
    }
    localStorage.setItem('game_stats', JSON.stringify(stats))
    checkNewAchievements()
  }
  
  if (event.data?.type === 'GAME_LEVEL_UP') {
    const level = event.data.level
    const stats = JSON.parse(localStorage.getItem('game_stats') || '{"maxKills":0,"maxLevel":1,"maxTime":0,"gamesPlayed":0}')
    if (level > stats.maxLevel) {
      stats.maxLevel = level
    }
    localStorage.setItem('game_stats', JSON.stringify(stats))
    checkNewAchievements()
  }

  if (event.data?.type === 'GAME_OVER') {
    const { score, level, time, kills } = event.data
    
    // Update local stats
    const stats = JSON.parse(localStorage.getItem('game_stats') || '{"maxKills":0,"maxLevel":1,"maxTime":0,"gamesPlayed":0}')
    const parsedTime = parseTime(time)
    if (parsedTime > stats.maxTime) stats.maxTime = parsedTime
    if (level > stats.maxLevel) stats.maxLevel = level
    if (kills > stats.maxKills) stats.maxKills = kills
    localStorage.setItem('game_stats', JSON.stringify(stats))

    // Submit to DB and leaderboard
    submitGameScore(score, level, time, kills)
    checkNewAchievements()
  }
}

watch(open, (newOpen) => {
  if (newOpen) {
    loadLocalStats()
    fetchLeaderboard()
    activeTab.value = 'game'
    if (import.meta.client) {
      window.addEventListener('message', handleMessage)
    }
  } else {
    if (import.meta.client) {
      window.removeEventListener('message', handleMessage)
    }
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('message', handleMessage)
  }
})
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{ content: 'sm:max-w-5xl rounded-3xl overflow-hidden' }"
  >
    <template #header>
      <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
        <div class="flex items-center gap-3">
          <img src="/images/belanjapedia_icon.png" alt="Logo Kucing" class="size-9 object-contain" />
          <div>
            <h2 class="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-1.5">
              Feline Frenzy <span class="text-xs font-semibold px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full">Mini-Game</span>
            </h2>
            <p class="text-xs text-neutral-500">Mainkan game, buka lencana, dan dapatkan Koin BelanjaPedia!</p>
          </div>
        </div>
        <UButton
          icon="i-lucide-x"
          variant="ghost"
          color="neutral"
          class="rounded-full"
          @click="open = false"
        />
      </div>
    </template>

    <template #body>
      <div class="flex flex-col gap-6 px-1 py-1">
        <!-- Tabs Navigation -->
        <div class="flex border-b border-neutral-100 px-4 -mt-2">
          <button
            v-for="tab in [
              { id: 'game', label: 'Main Game 🎮' },
              { id: 'leaderboard', label: 'Leaderboard 🏆' },
              { id: 'achievements', label: 'Achievements 🏅' },
              { id: 'coins', label: 'Reward Koin 🪙' }
            ]"
            :key="tab.id"
            class="px-4 py-3 font-semibold text-sm transition-all border-b-2 -mb-[2px]"
            :class="activeTab === tab.id 
              ? 'border-brand-500 text-brand-600' 
              : 'border-transparent text-neutral-500 hover:text-neutral-900'"
            @click="activeTab = tab.id as any"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Body: Game -->
        <div v-show="activeTab === 'game'" class="flex flex-col gap-4">
          <div class="w-full h-[540px] rounded-2xl overflow-hidden bg-[#0f172a] border border-neutral-800 shadow-inner relative">
            <iframe
              v-if="open"
              src="/feline-frenzy.html?v=modal"
              class="absolute inset-0 w-full h-full border-none"
              allow="autoplay"
            />
          </div>
          <p class="text-[11px] text-neutral-500 text-center -mt-1 flex items-center justify-center gap-1">
            <UIcon name="i-lucide-info" class="size-3.5" />
            <span>Klik di dalam game terlebih dahulu agar keyboard mendeteksi gerakan kucing.</span>
          </p>
        </div>

        <!-- Tab Body: Leaderboard -->
        <div v-show="activeTab === 'leaderboard'" class="min-h-[400px] flex flex-col justify-center">
          <div v-if="loadingLeaderboard" class="flex flex-col items-center justify-center py-12 gap-3">
            <USpinner color="primary" size="md" />
            <p class="text-sm text-neutral-500">Memuat peringkat global...</p>
          </div>
          <div v-else-if="leaderboard.length === 0" class="text-center py-12">
            <UIcon name="i-lucide-trophy" class="size-12 text-neutral-300 mx-auto mb-2" />
            <p class="text-sm text-neutral-500">Belum ada skor yang tercatat di papan peringkat.</p>
          </div>
          <div v-else class="overflow-hidden border border-neutral-200 rounded-2xl">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="bg-neutral-50 text-neutral-700 font-semibold border-b border-neutral-200">
                  <th class="py-3.5 px-4 text-center w-16">Rank</th>
                  <th class="py-3.5 px-4">Nama Pemain</th>
                  <th class="py-3.5 px-4 text-center">Skor Akhir</th>
                  <th class="py-3.5 px-4 text-center">Level Max</th>
                  <th class="py-3.5 px-4 text-center">Kills</th>
                  <th class="py-3.5 px-4 text-center">Durasi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(entry, index) in leaderboard"
                  :key="index"
                  class="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  :class="{ 'bg-brand-50/20': entry.userId === user?.id && entry.userId }"
                >
                  <td class="py-3 px-4 text-center font-bold">
                    <span
                      v-if="index === 0"
                      class="inline-flex size-6 items-center justify-center bg-yellow-400 text-white rounded-full text-xs"
                    >🥇</span>
                    <span
                      v-else-if="index === 1"
                      class="inline-flex size-6 items-center justify-center bg-neutral-300 text-white rounded-full text-xs"
                    >🥈</span>
                    <span
                      v-else-if="index === 2"
                      class="inline-flex size-6 items-center justify-center bg-amber-600 text-white rounded-full text-xs"
                    >🥉</span>
                    <span v-else class="text-neutral-500">{{ index + 1 }}</span>
                  </td>
                  <td class="py-3 px-4 font-bold text-neutral-900">
                    {{ entry.name }}
                    <span v-if="entry.userId === user?.id && entry.userId" class="text-[10px] font-medium bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded ml-1">Saya</span>
                  </td>
                  <td class="py-3 px-4 text-center font-extrabold text-brand-600">
                    {{ entry.score.toLocaleString('id-ID') }}
                  </td>
                  <td class="py-3 px-4 text-center font-semibold">LV. {{ entry.level }}</td>
                  <td class="py-3 px-4 text-center text-neutral-600">{{ entry.kills }} tikus</td>
                  <td class="py-3 px-4 text-center text-neutral-500">⏱️ {{ entry.time }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab Body: Achievements -->
        <div v-show="activeTab === 'achievements'" class="flex flex-col gap-6">
          <!-- Max stats header card -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-neutral-50 border border-neutral-100 rounded-2xl text-center">
            <div>
              <p class="text-xs text-neutral-500 font-medium">Bermain Game</p>
              <p class="text-xl font-bold text-neutral-800 mt-1">{{ gameStats.gamesPlayed }} kali</p>
            </div>
            <div>
              <p class="text-xs text-neutral-500 font-medium">Musuh Dibunuh Maksimal</p>
              <p class="text-xl font-bold text-neutral-800 mt-1">{{ gameStats.maxKills }} tikus</p>
            </div>
            <div>
              <p class="text-xs text-neutral-500 font-medium">Level Maksimal Dicapai</p>
              <p class="text-xl font-bold text-neutral-800 mt-1">LV. {{ gameStats.maxLevel }}</p>
            </div>
            <div>
              <p class="text-xs text-neutral-500 font-medium">Waktu Bertahan Maksimal</p>
              <p class="text-xl font-bold text-neutral-800 mt-1">{{ Math.floor(gameStats.maxTime / 60) }}m {{ gameStats.maxTime % 60 }}d</p>
            </div>
          </div>

          <!-- Achievements grid list -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="ach in achievements"
              :key="ach.id"
              class="flex gap-4 p-4 border rounded-2xl items-center transition-all"
              :class="unlockedAchievements.includes(ach.id)
                ? 'bg-brand-50/30 border-brand-200'
                : 'bg-neutral-50/50 border-neutral-200 grayscale opacity-60'"
            >
              <div
                class="size-12 rounded-xl flex items-center justify-center border text-xl"
                :class="unlockedAchievements.includes(ach.id)
                  ? 'bg-brand-100 border-brand-200 text-brand-600'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-400'"
              >
                <UIcon :name="ach.icon" class="size-6" />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-1.5">
                  <h4 class="font-bold text-sm text-neutral-900">{{ ach.title }}</h4>
                  <span
                    v-if="unlockedAchievements.includes(ach.id)"
                    class="text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.25 rounded-full"
                  >Unlocked</span>
                  <span v-else class="text-[9px] font-bold bg-neutral-200 text-neutral-600 px-1.5 py-0.25 rounded-full">Locked</span>
                </div>
                <p class="text-xs text-neutral-600 mt-0.5 leading-relaxed">{{ ach.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Body: Reward Koin -->
        <div v-show="activeTab === 'coins'" class="flex flex-col gap-6 items-center text-center py-6 max-w-lg mx-auto">
          <div class="text-6xl animate-bounce">🪙</div>
          <div>
            <h3 class="text-xl font-extrabold text-neutral-950">Dapatkan Koin dari Bermain Game</h3>
            <p class="text-sm text-neutral-600 mt-2 leading-relaxed">
              Setiap kali Anda menyelesaikan permainan (Game Over), skor yang Anda kumpulkan akan dikonversi secara otomatis menjadi koin BelanjaPedia.
            </p>
          </div>

          <div class="w-full bg-cream border border-brand-200/50 p-5 rounded-2xl space-y-3.5 text-left text-sm">
            <h4 class="font-bold text-brand-900 flex items-center gap-1.5">
              <UIcon name="i-lucide-coins" class="size-5" />
              Aturan Konversi Koin
            </h4>
            <ul class="space-y-2 text-neutral-700">
              <li class="flex items-start gap-2">
                <span class="text-brand-500">•</span>
                <span>Setiap kelipatan <strong>50 skor game</strong> = <strong>1 Koin BelanjaPedia</strong>.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-brand-500">•</span>
                <span>Maksimal reward koin per permainan adalah <strong>50 Koin</strong> (Skor 2500+).</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-brand-500">•</span>
                <span>Anda harus <strong>Login</strong> menggunakan akun BelanjaPedia saat bermain untuk menyimpan koin ke saldo akun Anda.</span>
              </li>
            </ul>
          </div>

          <p v-if="!loggedIn" class="text-sm font-semibold text-brand-600">
            ⚠️ Anda belum login. Silakan login terlebih dahulu untuk mendapatkan koin belanja!
          </p>
          <p v-else class="text-sm font-semibold text-green-600">
            ✅ Anda sudah login. Semua koin yang didapatkan akan langsung masuk ke saldo Anda!
          </p>
        </div>
      </div>
    </template>
  </UModal>
</template>
