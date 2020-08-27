<template>
    <a @click="goSearch(gubun, tag.tag)">#{{tag.tag}}</a>
</template>
<script>
import {mixin} from '@/components/mixins/mixins'
export default {
    mixins : [mixin],
    props: ['tag', 'gubun'],
}
</script>