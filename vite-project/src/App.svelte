<script>
  import Register from "./Register.svelte";
  import Login from "./Login.svelte";
  import Router from "svelte-spa-router";
  import EspData from "./EspData.svelte";
  import DeviceData from "./DeviceData.svelte";
  import RaumData from "./RaumData.svelte";
  import { isLoggedIn } from "./store";
  import { push } from "svelte-spa-router";
  import AddEsp from "./AddEsp.svelte";

  const routes = {
    "/": Login,
    "/login": Login,
    "/register": Register,
    "/data": EspData,
    "/devicedata/:mac": DeviceData,
    "/addesp": AddEsp,
    "/raumdata": RaumData,
  };

  function logoutUser() {
    // isLoggedIn.update(prev=>false);
    isLoggedIn.set(false);
    localStorage.clear();
    push("/login").then(() => {
      window.location.reload();
    });
  }
</script>

<nav>
  {#if $isLoggedIn}
    <a href="#/raumdata">Räume</a>
    <a href="#/data">Devices</a>
    <a href="#/login" on:click={logoutUser}>Logout</a>
    <a href="#/addesp">Add Device</a>
  {:else}
    <a href="#/login">Login</a>
    <a href="#/register">Register</a>
  {/if}
</nav>

<main>
  <Router {routes} />
</main>

<style>
  :global(html),
  :global(body) {
    margin: 0;
    padding: 0;
    height: 100%;
    /* overflow: hidden; Verhindert Scrollen auf der gesamten Seite */
  }
  /* Basis-Layout */
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    color: #333;
  }

  /* Navigationsleiste */
  nav {
    background-color: #007bff;
    padding: 10px 0;
    text-align: center;
  }

  nav a {
    color: white;
    margin: 0 15px;
    text-decoration: none;
    font-size: 18px;
    transition: color 0.3s ease;
  }

  nav a:hover {
    color: #ccc;
    text-decoration: underline;
  }

  /* Hauptinhalt */
  main {
    padding: 20px;
    text-align: center;
  }

  /* h1 {
    color: #007bff;
  } */
</style>
