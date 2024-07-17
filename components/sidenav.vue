<template>
  <div
    :class="['fixed top-0 left-0 h-full bg-gray-800 text-white z-50 transition-transform transform', isOpen ? 'translate-x-0' : '-translate-x-full']"
    style="width: 250px;">
    <div class="flex items-center justify-center h-16">
      <h1 class="text-xl font-semibold">My App!</h1>
    </div>
    <div>
      <button @click="$emit('toggleSidenav')" class="text-white">
        ☰
      </button>
    </div>
    <nav class="flex-1">
      <ul>
        <li v-for="menu in organizedMenus" :key="menu.ID">
          <i :class="menu.ICON"></i>
          <!-- menu dropdown -->
          <div v-if="menu.TIPE === 'M' && menu.ID_PARENT === null">
            <NuxtLink :to="menu.URL">{{ menu.JUDUL_MENU }}</NuxtLink>
          </div>
          <div v-else class="relative">
            <button @click="toggleDropdown(menu.ID)" class="inline-flex items-center">
              <NuxtLink :to="menu.URL">{{ menu.JUDUL_MENU }}</NuxtLink>
              <svg class="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
            <!-- dropdown button -->
            <ul v-if="openDropdownId === menu.ID"
              class="dropdown-menu absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <li v-for="child in menu.children" :key="child.ID"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i :class="child.ICON"></i>
                <div v-if="child.children.length > 0">
                  <!-- dropdown inside dropdown -->
                  <button @click="toggleChildDropdown(child.ID)" class="inline-flex items-center">
                    <NuxtLink :to="child.URL">{{ child.JUDUL_MENU }}</NuxtLink>
                    <svg class="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                      aria-hidden="true">
                      <path fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 111.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <ul v-if="openChildDropdownId === child.ID"
                    class="absolute left-full top-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <li v-for="grandchild in child.children" :key="grandchild.ID"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <NuxtLink :to="grandchild.URL">{{ grandchild.JUDUL_MENU }}</NuxtLink>
                    </li>
                  </ul>
                </div>
                <div v-else>
                  <NuxtLink :to="child.URL">{{ child.JUDUL_MENU }}</NuxtLink>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  menu: {
    type: Object,
    required: true,
  },
})

// Initial fetch
const { data, error } = useFetch(`${apiBase}/menu_spa`, {
  method: 'POST',
  body: JSON.stringify({ KD_GROUP: 'SPA' }),
  headers: {
    'Content-Type': 'application/json',
  },
});

const menus = ref([]);
const organizedMenus = ref([]);
const openDropdownId = ref(null);
const openChildDropdownId = ref(null);

function organizeMenus(menus) {
  const menuMap = {};
  const rootMenus = [];

  menus.forEach(menu => {
    menu.children = [];
    menuMap[menu.ID] = menu;

    if (menu.ID_PARENT === null) {
      rootMenus.push(menu);
    } else {
      if (menuMap[menu.ID_PARENT]) {
        menuMap[menu.ID_PARENT].children.push(menu);
      } else {
        menuMap[menu.ID_PARENT] = { children: [menu] };
      }
    }
  });

  return rootMenus;
}

const toggleDropdown = menuId => {
  openDropdownId.value = openDropdownId.value === menuId ? null : menuId;
};

const toggleChildDropdown = childId => {
  openChildDropdownId.value = openChildDropdownId.value === childId ? null : childId;
};

// Watch for changes in the fetch data
watch(
  data,
  newData => {
    if (newData) {
      menus.value = newData;
      organizedMenus.value = organizeMenus(menus.value);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.dropdown-menu {
  z-index: 10;
}
</style>