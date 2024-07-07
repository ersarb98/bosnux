<template>
  <v-container>
    <!-- Add a search input field -->
    <v-text-field v-model="search" label="Pencarian Cepat (3 Bulan Terakhir)" class="mb-4" append-icon="mdi-magnify"></v-text-field>

    <v-data-table :headers="headers" :items="filteredItems" class="elevation-1" :search="search">
      <template v-slot:item="{ item }">
        <tr @dblclick="handleRowClick(item)">
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
            <v-btn color="primary" @click="openMailModal(item)">Send Mail</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- Row Details Modal Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">Row Details</span>
        </v-card-title>
        <v-card-text>
          <div>ID: {{ selectedItem.ID }}</div>
          <div>Nama: {{ selectedItem.NAMA }}</div>
          <div>No Dokumen: {{ selectedItem.NO_DOK }}</div>
          <div>Tanggal Dokumen: {{ selectedItem.TGL_DOK }}</div>
          <div>Status Input: {{ selectedItem.STATUS_INPUT }}</div>
          <div>Kode Request: {{ selectedItem.KD_REQ }}</div>
          <div>Consignee: {{ selectedItem.CONSIGNEE }}</div>
          <div>Response Request: {{ selectedItem.RESPONSE_REQ }}</div>
          <div>Keterangan: {{ selectedItem.KETERANGAN }}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Send Mail Modal Dialog -->
    <v-dialog v-model="mailDialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">Send Mail</span>
        </v-card-title>
        <v-card-text>
          <!-- Add your mail form here -->
          <div>Email: {{ selectedMailItem.EMAIL }}</div>
          <v-text-field v-model="mailSubject" label="Subject"></v-text-field>
          <v-textarea v-model="mailBody" label="Body"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="sendMail">Send</v-btn>
          <v-btn color="blue darken-1" text @click="mailDialog = false">Close</v-btn>
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
const dialog = ref(false);
const mailDialog = ref(false);
const selectedItem = ref({});
const selectedMailItem = ref({});
const mailSubject = ref('');
const mailBody = ref('');

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

const openMailModal = (item) => {
  selectedMailItem.value = item;
  mailDialog.value = true;
};

const sendMail = () => {
  // Add your mail sending logic here
  console.log('Sending mail to:', selectedMailItem.value.EMAIL);
  console.log('Subject:', mailSubject.value);
  console.log('Body:', mailBody.value);
  mailDialog.value = false;
};

onMounted(fetchdata);
</script>

<style scoped>
/* Add any additional styles here */
</style>
