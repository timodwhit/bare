<?php

 /**
  * hook_preprocess_html(&$vars)
  */
 function bare_subtheme_preprocess_html(&$vars) {
    // Viewport
  $viewport = array(
    '#tag' => 'meta',
    '#attributes' => array(
      'name' => 'viewport',
      'content' => 'initial-scale=1.0',
    ),
  );
  drupal_add_html_head($viewport, 'viewport');

  // Force IE to use most up-to-date render engine.
  $xua = array(
    '#tag' => 'meta',
    '#attributes' => array(
      'http-equiv' => 'X-UA-Compatible',
      'content' => 'IE=edge',
    ),
  );
  drupal_add_html_head($xua, 'x-ua-compatible');
 }
