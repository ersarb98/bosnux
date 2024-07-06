<template>
    <v-container>
      <!-- Add a search input field -->
      <v-text-field
        v-model="search"
        label="Pencarian Cepat (3 Bulan Terakhir)"
        class="mb-4"
        append-icon="mdi-magnify"
      ></v-text-field>
      
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        class="elevation-1"
        :search="search"
      >
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
          </tr>
        </template>
      </v-data-table>
  
      <!-- Modal Dialog -->
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
  const selectedItem = ref({});
  
  const headers = [
    { title: 'ID', value: 'ID' },
    { title: 'Nama', value: 'NAMA' },
    { title: 'No Dokumen', value: 'NO_DOK' },
    { title: 'Tanggal Dokumen', value: 'TGL_DOK' },
    { title: 'Status Input', value: 'STATUS_INPUT' },
    { title: 'Kode Request', value: 'KD_REQ' },
    { title: 'Consignee', value: 'CONSIGNEE' },
    { title: 'Response Request', value: 'RESPONSE_REQ' },
    { title: 'Keterangan', value: 'KETERANGAN' }
  ];
  
  const fetchdata = async () => {
    const dataFetch = await $fetch(`${apiBase}/gatepass_spjm_index`);
    data.value.dokumen = dataFetch;
    console.log(data.value.dokumen);
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
  
  onMounted(fetchdata);
  </script>
  
  <style scoped>
  /* Add any additional styles here */
  </style>
  