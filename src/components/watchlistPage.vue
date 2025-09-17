<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card shadow-lg border-0 rounded-3">
        <div class="card-body">
          <h4 class="mb-4 text-center">My Watchlist</h4>
          <form @submit.prevent="addCoin" class="row g-3 mb-3">
            <div class="col-md-5">
              <input
                v-model="newCoin.name"
                type="text"
                class="form-control"
                placeholder="Enter Coin Name (e.g. bitcoin)"
                required
              />
            </div>
            <div class="col-md-5">
              <input
                v-model="newCoin.price"
                type="number"
                class="form-control"
                placeholder="Enter Price"
                required
              />
            </div>
            <div class="col-md-2">
              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                {{ loading ? "Checking..." : "Add" }}
              </button>
            </div>
          </form>

          <div v-if="error" class="alert alert-danger text-center py-2">
            {{ error }}
          </div>

          <table v-if="watchlist.length > 0" class="table table-hover align-middle">
            <thead class="table-dark">
              <tr>
                <th>#</th>
                <th>Coin</th>
                <th>Price (USD)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(coin, index) in watchlist" :key="coin.id">
                <td>{{ index + 1 }}</td>
                <td v-if="!coin.editing">{{ coin.name }}</td>
                <td v-else>
                  <input v-model="coin.name" class="form-control" />
                </td>

                <td v-if="!coin.editing">${{ coin.price }}</td>
                <td v-else>
                  <input v-model="coin.price" type="number" class="form-control" />
                </td>

                <td>
                  <button
                    v-if="!coin.editing"
                    class="btn btn-sm btn-warning me-2"
                    @click="editCoin(coin)"
                  > Edit </button>
                  <button
                    v-else
                    class="btn btn-sm btn-success me-2"
                    @click="saveCoin(coin)"
                  > Save </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="deleteCoin(coin.id)"
                  > Delete </button>
                </td>
              </tr>
            </tbody>
          </table>

          <p v-else class="text-center text-muted">No coins in your watchlist yet.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

const newCoin = ref({ name: "", price: "" })
const watchlist = ref([])
const error = ref("")
const loading = ref(false)

onMounted(() => {
  const saved = localStorage.getItem("watchlist")
  watchlist.value = saved ? JSON.parse(saved) : []
})

const saveToStorage = () => {
  localStorage.setItem("watchlist", JSON.stringify(watchlist.value))
}

const addCoin = async () => {
  error.value = ""
  loading.value = true
  try {
    const res = await axios.get("https://api.coingecko.com/api/v3/coins/list")
    const coins = res.data
    const isValid = coins.some(
      (coin) =>
        coin.id.toLowerCase() === newCoin.value.name.toLowerCase() ||
        coin.symbol.toLowerCase() === newCoin.value.name.toLowerCase() ||
        coin.name.toLowerCase() === newCoin.value.name.toLowerCase()
    )
    if (!isValid) {
      error.value = "Invalid cryptocurrency name! Please enter a valid one."
      loading.value = false
      return
    }
    const coin = {
      id: Date.now(),
      name: newCoin.value.name,
      price: newCoin.value.price,
      editing: false,
    }
    watchlist.value.push(coin)
    saveToStorage()
    newCoin.value = { name: "", price: "" }
  } catch {
    error.value = "Failed to verify coin. Please try again."
  } finally {
    loading.value = false
  }
}

const editCoin = (coin) => {
  coin.editing = true
}

const saveCoin = (coin) => {
  coin.editing = false
  saveToStorage()
}

const deleteCoin = (id) => {
  watchlist.value = watchlist.value.filter((c) => c.id !== id)
  saveToStorage()
}
</script>
