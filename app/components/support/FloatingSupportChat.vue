<script setup lang="ts">
import {
  getQuickReplyMessage,
  getSupportAutoReply,
  SUPPORT_QUICK_REPLIES
} from '#shared/utils/supportChat'

type ChatMessage = {
  id: number
  role: 'user' | 'support'
  text: string
  time: Date
}

const { loggedIn, user } = useUserSession()
const route = useRoute()

const isProductDetailPage = computed(() => /^\/products\/[^/]+$/.test(route.path))

const isOpen = ref(false)
const draft = ref('')
const isTyping = ref(false)
const messages = ref<ChatMessage[]>([])
const messageListRef = ref<HTMLElement | null>(null)
let messageId = 0

const greeting = computed(() => {
  if (loggedIn.value && user.value?.name) {
    return `Hai ${user.value.name}! Ada yang bisa kami bantu hari ini?`
  }

  return 'Hai! Selamat datang di BelanjaPedia Support. Ada yang bisa kami bantu?'
})

function createMessage(role: ChatMessage['role'], text: string): ChatMessage {
  messageId += 1
  return { id: messageId, role, text, time: new Date() }
}

function scrollToBottom() {
  nextTick(() => {
    const el = messageListRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

function pushSupportMessage(text: string) {
  messages.value.push(createMessage('support', text))
  scrollToBottom()
}

function openChat() {
  isOpen.value = true

  if (messages.value.length === 0) {
    pushSupportMessage(greeting.value)
  }
}

function closeChat() {
  isOpen.value = false
}

function toggleChat() {
  if (isOpen.value) {
    closeChat()
    return
  }

  openChat()
}

async function replyToUser(userText: string) {
  messages.value.push(createMessage('user', userText))
  scrollToBottom()

  isTyping.value = true
  await new Promise(resolve => setTimeout(resolve, 700))
  isTyping.value = false

  pushSupportMessage(getSupportAutoReply(userText))
}

async function sendMessage() {
  const text = draft.value.trim()
  if (!text || isTyping.value) return

  draft.value = ''
  await replyToUser(text)
}

async function handleQuickReply(id: string) {
  const text = getQuickReplyMessage(id)
  if (!text || isTyping.value) return

  await replyToUser(text)
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

watch(isOpen, (open) => {
  if (open) scrollToBottom()
})
</script>

<template>
  <div
    class="fixed right-4 z-40 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6"
    :class="isProductDetailPage
      ? 'bottom-[calc(10.75rem+env(safe-area-inset-bottom,0px))]'
      : 'bottom-[calc(6.25rem+env(safe-area-inset-bottom,0px))]'"
  >
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-3 scale-95"
    >
      <div
        v-if="isOpen"
        class="w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden"
        :class="isProductDetailPage
          ? 'h-[min(32rem,calc(100vh-16rem-env(safe-area-inset-bottom,0px)))]'
          : 'h-[min(32rem,calc(100vh-11rem-env(safe-area-inset-bottom,0px)))]'"
      >
        <div class="bg-brand-500 text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3 min-w-0">
            <div class="size-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <UIcon
                name="i-lucide-headphones"
                class="size-5"
              />
            </div>
            <div class="min-w-0">
              <p class="font-semibold truncate">
                Customer Support
              </p>
              <p class="text-xs text-white/90 flex items-center gap-1.5">
                <span class="size-2 rounded-full bg-green-300" />
                Online · Balas cepat
              </p>
            </div>
          </div>
          <button
            type="button"
            class="size-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors"
            aria-label="Tutup chat"
            @click="closeChat"
          >
            <UIcon
              name="i-lucide-x"
              class="size-5"
            />
          </button>
        </div>

        <div
          ref="messageListRef"
          class="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50"
        >
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm"
              :class="message.role === 'user'
                ? 'bg-brand-500 text-white rounded-br-md'
                : 'bg-white text-neutral-800 border border-neutral-200 rounded-bl-md'"
            >
              <p>{{ message.text }}</p>
              <p
                class="text-[10px] mt-1 opacity-70"
                :class="message.role === 'user' ? 'text-right' : 'text-left'"
              >
                {{ formatTime(message.time) }}
              </p>
            </div>
          </div>

          <div
            v-if="isTyping"
            class="flex justify-start"
          >
            <div class="bg-white border border-neutral-200 rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm text-neutral-500">
              CS mengetik...
            </div>
          </div>
        </div>

        <div class="px-3 pt-2 pb-1 bg-white border-t border-neutral-100 shrink-0">
          <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              v-for="item in SUPPORT_QUICK_REPLIES"
              :key="item.id"
              type="button"
              class="shrink-0 text-xs px-3 py-1.5 rounded-full border border-brand-200 text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors"
              :disabled="isTyping"
              @click="handleQuickReply(item.id)"
            >
              {{ item.label }}
            </button>
          </div>
        </div>

        <form
          class="p-3 pt-0 bg-white flex gap-2 shrink-0"
          @submit.prevent="sendMessage"
        >
          <UInput
            v-model="draft"
            placeholder="Ketik pesan..."
            class="flex-1"
            :disabled="isTyping"
          />
          <UButton
            type="submit"
            color="primary"
            class="rounded-full shrink-0"
            icon="i-lucide-send"
            :disabled="!draft.trim() || isTyping"
            aria-label="Kirim pesan"
          />
        </form>

        <div class="px-3 pb-3 bg-white flex gap-2 text-xs shrink-0">
          <NuxtLink
            to="/bantuan"
            class="text-brand-600 hover:underline"
            @click="closeChat"
          >
            Pusat Bantuan
          </NuxtLink>
          <span class="text-neutral-300">·</span>
          <NuxtLink
            to="/hubungi-kami"
            class="text-brand-600 hover:underline"
            @click="closeChat"
          >
            Hubungi Kami
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <button
      type="button"
      class="size-14 rounded-full bg-brand-500 text-white shadow-lg hover:bg-brand-600 hover:shadow-xl transition-all flex items-center justify-center relative"
      :aria-label="isOpen ? 'Tutup chat support' : 'Buka chat support'"
      @click="toggleChat"
    >
      <UIcon
        :name="isOpen ? 'i-lucide-x' : 'i-lucide-message-circle'"
        class="size-7"
      />
      <span
        v-if="!isOpen"
        class="absolute top-0 right-0 size-3.5 rounded-full bg-green-400 border-2 border-white"
      />
    </button>
  </div>
</template>
