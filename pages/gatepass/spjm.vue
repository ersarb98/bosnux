<template>
  <v-container>
    <!-- Add a search input field -->
    <v-text-field v-model="search" label="Pencarian Cepat (3 Bulan Terakhir)" class="mb-4"
      append-icon="mdi-magnify"></v-text-field>

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

    <!-- Ketika dobel klik -->
    <v-dialog v-model="dialog" max-width="auto">
      <v-card>
        <div class="py-4 px-2">
          <v-card-title>
            <span class="headline">Detail Dokumen {{ selectedItem?.NO_DOK }}</span>
          </v-card-title>
        </div>
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
          <span class="headline">Set Paid Trough</span>
        </v-card-title>
        <div class="py-4 px-2">
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
  try {
    const token = localStorage.getItem('auth_token');
    console.log(token);
    const dataFetch = await $fetch(`${apiBase}/gatepass_spjm_index`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    data.value.dokumen = dataFetch;
    console.log(data.value.dokumen);
  } catch (error) {
    console.error('Error fetching data:', error);
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
  const { data, error } = await useFetch('http://127.0.0.1:8000/api/gatepass_spjm_detail', {
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
