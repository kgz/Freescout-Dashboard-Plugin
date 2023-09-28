@extends('layouts.app')

@section('title', __('Reports'))
@section('content_class', 'content-full')

@section('header')
    <meta name="csrf-token" content="{{ csrf_token() }}">


@section('content')
<script type="module">
    import RefreshRuntime from "http://freescout.example.com:4688/@react-refresh"
    RefreshRuntime.injectIntoGlobalHook(window)
    window.$RefreshReg$ = () => {}
    window.$RefreshSig$ = () => (type) => type
    window.__vite_plugin_react_preamble_installed__ = true
</script>
<script type="module" src="http://freescout.example.com:4688/src/main.tsx" defer></script>
    
<div id="root"></div>
@endsection

@section('stylesheets')
    @parent

@endsection

@section('body_bottom')
    @parent
@endsection