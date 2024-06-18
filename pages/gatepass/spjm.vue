<template>
    <div>
        <NuxtLink to="/gatepass/sppmp">ke sppmp</NuxtLink>
        <v-card title="Gatepass SPJM" flat>
            <template v-slot:text>
                <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
                    hide-details single-line></v-text-field>
            </template>

            <v-data-table :headers="headers" :items="desserts" :search="search" :loading="isLoading"
                loading-text="Loading... Please wait" @click:row="handleClick"></v-data-table>
        </v-card>

        <v-dialog v-model="dialog">
            <v-card>
                <v-card-title class="headline">{{ textshow }}</v-card-title>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">
                                Name
                            </th>
                            <th class="text-left">
                                Calories
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>hehe</td>
                            <td>hehehe</td>
                        </tr>
                    </tbody>
                </v-table>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="dialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>


<script>
export default {
    data() {
        return {
            textshow: 'now loading...',
            textdetail: 'now loading...',
            dialog: false,
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
            kontainer: [],
        }
    },
    mounted() {
        this.fetchdata()
    },
    methods: {
        async fetchdata() {
            const dataFetch = await $fetch('http://10.1.5.49/tpk_ipc/cgis/application.php/ServiceNewBos')
            this.desserts = dataFetch
            this.isLoading = false
            console.log(this.desserts)
        },
        async handleClick(event, row) {
            this.textshow = row.item.CONSIGNEE
            this.dialog = true
            var data = new FormData();
            data.append("id", row.item.ID);
            const kontainers = await $fetch('http://10.1.5.49/tpk_ipc/cgis/application.php/ServiceNewBos/get_detail_spjm', {
                method: 'POST',
                body: data
            })
            this.kontainer = kontainers
            console.log(this.kontainer)
        }
    },
    setup() {
        definePageMeta({
            middleware: ["auth"]
            // or middleware: 'auth'
        })

        return {}
    }
}
</script>