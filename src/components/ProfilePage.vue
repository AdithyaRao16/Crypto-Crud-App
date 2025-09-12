<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow-lg border-0 rounded-3">
        <div class="card-body text-center">
          <h5 class="mt-3">My Watchlist</h5>
          <ul class="list-group list-group-flush mt-2">
            <li v-if="watchlist.length === 0" class="list-group-item text-muted">
              No coins saved yet.
            </li>
            <li
              v-for="coin in watchlist"
              :key="coin.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              {{ coin.name }}
              <span class="badge bg-primary">${{ coin.price }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      watchlist: [],
    };
  },
  mounted() {
    const saved = localStorage.getItem("watchlist");
    this.watchlist = saved ? JSON.parse(saved) : [];
  },
};
</script>
