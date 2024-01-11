<script>

  import Register from "./Register.svelte";
  import Login from "./Login.svelte";
  import Router from "svelte-spa-router";
  import ESPDATA from "./EspData.svelte";


const routes= {
  "/": Login,
  "/login": Login,
  "/register": Register,
  "/data": ESPDATA,
}

</script>



  
  <nav>
    <a href="#/login">Login</a>
    <a href="#/register">Register</a>
    <a href="#/data">Deine Mutter</a>
  </nav>

  <main>
    <h1>Sensor daten</h1>
    <Router {routes} />


</main>

<style>
  h1{
    color: rgb(255, 72, 0);
  }
</style>