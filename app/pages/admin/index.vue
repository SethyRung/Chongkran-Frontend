<script setup lang="ts">
import type { ChartOptions } from "chart.js";
import type { AdminDailyCount, AdminRoleCount } from "#shared/types";

definePageMeta({ layout: "admin" });

const toast = useToast();

const { data: stats, pending, refresh } = await useFetch("/api/admin/stats");

const lineOptions = (legend = false): ChartOptions => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: "rgba(150,150,150,0.15)" } },
    x: { grid: { display: false } },
  },
  plugins: { legend: { display: legend } },
});

const barOptions = (): ChartOptions => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: "rgba(150,150,150,0.15)" } },
    x: { grid: { display: false }, ticks: { maxRotation: 45, minRotation: 0 } },
  },
});

const doughnutOptions = (): ChartOptions => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" as const, labels: { color: "rgba(150,150,150,0.6)" } },
  },
});

function dailySeriesToChartData(users: AdminDailyCount[], recipes: AdminDailyCount[]) {
  const labels = users.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  return {
    labels,
    datasets: [
      {
        label: "Users",
        data: users.map((d) => d.count),
        borderColor: "#eab308",
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: "Recipes",
        data: recipes.map((d) => d.count),
        borderColor: "#22c55e",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };
}

function singleSeriesToChartData(series: AdminDailyCount[]) {
  const labels = series.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  return {
    labels,
    datasets: [
      {
        label: "Recipes",
        data: series.map((d) => d.count),
        borderColor: "#eab308",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };
}

const recipesOverTimeChartData = computed(() => {
  const s = stats.value?.data;
  if (!s?.recipeTrendSeries) return null;
  const last14 = s.recipeTrendSeries.slice(-14);
  return singleSeriesToChartData(last14);
});

const usersByRoleChartData = computed(() => {
  const s = stats.value?.data;
  if (!s?.usersByRole) return null;
  const roleData = s.usersByRole as AdminRoleCount[];
  return {
    labels: roleData.map((r) => r.role.charAt(0).toUpperCase() + r.role.slice(1)),
    datasets: [
      {
        data: roleData.map((r) => r.count),
        backgroundColor: ["#eab308", "#f97316", "#22c55e"],
        borderWidth: 0,
      },
    ],
  };
});

const trendChartData = computed(() => {
  const s = stats.value?.data;
  if (!s?.userTrendSeries || !s?.recipeTrendSeries) return null;
  return dailySeriesToChartData(s.userTrendSeries, s.recipeTrendSeries);
});

const popularRecipesChartData = computed(() => {
  const s = stats.value?.data;
  if (!s?.popularRecipes) return null;
  return {
    labels: s.popularRecipes.map((r) => r.title),
    datasets: [
      {
        label: "Views",
        data: s.popularRecipes.map((r) => r.views),
        backgroundColor: "#eab308",
        borderRadius: 6,
      },
      {
        label: "Likes",
        data: s.popularRecipes.map((r) => r.likes),
        backgroundColor: "#22c55e",
        borderRadius: 6,
      },
    ],
  };
});

async function updateRecipeStatus(id: string, status: "approved" | "rejected") {
  try {
    const res = await $fetch(`/api/recipes/update-status?id=${id}&status=${status}`, {
      method: "PUT",
    });

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: `Recipe ${status}`,
        description: `The recipe has been ${status}.`,
        color: status === "approved" ? "success" : "warning",
        icon: status === "approved" ? "i-lucide-check-circle" : "i-lucide-x-circle",
      });
      await refresh();
    } else {
      toast.add({
        title: "Action failed",
        description: res.status.message || "Please try again.",
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } catch {
    toast.add({
      title: "Action failed",
      description: "Something went wrong.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  }
}

async function handleAuthorRequest(id: string, action: "approve" | "reject") {
  try {
    const res = await $fetch(`/api/users/authors/requests/${id}/${action}`, {
      method: "PATCH",
    });

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: `Request ${action}d`,
        description: `The author request has been ${action}d.`,
        color: action === "approve" ? "success" : "warning",
        icon: action === "approve" ? "i-lucide-check-circle" : "i-lucide:x-circle",
      });
      await refresh();
    } else {
      toast.add({
        title: "Action failed",
        description: res.status.message || "Please try again.",
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } catch {
    toast.add({
      title: "Action failed",
      description: "Something went wrong.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Dashboard">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <AdminStats :stats="stats?.data ?? undefined" :loading="pending" />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminChartCard
            title="Recipes created over time"
            subtitle="Last 14 days"
            :chart-data="recipesOverTimeChartData"
            :chart-options="lineOptions()"
          />

          <AdminChartCard
            title="Users by role"
            subtitle="Distribution of current roles"
            :chart-data="usersByRoleChartData"
            :chart-options="doughnutOptions()"
            chart-type="doughnut"
          />
        </div>

        <AdminChartCard
          title="New users & recipes"
          subtitle="Last 30 days"
          :chart-data="trendChartData"
          :chart-options="lineOptions(true)"
        />

        <AdminChartCard
          title="Most popular recipes"
          subtitle="Top recipes by views and likes"
          chart-type="bar"
          :chart-data="popularRecipesChartData"
          :chart-options="barOptions()"
        />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminPendingRecipes
            :recipes="stats?.data?.recentPendingRecipes"
            @update-status="updateRecipeStatus"
          />

          <AdminPendingAuthorRequests
            :requests="stats?.data?.recentPendingAuthorRequests"
            @handle-request="handleAuthorRequest"
          />
        </div>

        <AdminRecentActivity :items="stats?.data?.recentActivity" />
      </div>
    </template>
  </UDashboardPanel>
</template>
