<script lang="ts">
    import MdFlag from 'svelte-icons/md/MdFlag.svelte';
    import Button from './Button.svelte';
    import { lang } from "./stores";

    export let changeLang: () => void;
</script>

<header>
    <h1>Aproxymatoinator</h1>
    <Button label={$lang.lang} func={changeLang}>
        <MdFlag />
    </Button>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        width: 96%;
        padding: 1rem;
    }

    h1 {
		color: #3A445D;
        font-size: 2em;
		font-weight: 400;
        margin: 0;
	}
</style>