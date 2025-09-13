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
                placeholder="Enter Price (USD)"
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
                  >
                    Edit
                  </button>
                  <button
                    v-else
                    class="btn btn-sm btn-success me-2"
                    @click="saveCoin(coin)"
                  >
                    Save
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="deleteCoin(coin.id)"
                  >
                    Delete
                  </button>
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

<script>
export default {
  data() {
    return {
      newCoin: { name: "", price: "" },
      watchlist: [],
      error: "",
      loading: false,
    };
  },
  mounted() {
    const saved = localStorage.getItem("watchlist");
    this.watchlist = saved ? JSON.parse(saved) : [];
  },
  methods: {
    async addCoin() {
      this.error = "";
      this.loading = true;

      try {
      
        const res = await fetch("https://api.coingecko.com/api/v3/coins/list");
        const coins = await res.json();

        const isValid = coins.some(
          (coin) =>
            coin.id.toLowerCase() === this.newCoin.name.toLowerCase() ||
            coin.symbol.toLowerCase() === this.newCoin.name.toLowerCase() ||
            coin.name.toLowerCase() === this.newCoin.name.toLowerCase()
        );

        if (!isValid) {
          this.error = "Invalid cryptocurrency name! Please enter a valid one.";
          this.loading = false;
          return;
        }

        const coin = {
          id: Date.now(),
          name: this.newCoin.name,
          price: this.newCoin.price,
          editing: false,
        };
        this.watchlist.push(coin);
        this.saveToStorage();
        this.newCoin = { name: "", price: "" };
      } catch (e) {
        this.error = "Failed to verify coin. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    editCoin(coin) {
      coin.editing = true;
    },
    saveCoin(coin) {
      coin.editing = false;
      this.saveToStorage();
    },
    deleteCoin(id) {
      this.watchlist = this.watchlist.filter((c) => c.id !== id);
      this.saveToStorage();
    },
    saveToStorage() {
      localStorage.setItem("watchlist", JSON.stringify(this.watchlist));
    },
  },
};
</script>
