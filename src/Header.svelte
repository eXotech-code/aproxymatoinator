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
    @media screen and (max-width: 600px) {
        h1 {
            font-size: 1.4em;
        }
    }

    @media screen and (min-width: 600px) {
        h1 {
            font-size: 2em;
        }
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem 1rem;
    }

    h1 {
		color: #3A445D;
		font-weight: 400;
        margin: 0;
        transition: font-size 0.5s ease;
	}
</style>