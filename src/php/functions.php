<?php // functions.php
  $composer_autoload = realpath(__DIR__.'/') . '/vendor/autoload.php';
  if( file_exists( $composer_autoload ) ) {
    require_once $composer_autoload;
    if( WP_DEBUG === true ) { 
      // Display dev errors
      error_reporting(E_ALL);
      ini_set('display_errors', TRUE);
      ini_set('display_startup_errors', TRUE);
    }
  }
