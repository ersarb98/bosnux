<template>
    <div>
        <h1 class="text-2xl pb-3">SPK BEHANDLE</h1>
        <!-- searrch box -->
        <div class=" bg-white p-8 rounded shadow-md w-full mx-auto">
            <div class="mb-4 mt-1 text-xl font-semibold">
                Pencarian
            </div>
            <form @submit.prevent="handleSubmit">
                <div class="flex space-x-4 mb-4">
                    <div class="w-1/2">
                        <label for="dokumenField" class="block text-gray-700 text-sm font-bold mb-2">Nomor
                            Dokumen:</label>
                        <input type="text" id="dokumenField" v-model="dokumenValue"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nomor Dokumen" />
                    </div>
                    <div class="w-1/2">
                        <label for="kontainerField" class="block text-gray-700 text-sm font-bold mb-2">Nomor
                            SPK:</label>
                        <input type="text" id="kontainerField" v-model="kontainerValue"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nomor Kontainer" />
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <button type="submit"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Submit
                    </button>
                </div>
            </form>
            <div class="mt-4 mb-2">
                <label for="inputField" class="block text-gray-700 text-sm font-bold mb-2">Pencarian Cepat:</label>
                <input type="text" id="inputField" v-model="search"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Data 3 Bulan Terakhir" />
            </div>
        </div>
        <!-- table box -->
        <div class="mt-8 mb-4">

            <div v-if="loading">
                <div class="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <g>
                            <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.14" />
                            <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.29"
                                transform="rotate(30 12 12)" />
                            <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.43"
                                transform="rotate(60 12 12)" />
                            <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.57"
                                transform="rotate(90 12 12)" />
                            <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.71"
                                transform="rotate(120 12 12)" />
                            <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.86"
                                transform="rotate(150 12 12)" />
                            <rect width="2" height="5" x="11" y="1" fill="currentColor" transform="rotate(180 12 12)" />
                            <animateTransform attributeName="transform" calcMode="discrete" dur="0.75s"
                                repeatCount="indefinite" type="rotate"
                                values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" />
                        </g>
                    </svg>
                </div>
            </div>
            <div v-else>
                <v-data-table :headers="headers" :items="filteredItems" class="elevation-1" :search="search">
                    <template v-slot:item="{ item }">
                        <tr @click="handleRowClick(item)">
                            <td v-html="item.ID"></td>
                            <td v-html="item.NO_SPK"></td>
                            <td v-html="item.WK_REQ"></td>
                            <td v-html="item.JENIS_DOKUMEN"></td>
                            <td v-html="item.NO_DOKUMEN"></td>
                            <td v-html="item.JUMLAH_KONTAINER"></td>
                            <td v-html="item.STATUS"></td>
                            <td v-html="item.DOKUMEN_JOIN_INSPECTION"></td>
                            <td>
                                <v-btn color="primary" @click.stop="openMailModal(item)">Request</v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </div>
        </div>
    </div>
</template>

<script setup>
const loading = ref(false);
const headers = [
    { title: 'ID', value: 'ID', sortable: true },
    { title: 'NO SPK', value: 'NO_SPK', sortable: true },
    { title: 'WK REQ', value: 'WK_REQ', sortable: true },
    { title: 'JENIS DOKUMEN', value: 'JENIS_DOKUMEN', sortable: true },
    { title: 'NO DOKUMEN', value: 'NO_DOKUMEN', sortable: true },
    { title: 'JUMLAH KONTAINER', value: 'JUMLAH_KONTAINER', sortable: true },
    { title: 'STATUS', value: 'STATUS', sortable: true },
    { title: 'DOKUMEN JOIN INSPECTION', value: 'DOKUMEN_JOIN_INSPECTION', sortable: true },
    { title: 'Options', sortable: false },
];
const data = ref({
    dokumen: []
});
const search = ref('');
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const fetchdata = async () => {
    loading.value = true;
    try {
        const token = localStorage.getItem('auth_token');
        const dataFetch = await $fetch(`${apiBase}/spk_behandle_index`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        data.value.dokumen = dataFetch;
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        loading.value = false;
    }
};
const filteredItems = computed(() => {
    if (!search.value) return data.value.dokumen;
    return data.value.dokumen.filter(item => {
        return Object.values(item).some(value =>
            String(value).toLowerCase().includes(search.value.toLowerCase())
        );
    });
});
onMounted(fetchdata);


</script>

<style scoped></style>