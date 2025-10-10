<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <!-- <meta name="csrf-token" content="{{ csrf_token() }}"> -->
  <!-- <script>
    window.csrfToken = "{{ csrf_token() }}";
  </script> -->
  @viteReactRefresh
  @vite(['resources/js/app.tsx', 'resources/css/app.css'])
  @inertiaHead
</head>

<body>
  @inertia
</body>

</html>