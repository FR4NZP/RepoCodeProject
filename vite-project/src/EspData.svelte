<script>
    import { onMount } from 'svelte';
    import axios from 'axios';

    let sensorData = [];

    onMount(async () => {
        try {
            const response = await axios.get('http://localhost:3000/data');
            sensorData = response.data;
        } catch (error) {
            console.error('Fehler beim Abrufen der Sensor-Daten:', error);
        }
    });
</script>

{#if sensorData.length > 0}
    <h2>Sensor Daten</h2>
    {#each sensorData as data}
        <p>{data.sensorType}: {data.value} - {data.timestamp}</p>
    {/each}
{:else}
    <p>Keine Daten verfügbar.</p>
{/if}
