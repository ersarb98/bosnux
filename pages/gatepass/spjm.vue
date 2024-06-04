<template>
    <div>
        <NuxtLink to="/gatepass/sppmp">ke sppmp</NuxtLink>
        <v-card title="Gatepass SPJM" flat>
            <template v-slot:text>
                <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
                    hide-details single-line></v-text-field>
            </template>

            <v-data-table :headers="headers" :items="desserts" :search="search" :loading="isLoading"
                loading-text="Loading... Please wait"></v-data-table>
        </v-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isLoading: true,
            search: '',
            headers: [
                {
                    align: 'start',
                    key: 'ID',
                    title: 'ID',
                },
                { key: 'NAMA', title: 'NAMA' },
                { key: 'NO_DOK', title: 'NO_DOK' },
                { key: 'TGL_DOK', title: 'TGL_DOK' },
                { key: 'STATUS_INPUT', title: 'STATUS_INPUT' },
                { key: 'KD_REQ', title: 'KD_REQ' },
                { key: 'RESPONSE_REQ', title: 'RESPONSE_REQ' },
                { key: 'KETERANGAN', title: 'KETERANGAN' },
            ],
            desserts: [],
        }
    },
    mounted() {
        this.fetchdata()
    },
    methods: {
        async fetchdata() {
            const dataFetch = await $fetch('https://bos.multiterminal.co.id/tpk_ipc/cgis/application.php/ServiceNewBos')
            this.desserts = dataFetch
            this.isLoading = false
            console.log(this.desserts)
        }
        // handleClick(event, row) {
        //     this.textshow = row.item.title
        //     this.textdetail = row.item.description
        //     this.dialog = true
        //     console.log("Clicked item: ", row.item.title)
        // }
    }
}
</script>