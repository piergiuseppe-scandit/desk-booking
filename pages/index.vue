<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Welcome to Scandit Desk Booking</h1>
    <p class="mb-4">Please use the navigation menu to:</p>
    <ul class="list-disc list-inside">
      <li>View and book desks on the <NuxtLink to="/map" class="text-blue-500 hover:underline">Office Map</NuxtLink></li>
      <li>Check desk status in the <NuxtLink to="/admin" class="text-blue-500 hover:underline">Admin Panel</NuxtLink></li>
    </ul>
  </div>
</template>