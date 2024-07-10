<template>
  <div>
    <h1 class="text-xl">Selamat Datang Di Aplikasi BOS</h1>
    <p>Silakan pilih menu disamping</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

definePageMeta({
  middleware: 'auth',
});

const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
});

// Initial fetch
const { data, error } = useFetch('http://127.0.0.1:8000/api/menu_spa', {
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
