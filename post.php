<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    var_dump($_FILES['file']);

    if (isset($_FILES['file'])) {
        // $errors = [];
        // $path = 'uploads/';
        // $extensions = ['jpg', 'jpeg', 'png', 'gif'];

        // $all_files = count($_FILES['file']['tmp_name']);

        // for ($i = 0; $i < $all_files; $i++) {
        //     $file_name = $_FILES['file']['name'][$i];
        //     $file_tmp = $_FILES['file']['tmp_name'][$i];
        //     $file_type = $_FILES['file']['type'][$i];
        //     $file_size = $_FILES['file']['size'][$i];
        //     $file_ext = strtolower(end(explode('.', $_FILES['file']['name'][$i])));

        //     $file = $path . $file_name;

        //     if (!in_array($file_ext, $extensions)) {
        //         $errors[] = 'Extension not allowed: ' . $file_name . ' ' . $file_type;
        //     }

        //     if ($file_size > 2097152) {
        //         $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;
        //     }

        //     if (empty($errors)) {
        //         move_uploaded_file($file_tmp, $file);
        //     }
        // }

        // if ($errors) print_r($errors);
    }
}