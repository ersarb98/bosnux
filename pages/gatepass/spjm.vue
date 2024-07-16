<template>
  <v-container>
    <h1 class="text-2xl pb-3">Request Gatepass SPJM</h1>
    <!-- Add a search input field -->
    <div class=" bg-white p-8 rounded shadow-md w-full mx-auto">
      <div class="mb-4 mt-1 text-xl font-semibold">
        Pencarian
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="flex space-x-4 mb-4">
          <div class="w-1/2">
            <label for="dokumenField" class="block text-gray-700 text-sm font-bold mb-2">Nomor Dokumen:</label>
            <input type="text" id="dokumenField" v-model="dokumenValue"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nomor Dokumen" />
          </div>
          <div class="w-1/2">
            <label for="kontainerField" class="block text-gray-700 text-sm font-bold mb-2">Nomor Kontainer:</label>
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
    <div class="mt-8 mb-4">
      <div v-if="loading">
        <div class="flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <g>
              <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.14" />
              <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.29" transform="rotate(30 12 12)" />
              <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.43" transform="rotate(60 12 12)" />
              <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.57" transform="rotate(90 12 12)" />
              <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.71"
                transform="rotate(120 12 12)" />
              <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.86"
                transform="rotate(150 12 12)" />
              <rect width="2" height="5" x="11" y="1" fill="currentColor" transform="rotate(180 12 12)" />
              <animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite"
                type="rotate"
                values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" />
            </g>
          </svg>
        </div>
      </div>
      <div v-else>
        <v-data-table :headers="headers" :items="filteredItems" class="elevation-1" :search="search">
          <template v-slot:item="{ item }">
            <tr @click="handleRowClick(item)">
              <td>{{ item.ID }}</td>
              <td>{{ item.NAMA }}</td>
              <td>{{ item.NO_DOK }}</td>
              <td>{{ item.TGL_DOK }}</td>
              <td>{{ item.STATUS_INPUT }}</td>
              <td>{{ item.KD_REQ }}</td>
              <td>{{ item.CONSIGNEE }}</td>
              <td>{{ item.RESPONSE_REQ }}</td>
              <td>{{ item.KETERANGAN }}</td>
              <td>
                <v-btn color="primary" @click.stop="openMailModal(item)">Request</v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>
    <!-- DETAIL Ketika dobel klik -->
    <v-dialog v-model="dialog" max-width="auto">
      <v-card>
        <div class="py-4 px-2">
          <v-card-title>
            <span class="headline">Detail Dokumen {{ selectedItem?.NO_DOK }}</span>
          </v-card-title>
        </div>
        <div class="p4 ml-4 text-2xl">Consignee : {{ selectedItem?.CONSIGNEE }}</div>
        <div class="py-4 px-2">
          <table class="min-w-full bg-white" v-if="!loading && documentDetails.length">
            <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Nomor Kontainer</th>
                <th class="text-left">Ukuran</th>
                <th class="text-left">Type</th>
                <th class="text-left">Jenis</th>
                <th class="text-left">ISO Code</th>
                <th class="text-left">Periksa</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detail in documentDetails" :key="detail.ID">
                <td>{{ detail.ID }}</td>
                <td>{{ detail.NO_CONT }}</td>
                <td>{{ detail.UKR_CONT }}</td>
                <td>{{ detail.TIPE_CONT }}</td>
                <td>{{ detail.KD_CONT_JENIS }}</td>
                <td>{{ detail.ISO_CODE }}</td>
                <td>{{ detail.FL_PERIKSA }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else-if="loading">Loading...</div>
          <div v-else>Failed to load document details</div>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Send Mail Modal Dialog -->
    <v-dialog v-model="mailDialog" max-width="auto">
      <v-card class="w-3/4 mx-auto">
        <v-card-title>
          <span class="ml-4 text-2xl">Set Paid Trough : {{ selectedItem?.CONSIGNEE }}</span>
        </v-card-title>
        <div class="p4 ml-4 mt-2 flex-auto">
          <h1>Dokumen : {{ selectedItem?.NO_DOK }} Tanggal {{ selectedItem?.TGL_DOK }}</h1>
        </div>
        <div class="p4 ml-4 mt-2 flex-auto">
          <label for="birthdaytime">Set Waktu Keluar : </label>
          <input type="datetime-local" id="birthdaytime" name="birthdaytime">
        </div>
        <div class="py-4 px-2">
          <table v-if="!loading && documentDetails.length" class="min-w-full bg-white">
            <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Container Number</th>
                <th class="text-left">Ukuran</th>
                <th class="text-left">Tipe</th>
                <th class="text-left">Jenis</th>
                <th class="text-left">ISO Code</th>
                <th class="text-left">Periksa</th>
                <th class="text-left">Pilih</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detail in documentDetails" :key="detail.ID">
                <td>{{ detail.ID }}</td>
                <td>{{ detail.NO_CONT }}</td>
                <td>{{ detail.UKR_CONT }}</td>
                <td>{{ detail.TIPE_CONT }}</td>
                <td>{{ detail.KD_CONT_JENIS }}</td>
                <td>{{ detail.ISO_CODE }}</td>
                <td>{{ detail.FL_PERIKSA }}</td>
                <td><v-checkbox :value="detail.NO_CONT" v-model="selectedDetails" /></td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-center" v-else-if="loading">Loading...</div>
          <div class="flex justify-center" v-else>Failed to load document details</div>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="mailDialog = false">Tutup</v-btn>
          <v-btn color="blue darken-1" text @click="ProsesSend()">Proses</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const data = ref({
  dokumen: []
});
const search = ref('');
let idSelectedItem = ref('');
const dialog = ref(false);
const mailDialog = ref(false);
const selectedItem = ref({});
const selectedMailItem = ref({});
const loading = ref(false);
const documentDetails = ref([]);
const selectedDetails = ref([]);

const headers = [
  { title: 'ID', value: 'ID' },
  { title: 'Nama', value: 'NAMA' },
  { title: 'No Dokumen', value: 'NO_DOK' },
  { title: 'Tanggal Dokumen', value: 'TGL_DOK' },
  { title: 'Status Input', value: 'STATUS_INPUT' },
  { title: 'Kode Request', value: 'KD_REQ' },
  { title: 'Consignee', value: 'CONSIGNEE' },
  { title: 'Response Request', value: 'RESPONSE_REQ' },
  { title: 'Keterangan', value: 'KETERANGAN' },
  { title: 'Options' },
];

const fetchdata = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    const dataFetch = await $fetch(`${apiBase}/gatepass_spjm_index`, {
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

const handleRowClick = (item) => {
  selectedItem.value = item;
  dialog.value = true;
};

const fetchDocumentDetails = async (id) => {
  loading.value = true;
  const token = localStorage.getItem('auth_token');
  const { data, error } = await useFetch(`${apiBase}/gatepass_spjm_detail`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    method: 'POST',
    body: { id },
  });

  if (error.value) {
    console.error('Error fetching document details:', error.value);
    documentDetails.value = [];
  } else {
    documentDetails.value = data.value; // Adjust this based on the structure of your response
  }
  loading.value = false;
};

const openMailModal = (item) => {
  selectedDetails.value = [];
  selectedMailItem.value = item;
  idSelectedItem = item.ID;
  mailDialog.value = true;
};

const ProsesSend = () => {
  console.log(selectedDetails.value);
  console.log(idSelectedItem);

  if (selectedDetails.value.length === 0) {
    alert('Harap memilih minimal 1 data')
  } else {
    alert('Send Data ID ' + idSelectedItem + ' ' + 'kontainer cek di console')
  }
};

//searchbox
const dokumenValue = ref('')
const kontainerValue = ref('')

const handleSubmit = async () => {
  loading.value = true;
  if (!dokumenValue.value && !kontainerValue.value) {
    fetchdata();
    return;
  }
  const token = localStorage.getItem('auth_token');
  try {
    const responseData = await $fetch(`${apiBase}/search_gatepass_spjm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        dok: dokumenValue.value,
        cont: kontainerValue.value
      })
    });

    data.value.dokumen = responseData;
  } catch (error) {
    console.error('Error:', error);
    alert(error);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchdata);

watch(dialog, (newVal) => {
  if (newVal && selectedItem.value) {
    fetchDocumentDetails(selectedItem.value.ID);
  }
});

watch(mailDialog, (newVal) => {
  if (newVal && selectedMailItem.value) {
    fetchDocumentDetails(selectedMailItem.value.ID);
  }
});


</script>

<style scoped></style>
