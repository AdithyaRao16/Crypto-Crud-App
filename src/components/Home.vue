<template>
  <div>
    <h2 class="mb-4 text-center">Crypto Market Overview</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <table class="table table-hover table-striped align-middle">
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Price (USD)</th>
            <th>Market Cap</th>
            <th>24h Change</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(coin, index) in coins" :key="coin.id">
            <td>{{ index + 1 }}</td>
            <td>
              <img :src="coin.image" alt="logo" width="25" class="me-2" />
              {{ coin.name }}
            </td>
            <td>${{ coin.current_price.toLocaleString() }}</td>
            <td>${{ coin.market_cap.toLocaleString() }}</td>
            <td :class="coin.price_change_percentage_24h >= 0 ? 'text-success fw-bold' : 'text-danger fw-bold'">
              {{ coin.price_change_percentage_24h.toFixed(2) }}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const coins = ref([]);
const loading = ref(true);

onMounted(async () => {
  const res = await axios.get("http://localhost:3000/api/coins");
  coins.value = res.data;
  loading.value = false;
});
</script>
