@extends('layouts.app')

@section('title', __('Reports'))
@section('content_class', 'content-full')

@section('content')
    <script defer src="http://localhost:3000/static/js/bundle.js"></script>
    <div id="reports_root">
    </div>
@endsection

@section('stylesheets')
    @parent

@endsection

@section('body_bottom')
    @parent
@endsection