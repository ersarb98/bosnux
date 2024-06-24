<template>
  <div>
    <NuxtLink to="/gatepass/spjm">ke spjm</NuxtLink>
    <ul>
      <li v-for="menu in menus" :key="menu.ID">
        <i :class="menu.ICON"></i>
        <a :href="menu.URL" :target="menu.TARGET">{{ menu.JUDUL_MENU }}</a>
        <ul v-if="menu.children">
          <li v-for="child in menu.children" :key="child.ID">
            <i :class="child.ICON"></i>
            <!-- <a :href="child.URL" :target="child.TARGET">{{ child.JUDUL_MENU }}</a> -->
            <NuxtLink :to="child.URL">{{ child.JUDUL_MENU }}</NuxtLink>

          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>

definePageMeta({
  middleware: 'auth',
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

// Watch for changes in the fetch data
watch(data, (newData) => {
  if (newData) {
    menus.value = newData;
    organizedMenus.value = organizeMenus(menus.value);
  }
}, { immediate: true });

</script>


<style lang="scss" scoped></style>