<template>
    <div class="flex h-screen">
        <!-- sidebar -->
        <div :class="{ 'translate-x-0': sidebarVisible, '-translate-x-full': !sidebarVisible }"
            class="fixed top-0 left-0 h-full w-64 bg-gray-100 transition-transform transform z-10">
            <div class="items-end">
                <button @click="sidebarClose" class="text-gray-700 px-4 py-2 rounded flex items-end">
                    <!-- SVG icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="mr-2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="9" y1="3" x2="9" y2="21" />
                    </svg>
                </button>
            </div>
            <ul>
                <li v-for="menu in organizedMenus" :key="menu.ID">
                    <i :class="menu.ICON"></i>
                    <!-- menu dropdown -->
                    <div v-if="menu.TIPE === 'M' && menu.ID_PARENT === null">
                        <div class="p-1">
                            <button
                                class="text-left inline-block w-full px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
                                <NuxtLink :to="menu.URL" class="inline-block w-full">{{ menu.JUDUL_MENU }}</NuxtLink>
                            </button>
                        </div>
                    </div>
                    <div v-else class="relative">
                        <button @click="toggleDropdown(menu.ID)"
                            class="p-1 inline-flex items-center w-full px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
                            <NuxtLink :to="menu.URL">{{ menu.JUDUL_MENU }}</NuxtLink>
                            <svg class="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor" aria-hidden="true">
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
                                        <svg class="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                            fill="currentColor" aria-hidden="true">
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
        </div>

        <!-- content + header -->
        <div :class="{ 'ml-64': sidebarVisible }" class="flex-1 transition-all">
            <div class="text-gray-800 p-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div v-if="!sidebarVisible" @click="sidebarOpen" class="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="mr-2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <line x1="9" y1="3" x2="9" y2="21" />
                            </svg>
                        </div>
                        <h1>Behandle App</h1>
                    </div>
                </div>
            </div>

            <slot />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';


const sidebarVisible = ref(true);

function sidebarOpen() {
    sidebarVisible.value = true;
}

function sidebarClose() {
    sidebarVisible.value = false;
}

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

<style>
.transition-all {
    transition: all 0.3s ease-in-out;
}

.dropdown-menu {
    z-index: 10;
}
</style>